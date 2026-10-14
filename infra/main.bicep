targetScope = 'resourceGroup'

@description('Azure location for all new resources.')
param location string = resourceGroup().location

@description('Environment name used by azd.')
@minLength(3)
param environmentName string

@description('Container image to deploy for the app.')
param webImageName string

@description('Azure OpenAI endpoint.')
param azureOpenAiEndpoint string

@description('Azure OpenAI resource ID.')
param azureOpenAiResourceId string

@description('Azure OpenAI chat deployment name.')
param azureOpenAiChatDeployment string

@description('Azure OpenAI embedding deployment name.')
param azureOpenAiEmbeddingDeployment string

@description('Embedding dimension count.')
param embeddingDimensions string

@description('Azure OpenAI API version.')
param azureOpenAiApiVersion string

@description('Azure Document Intelligence endpoint.')
param azureFormRecognizerEndpoint string

@description('Azure Document Intelligence resource ID.')
param azureFormRecognizerResourceId string

var normalizedName = toLower(replace(take('${environmentName}aegisaudit', 20), '-', ''))
var storageAccountName = take('aeg${normalizedName}st', 24)
var logAnalyticsName = '${environmentName}-law'
var containerEnvName = '${environmentName}-cae'
var containerAppName = '${environmentName}-aegis-web'
var fileShareName = 'policy-rag-store'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    accessTier: 'Hot'
  }
}

resource fileService 'Microsoft.Storage/storageAccounts/fileServices@2023-05-01' = {
  parent: storageAccount
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-05-01' = {
  parent: fileService
  name: fileShareName
}

resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource managedEnvironmentStorage 'Microsoft.App/managedEnvironments/storages@2024-03-01' = {
  parent: managedEnvironment
  name: 'policyragstore'
  properties: {
    azureFile: {
      accountName: storageAccount.name
      accountKey: storageAccount.listKeys().keys[0].value
      accessMode: 'ReadWrite'
      shareName: fileShareName
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'auto'
      }
      activeRevisionsMode: 'Single'
    }
    template: {
      containers: [
        {
          name: 'web'
          image: webImageName
          env: [
            {
              name: 'PORT'
              value: '8080'
            }
            {
              name: 'AEGIS_RAG_STORE_PATH'
              value: '/app/rag-backend/data/policy-rag-store.json'
            }
            {
              name: 'AZURE_OPENAI_ENDPOINT'
              value: azureOpenAiEndpoint
            }
            {
              name: 'AZURE_OPENAI_RESOURCE_ID'
              value: azureOpenAiResourceId
            }
            {
              name: 'AZURE_OPENAI_CHAT_DEPLOYMENT'
              value: azureOpenAiChatDeployment
            }
            {
              name: 'AZURE_OPENAI_EMBEDDING_DEPLOYMENT'
              value: azureOpenAiEmbeddingDeployment
            }
            {
              name: 'EMBEDDING_DIMENSIONS'
              value: embeddingDimensions
            }
            {
              name: 'AZURE_OPENAI_API_VERSION'
              value: azureOpenAiApiVersion
            }
            {
              name: 'AZURE_FORM_RECOGNIZER_ENDPOINT'
              value: azureFormRecognizerEndpoint
            }
            {
              name: 'AZURE_FORM_RECOGNIZER_RESOURCE_ID'
              value: azureFormRecognizerResourceId
            }
          ]
          resources: {
            cpu: json('0.75')
            memory: '1.5Gi'
          }
          volumeMounts: [
            {
              volumeName: 'rag-data'
              mountPath: '/app/rag-backend/data'
            }
          ]
        }
      ]
      volumes: [
        {
          name: 'rag-data'
          storageType: 'AzureFile'
          storageName: managedEnvironmentStorage.name
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
  }
}

output AZURE_CONTAINER_APP_NAME string = containerApp.name
output AZURE_CONTAINER_APP_URL string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
output AZURE_CONTAINER_APP_IDENTITY_PRINCIPAL_ID string = containerApp.identity.principalId
output AZURE_STORAGE_ACCOUNT_NAME string = storageAccount.name
