# Azure Deployment Plan

Status: Blocked - Awaiting Azure RBAC

## Objective

Prepare and deploy the `ai-audit-agent` product to the sandbox Azure environment using `azd`, existing Azure OpenAI and Document Intelligence resources, and a new sandbox environment named `rag-sandbox`.

## Workspace Mode

- Mode: Modify existing project
- App type: Existing Vite frontend plus Node-based local RAG API backend
- Current deployment state: No `azure.yaml` or Azure infrastructure artifacts in this project

## User-Specified Azure Context

- Subscription: `<subscription-id>`
- Resource group: `<resource-group-name>`
- Location: `<azure-region>`
- Environment name: `rag-sandbox`
- Existing Azure OpenAI endpoint: `<azure-openai-endpoint>`
- Existing Azure OpenAI resource ID: `<azure-openai-resource-id>`
- Chat deployment: `gpt-4o-mini`
- Embedding deployment: `text-embedding-ada-002`
- Embedding dimensions: `1536`
- Azure OpenAI API version: `2024-10-21`
- Existing Document Intelligence endpoint: `<document-intelligence-endpoint>`
- Existing Document Intelligence resource ID: `<document-intelligence-resource-id>`

## Proposed Architecture

- Frontend: Node-served web app for the existing Vite build output
- Backend: Node RAG API service with persistent local vector store path mapped to Azure storage or container filesystem
- Azure hosting target: Azure Container Apps via `azd`
- Existing AI dependencies: Reuse existing Azure OpenAI and Document Intelligence resources through environment configuration, not reprovisioning

## Required Artifacts

- `azure.yaml`
- `infra/` Bicep files for Azure Container Apps and supporting resources
- Production-ready backend hosting configuration
- Frontend serving strategy integrated into deployable app shape
- `.env` / azd environment mappings for provided Azure resources

## Completed Preparation

- Added `azure.yaml` for azd-based Container Apps deployment
- Added `infra/main.bicep` for Log Analytics, Container Apps environment, storage account, Azure file share, and Container App
- Added production `server.js` to serve the built frontend and `/api/rag` from one process
- Added Dockerfile and `.dockerignore`
- Verified frontend build
- Verified local production server startup
- Verified embedded `/api/rag/health` route
- Validated `azure.yaml`
- Compiled `infra/main.bicep`
- Authenticated with `azd auth login`
- Created `rag-sandbox` azd environment and set provided Azure service values
- Retried `azd up` with remote build enabled

## Current Blocker

- Azure deployment is blocked by RBAC on the target resource group
- Error: `AuthorizationFailed` on `Microsoft.Resources/deployments/validate/action`
- Signed-in user: `ramachandran@bwxt.com`
- Required: sufficient deployment permissions on the target scope, typically `Contributor` or higher on the resource group, and `Owner` or `User Access Administrator` if future template changes include role assignments

## Planned Execution Steps

1. Analyze the existing app structure and choose the smallest deployable Azure shape for frontend + RAG backend.
2. Prepare Azure deployment artifacts for `azd`.
3. Configure sandbox environment values for Azure OpenAI and Document Intelligence.
4. Validate the prepared Azure artifacts locally where possible.
5. Confirm Azure authentication and `azd` availability.
6. If approved, proceed with `azd auth login`, `azd env new`, environment variable setup, validation, and deployment workflow.

## Risks / Constraints

- Azure extension auth context is currently unsigned.
- CLI auth for `azd` may require interactive login.
- This project currently has no Azure deployment artifacts.
- Azure Government endpoints must be preserved exactly.
- Existing local RAG store is file-based; production persistence may require an Azure-mounted or storage-backed path.

## Validation Plan

- Verify frontend build
- Verify backend RAG API startup
- Validate `azure.yaml`
- Validate infrastructure files before deployment

## Approval Gate

Plan approved. Preparation is complete. Remaining steps require Azure CLI/azd authentication, environment creation, environment variable setup, formal azure-validate workflow, and deployment.