# API Signs of Life Test Script
# Starts the server and runs basic tests

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  🧪 API SIGNS OF LIFE TEST" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Kill any existing node processes
Write-Host "🔄 Stopping any existing Node processes..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start the API server in a background job
Write-Host "🚀 Starting API server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location "C:\Repos\sw_website\api"
    node server.js
}

Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test endpoints
Write-Host "`n1️⃣ Testing Root Endpoint (/)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/" -Method Get -ErrorAction Stop
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "   Response:" -ForegroundColor Gray
    $response | ConvertTo-Json | Write-Host -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: $_" -ForegroundColor Red
}

Write-Host "`n2️⃣ Testing Health Endpoint (/health)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -ErrorAction Stop
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "   Response:" -ForegroundColor Gray
    $response | ConvertTo-Json | Write-Host -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: $_" -ForegroundColor Red
}

Write-Host "`n3️⃣ Testing Webhook Test Endpoint (/api/v1/webhooks/test)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/webhooks/test" -Method Get -ErrorAction Stop
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "   Response:" -ForegroundColor Gray
    $response | ConvertTo-Json | Write-Host -ForegroundColor Gray
} catch {
    Write-Host "❌ FAILED: $_" -ForegroundColor Red
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  🎉 TEST COMPLETE!" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "Server is still running in the background." -ForegroundColor Yellow
Write-Host "To stop it, run: Stop-Job -Id $($serverJob.Id); Remove-Job -Id $($serverJob.Id)" -ForegroundColor Yellow
Write-Host "`nOr to stop all Node processes: Stop-Process -Name node -Force`n" -ForegroundColor Yellow
