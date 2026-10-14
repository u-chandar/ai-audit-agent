import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const envFallbackPath = path.join(repoRoot, '.azure', 'rag-sandbox', '.env');

const deploymentPricingProfiles = {
  'gpt-4o-mini': { promptPer1M: 0.15, completionPer1M: 0.6, retrievalPer1M: 0.16 },
  'gpt-4.1-mini': { promptPer1M: 0.4, completionPer1M: 1.6, retrievalPer1M: 0.16 },
  default: { promptPer1M: 0.28, completionPer1M: 1.1, retrievalPer1M: 0.16 }
};

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

function getAzureOpenAiConfig() {
  const fallback = parseEnvFile(envFallbackPath);
  const chatDeployment = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || fallback.AZURE_OPENAI_CHAT_DEPLOYMENT || 'gpt-4o-mini';
  return {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || fallback.AZURE_OPENAI_ENDPOINT || '',
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || fallback.AZURE_OPENAI_API_VERSION || '2024-10-21',
    chatDeployment,
    resourceId: process.env.AZURE_OPENAI_RESOURCE_ID || fallback.AZURE_OPENAI_RESOURCE_ID || '',
    source: process.env.AZURE_OPENAI_ENDPOINT ? 'process-env' : (fallback.AZURE_OPENAI_ENDPOINT ? 'repo-env' : 'default-profile'),
    pricing: deploymentPricingProfiles[chatDeployment] || deploymentPricingProfiles.default
  };
}

function getLlmAssistFactor(mode) {
  if (mode === 'Model-led') return 1.22;
  if (mode === 'Adversarial') return 1.18;
  if (mode === 'Independent') return 1.1;
  if (mode === 'Hybrid') return 1.14;
  return 1.0;
}

export function estimateTechnicalLandscapeWithProvider({ runContext = {}, selectedFrameworks = [], result = {}, aiComponents = [] } = {}) {
  const azureConfig = getAzureOpenAiConfig();
  const sourceKind = String(runContext.sourceKind || '').toLowerCase();
  const riskCount = Array.isArray(result?.reflection?.risks) ? result.reflection.risks.length : Number(result?.riskCount || 0);
  const sourceFactor = sourceKind.includes('github') ? 1.26 : sourceKind.includes('design') ? 0.92 : sourceKind.includes('data source') ? 1.08 : 1.16;
  const frameworkFactor = 1 + Math.min(0.55, selectedFrameworks.length * 0.045);
  const riskFactor = 1 + Math.min(0.35, riskCount * 0.05);

  const basePrompt = aiComponents.reduce((sum, item) => sum + Number(item.input || 0), 0);
  const baseCompletion = aiComponents.reduce((sum, item) => sum + Number(item.output || 0), 0);
  const baseBuild = aiComponents.reduce((sum, item) => sum + Number(item.build || 0), 0);

  const approxPrompt = basePrompt * sourceFactor * frameworkFactor;
  const approxCompletion = baseCompletion * frameworkFactor;
  const approxReasoning = (approxPrompt + approxCompletion) * 0.18 * riskFactor;
  const retrievalAndIndexing = baseBuild * (sourceKind.includes('design') ? 0.52 : 0.64);
  const totalEstimated = approxPrompt + approxCompletion + approxReasoning + retrievalAndIndexing;
  const billablePrompt = approxPrompt + retrievalAndIndexing * 0.32;
  const billableCompletion = approxCompletion + approxReasoning;
  const pricing = azureConfig.pricing;
  const configuredCost = (billablePrompt / 1_000_000) * pricing.promptPer1M
    + (billableCompletion / 1_000_000) * pricing.completionPer1M
    + (retrievalAndIndexing / 1_000_000) * pricing.retrievalPer1M;

  const componentBreakdown = aiComponents.map((item) => {
    const llmFactor = getLlmAssistFactor(item.mode);
    const baseline = Number(item.input || 0) + Number(item.output || 0);
    const sourceAdjusted = baseline * sourceFactor;
    const frameworkAdjusted = sourceAdjusted * frameworkFactor;
    const llmAdjusted = frameworkAdjusted * llmFactor;
    const riskAdjusted = llmAdjusted * (1 + ((riskFactor - 1) * 0.5));
    return {
      name: item.name,
      mode: item.mode,
      latency: item.latency,
      llmFactor,
      input: Number(item.input || 0),
      output: Number(item.output || 0),
      build: Number(item.build || 0),
      riskAdjusted
    };
  });

  return {
    approxPrompt,
    approxCompletion,
    approxReasoning,
    retrievalAndIndexing,
    totalEstimated,
    estimatedCostLow: configuredCost,
    estimatedCostHigh: configuredCost,
    sourceFactor,
    frameworkFactor,
    riskFactor,
    componentBreakdown,
    provider: {
      endpoint: azureConfig.endpoint,
      apiVersion: azureConfig.apiVersion,
      chatDeployment: azureConfig.chatDeployment,
      resourceId: azureConfig.resourceId,
      source: azureConfig.source,
      pricing
    }
  };
}