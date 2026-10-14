import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = process.env.AEGIS_RAG_STORE_PATH || path.join(DATA_DIR, 'policy-rag-store.json');
const MODEL_NAME = 'local-hash-embedding-v1';
const VECTOR_DIMENSIONS = 384;

function dotProduct(left, right) {
  let total = 0;
  for (let index = 0; index < left.length; index += 1) {
    total += left[index] * right[index];
  }
  return total;
}

function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/.-]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function hashToken(token, seed = 2166136261) {
  let hash = seed;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, item) => sum + item * item, 0));
  if (!magnitude) {
    return vector;
  }
  return vector.map((item) => item / magnitude);
}

async function embedText(text) {
  const vector = new Array(VECTOR_DIMENSIONS).fill(0);
  const tokens = tokenize(text);
  tokens.forEach((token, tokenIndex) => {
    const hash = hashToken(token, 2166136261 + tokenIndex);
    const index = hash % VECTOR_DIMENSIONS;
    const direction = ((hash >>> 8) & 1) === 0 ? 1 : -1;
    const weight = Math.max(1, Math.min(4, Math.ceil(token.length / 4)));
    vector[index] += direction * weight;
  });
  return normalizeVector(vector);
}

export class PolicyVectorStore {
  constructor() {
    this.data = null;
  }

  async ensureLoaded() {
    if (this.data) {
      return this.data;
    }

    try {
      const raw = await fs.readFile(STORE_PATH, 'utf8');
      this.data = JSON.parse(raw);
    } catch {
      this.data = {
        model: MODEL_NAME,
        updatedAt: null,
        documents: [],
        stats: { docCount: 0, frameworkCount: 0, policyCount: 0, policyDocCount: 0, gapCount: 0, sourceCount: 0 }
      };
    }

    return this.data;
  }

  async rebuild(documents, metadata = {}) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const enriched = [];

    for (const document of documents) {
      const embedding = await embedText(`${document.title}\n${document.summary}\n${document.body}`);
      enriched.push({ ...document, embedding });
    }

    const stats = {
      docCount: enriched.length,
      frameworkCount: enriched.filter((item) => item.kind === 'framework').length,
      policyCount: enriched.filter((item) => item.kind === 'policy' || item.kind === 'policy-doc').length,
      policyDocCount: enriched.filter((item) => item.kind === 'policy-doc').length,
      gapCount: enriched.filter((item) => item.kind === 'gap').length,
      sourceCount: enriched.filter((item) => item.kind === 'source').length
    };

    this.data = {
      model: MODEL_NAME,
      updatedAt: new Date().toISOString(),
      documents: enriched,
      metadata,
      stats
    };

    await fs.writeFile(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    return this.data;
  }

  async status() {
    const state = await this.ensureLoaded();
    return {
      model: state.model,
      updatedAt: state.updatedAt,
      stats: state.stats,
      metadata: state.metadata || null
    };
  }

  async query(question, topK = 4) {
    const state = await this.ensureLoaded();
    if (!state.documents.length) {
      return {
        answer: 'The policy RAG store is empty. Refresh the knowledge base before asking policy or framework questions.',
        citations: [],
        matches: []
      };
    }

    const questionEmbedding = await embedText(question);
    const matches = state.documents
      .map((document) => ({
        document,
        score: dotProduct(questionEmbedding, document.embedding)
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, topK);

    const frameworkMatches = matches.filter((item) => item.document.kind === 'framework').map((item) => item.document.title).slice(0, 2);
    const policyMatches = matches.filter((item) => item.document.kind === 'policy' || item.document.kind === 'policy-doc').map((item) => item.document.title).slice(0, 2);
    const gapMatches = matches.filter((item) => item.document.kind === 'gap').map((item) => item.document.title).slice(0, 2);
    const sourceMatches = matches.filter((item) => item.document.kind === 'source').map((item) => item.document.summary).slice(0, 1);

    const answerParts = [];
    if (frameworkMatches.length) answerParts.push(`Relevant frameworks: ${frameworkMatches.join(', ')}.`);
    if (policyMatches.length) answerParts.push(`Pinned policy resources: ${policyMatches.join(', ')}.`);
    if (gapMatches.length) answerParts.push(`Current gap signals: ${gapMatches.join(', ')}.`);
    if (sourceMatches.length) answerParts.push(`Comparison target: ${sourceMatches.join(', ')}.`);
    answerParts.push(`Grounded summary: ${matches.map((item) => item.document.summary).join(' ')}`);

    return {
      answer: answerParts.join(' '),
      citations: matches.flatMap((item) => item.document.citations || []).slice(0, 8),
      matches: matches.map((item) => ({
        id: item.document.id,
        kind: item.document.kind,
        title: item.document.title,
        summary: item.document.summary,
        score: Number(item.score.toFixed(4))
      })),
      metadata: state.metadata || null
    };
  }
}