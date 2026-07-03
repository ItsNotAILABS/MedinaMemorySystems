# Medina App Builder — one-click start (Windows)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Medina App Builder" -ForegroundColor Cyan
Write-Host "Root: $Root"

$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
  Write-Host "Node.js not found. Install Node 22 LTS from https://nodejs.org" -ForegroundColor Red
  exit 1
}
Write-Host "Node: $nodeVersion"

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing dependencies..."
  npm install
}

if (-not (Test-Path "apps/medina-builder/node_modules")) {
  Write-Host "Installing builder app dependencies..."
  npm install --prefix apps/medina-builder
}

Write-Host ""
Write-Host "Starting builder at http://localhost:3001" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop"
Write-Host ""

npm run dev --prefix apps/medina-builder
