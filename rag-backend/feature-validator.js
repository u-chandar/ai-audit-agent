import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const envFallbackPath = path.join(repoRoot, '.azure', 'rag-sandbox', '.env');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex < 0) return acc;
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    acc[key] = rawValue.replace(/^"|"$/g, '');
    return acc;
  }, {});
}

function getAzureOpenAiRuntimeConfig() {
  const fallback = parseEnvFile(envFallbackPath);
  return {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || fallback.AZURE_OPENAI_ENDPOINT || '',
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || fallback.AZURE_OPENAI_API_VERSION || '2024-10-21',
    deployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || fallback.AZURE_OPENAI_CHAT_DEPLOYMENT || 'gpt-4o-mini',
    apiKey: process.env.AZURE_OPENAI_API_KEY || '',
    source: process.env.AZURE_OPENAI_API_KEY ? 'process-env' : 'deterministic-fallback'
  };
}

function buildDeterministicFeatureValidation({ checklist = [], productState = {} } = {}) {
  const passed = [];
  const missing = [];
  checklist.forEach((item) => {
    if (productState[item.key]) {
      passed.push({ key: item.key, label: item.label, rationale: item.successText });
    } else {
      missing.push({ key: item.key, label: item.label, rationale: item.missingText });
    }
  });
  const score = checklist.length ? Math.round((passed.length / checklist.length) * 100) : 0;
  return {
    mode: 'deterministic-fallback',
    score,
    summary: score === 100
      ? 'Deterministic validation found all requested product features in the current design state.'
      : `Deterministic validation found ${passed.length} of ${checklist.length} requested product features.`,
    passed,
    missing
  };
}

async function buildRealtimeLlmValidation({ checklist = [], productState = {}, context = {} } = {}) {
  const config = getAzureOpenAiRuntimeConfig();
  if (!config.endpoint || !config.apiKey) return null;

  const prompt = {
    checklist,
    productState,
    context,
    instructions: [
      'Evaluate whether the product design includes each requested feature.',
      'Return strict JSON only.',
      'Schema: {"score":number,"summary":string,"passed":[{"key":string,"label":string,"rationale":string}],"missing":[{"key":string,"label":string,"rationale":string}]}'
    ]
  };

  const response = await fetch(`${config.endpoint}openai/deployments/${config.deployment}/chat/completions?api-version=${config.apiVersion}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a compliance product feature validator. Respond with valid JSON only.' },
        { role: 'user', content: JSON.stringify(prompt) }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI validation failed: ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return {
    mode: 'realtime-llm',
    score: Number(parsed.score || 0),
    summary: parsed.summary || 'Real-time LLM validation completed.',
    passed: Array.isArray(parsed.passed) ? parsed.passed : [],
    missing: Array.isArray(parsed.missing) ? parsed.missing : []
  };
}

export async function validateFeatureCompleteness({ checklist = [], productState = {}, context = {} } = {}) {
  try {
    const realtime = await buildRealtimeLlmValidation({ checklist, productState, context });
    if (realtime) return realtime;
  } catch (error) {
    return {
      ...buildDeterministicFeatureValidation({ checklist, productState }),
      mode: 'deterministic-fallback',
      summary: `Real-time LLM validation unavailable. ${error.message}`
    };
  }

  return buildDeterministicFeatureValidation({ checklist, productState });
}