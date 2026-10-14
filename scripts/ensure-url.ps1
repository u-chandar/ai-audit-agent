$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$url = 'http://127.0.0.1:4185/'
$ragUrl = 'http://127.0.0.1:8765/api/rag/health'

function Open-AppUrl {
    try {
        Start-Process $url | Out-Null
        Write-Host "Opened $url"
    } catch {
        Write-Host "Could not open browser automatically. Visit $url"
    }
}

function Test-ServerUp {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400)
    } catch {
        return $false
    }
}

function Test-RagUp {
    try {
        $response = Invoke-WebRequest -Uri $ragUrl -UseBasicParsing -TimeoutSec 3
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400)
    } catch {
        return $false
    }
}

function Start-RagApi {
    if (Test-RagUp) {
        Write-Host "RAG API already running"
        return
    }

    Write-Host "Starting policy RAG API in a new terminal..."
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        "Set-Location '$projectRoot'; npm run rag:api"
    )
}

if (Test-ServerUp) {
    Start-RagApi
    Write-Host "Server already running at $url"
    Open-AppUrl
    exit 0
}

Start-RagApi
Write-Host "Server is down. Starting hot-reload server in a new terminal..."
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    "Set-Location '$projectRoot'; npm run dev"
)
Write-Host "Server start initiated. Waiting for URL..."

$maxAttempts = 30
for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    if (Test-ServerUp) {
        Write-Host "Server is up at $url"
        Open-AppUrl
        exit 0
    }
    Start-Sleep -Seconds 1
}

Write-Host "Server did not respond in time. Check terminal output and visit $url manually."
exit 0
