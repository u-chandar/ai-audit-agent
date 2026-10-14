import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PolicyVectorStore } from './vector-store.js';
import { estimateTechnicalLandscapeWithProvider } from './technical-estimator.js';
import { validateFeatureCompleteness } from './feature-validator.js';

export function createRagRouter({ port = Number(process.env.AEGIS_RAG_PORT || 8765) } = {}) {
  const router = express.Router();
  const store = new PolicyVectorStore();

  router.use(express.json({ limit: '10mb' }));

  router.get('/health', async (_req, res) => {
    const status = await store.status();
    res.json({ ok: true, port, status });
  });

  router.get('/status', async (_req, res) => {
    try {
      const status = await store.status();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Unable to read RAG status' });
    }
  });

  router.post('/rebuild', async (req, res) => {
    try {
      const { documents = [], metadata = {} } = req.body || {};
      if (!Array.isArray(documents) || documents.length === 0) {
        res.status(400).json({ error: 'documents payload is required for rebuild' });
        return;
      }

      const state = await store.rebuild(documents, metadata);
      res.json({
        ok: true,
        updatedAt: state.updatedAt,
        stats: state.stats,
        metadata: state.metadata || null,
        model: state.model
      });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Policy RAG rebuild failed' });
    }
  });

  router.post('/query', async (req, res) => {
    try {
      const { question = '', topK = 4 } = req.body || {};
      if (!String(question).trim()) {
        res.status(400).json({ error: 'question is required' });
        return;
      }

      const response = await store.query(String(question), Number(topK) || 4);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Policy query failed' });
    }
  });

  router.post('/estimate', async (req, res) => {
    try {
      const {
        runContext = {},
        selectedFrameworks = [],
        result = {},
        aiComponents = []
      } = req.body || {};

      if (!runContext || !Array.isArray(selectedFrameworks) || !Array.isArray(aiComponents)) {
        res.status(400).json({ error: 'runContext, selectedFrameworks, and aiComponents are required' });
        return;
      }

      const estimate = estimateTechnicalLandscapeWithProvider({
        runContext,
        selectedFrameworks,
        result,
        aiComponents
      });

      res.json({ ok: true, estimate });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Technical estimate failed' });
    }
  });

  router.post('/validate-features', async (req, res) => {
    try {
      const { checklist = [], productState = {}, context = {} } = req.body || {};
      if (!Array.isArray(checklist)) {
        res.status(400).json({ error: 'checklist array is required' });
        return;
      }

      const validation = await validateFeatureCompleteness({ checklist, productState, context });
      res.json({ ok: true, validation });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Feature validation failed' });
    }
  });

  return router;
}

export function createRagApp({ port = Number(process.env.AEGIS_RAG_PORT || 8765) } = {}) {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use('/api/rag', createRagRouter({ port }));
  return app;
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const port = Number(process.env.AEGIS_RAG_PORT || 8765);
  const app = createRagApp({ port });
  app.listen(port, '127.0.0.1', () => {
    console.log(`Aegis policy RAG API listening on http://127.0.0.1:${port}`);
  });
}