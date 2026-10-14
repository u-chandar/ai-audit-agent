$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$port = 4185
$url = 'http://127.0.0.1:4185/'
$ragPort = 8765
$ragUrl = 'http://127.0.0.1:8765/api/rag/health'

function Test-ServerUp {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400)
    } catch {
        return $false
    }
}

function Open-AppUrl {
    try {
        Start-Process $url | Out-Null
        Write-Host "Opened $url"
    } catch {
        Write-Host "Could not open browser automatically. Visit $url"
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

function Stop-PortListener([int]$targetPort) {
    try {
        $listeners = Get-NetTCPConnection -LocalPort $targetPort -State Listen -ErrorAction SilentlyContinue
    } catch {
        $listeners = $null
    }

    if ($listeners) {
        $pids = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pidValue in $pids) {
            try {
                Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue
                Write-Host "Stopped process on port ${targetPort}: PID $pidValue"
            } catch {
                Write-Host "Could not stop PID $pidValue"
            }
        }
    } else {
        Write-Host "No existing listener found on port $targetPort"
    }
}

Stop-PortListener -targetPort $port
Stop-PortListener -targetPort $ragPort

Write-Host "Starting hot-reload server on $url"
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    "Set-Location '$projectRoot'; npm run dev"
)

Write-Host "Starting policy RAG API on port $ragPort"
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    "Set-Location '$projectRoot'; npm run rag:api"
)

$maxAttempts = 30
for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    if (Test-ServerUp -and (Test-RagUp)) {
        Write-Host "Server is up at $url"
        Open-AppUrl
        exit 0
    }
    Start-Sleep -Seconds 1
}

Write-Host "Server did not respond in time. Check the new terminal for errors."
exit 1
