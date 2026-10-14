import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRagRouter } from './rag-backend/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 8080);
const distPath = path.join(__dirname, 'dist');

app.disable('x-powered-by');
app.use('/api/rag', createRagRouter());
app.use(express.static(distPath));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, service: 'aegis-ai-audit', port });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next();
    return;
  }

  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Aegis app listening on http://0.0.0.0:${port}`);
});