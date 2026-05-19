$ErrorActionPreference = "Stop"

$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$serverFile = Join-Path $PSScriptRoot "server.mjs"

if (Test-Path $bundledNode) {
  & $bundledNode $serverFile
  exit $LASTEXITCODE
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  & $nodeCommand.Source $serverFile
  exit $LASTEXITCODE
}

Write-Host "找不到可用的 Node.js。請安裝 Node.js，或確認 Codex workspace 的 bundled Node runtime 可用。"
exit 1
