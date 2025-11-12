# SimplyBook.me API Integration Test Script
# Quick setup and testing for the API integration

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  SIMPLYBOOK.ME API INTEGRATION SETUP & TEST" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Function to print status messages
function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "info"
    )
    
    $color = switch ($Status) {
        "success" { "Green" }
        "error" { "Red" }
        "warning" { "Yellow" }
        default { "White" }
    }
    
    $icon = switch ($Status) {
        "success" { "✅" }
        "error" { "❌" }
        "warning" { "⚠️" }
        default { "ℹ️" }
    }
    
    Write-Host "$icon $Message" -ForegroundColor $color
}

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "api\services\simplybook.service.js")) {
    Write-Status "Error: Not in the project root directory!" "error"
    Write-Status "Please run this script from: c:\Repos\sw_website" "warning"
    exit 1
}

Write-Status "Current directory: $currentDir" "success"
Write-Host ""

# Step 1: Check if .env files exist
Write-Host "1️⃣ Checking Environment Configuration..." -ForegroundColor Cyan
Write-Host ""

$envFiles = @(
    @{Path="api\.env"; Example="api\.env.example"; Name="Backend"},
    @{Path=".env.local"; Example=".env.example"; Name="Frontend"}
)

$envMissing = $false

foreach ($env in $envFiles) {
    if (Test-Path $env.Path) {
        Write-Status "$($env.Name) .env file exists" "success"
    } else {
        Write-Status "$($env.Name) .env file missing!" "warning"
        
        if (Test-Path $env.Example) {
            Write-Host "   Would you like to create it from $($env.Example)? (Y/N): " -NoNewline -ForegroundColor Yellow
            $response = Read-Host
            
            if ($response -eq "Y" -or $response -eq "y") {
                Copy-Item $env.Example $env.Path
                Write-Status "Created $($env.Path)" "success"
                Write-Status "⚠️  Please edit $($env.Path) and add your API credentials!" "warning"
            } else {
                Write-Status "Skipped creating $($env.Path)" "warning"
                $envMissing = $true
            }
        } else {
            Write-Status "Example file $($env.Example) not found!" "error"
            $envMissing = $true
        }
    }
}

Write-Host ""

if ($envMissing) {
    Write-Status "Some .env files are missing. Please create them before testing." "warning"
    Write-Host ""
    Write-Host "To create them manually:" -ForegroundColor Yellow
    Write-Host "  Copy-Item api\.env.example api\.env" -ForegroundColor Gray
    Write-Host "  Copy-Item .env.example .env.local" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then edit the files to add your API credentials." -ForegroundColor Yellow
    Write-Host ""
}

# Step 2: Check Node.js installation
Write-Host "2️⃣ Checking Node.js Installation..." -ForegroundColor Cyan
Write-Host ""

try {
    $nodeVersion = node --version
    Write-Status "Node.js version: $nodeVersion" "success"
} catch {
    Write-Status "Node.js is not installed!" "error"
    Write-Status "Please install Node.js from: https://nodejs.org/" "warning"
    exit 1
}

Write-Host ""

# Step 3: Check npm dependencies
Write-Host "3️⃣ Checking Dependencies..." -ForegroundColor Cyan
Write-Host ""

Set-Location api

if (-not (Test-Path "node_modules")) {
    Write-Status "Dependencies not installed. Installing..." "warning"
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Dependencies installed successfully" "success"
    } else {
        Write-Status "Failed to install dependencies" "error"
        Set-Location ..
        exit 1
    }
} else {
    Write-Status "Dependencies already installed" "success"
}

Write-Host ""

# Step 4: Test API connection
Write-Host "4️⃣ Testing SimplyBook.me API Connection..." -ForegroundColor Cyan
Write-Host ""

if (Test-Path ".env") {
    Write-Status "Running API connection test..." "info"
    Write-Host ""
    node test-simplybook.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Status "API connection test passed!" "success"
    } else {
        Write-Host ""
        Write-Status "API connection test failed" "error"
        Write-Status "Check your API credentials in api\.env" "warning"
    }
} else {
    Write-Status "Skipping API test - .env file not found" "warning"
    Write-Status "Create api\.env with your credentials to test the API" "warning"
}

Write-Host ""

# Step 5: Offer to start the server
Write-Host "5️⃣ Start API Server?" -ForegroundColor Cyan
Write-Host ""
Write-Host "Would you like to start the API server now? (Y/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Status "Starting API server..." "info"
    Write-Host ""
    Write-Host "Server will start on: http://localhost:3001" -ForegroundColor Green
    Write-Host "Test webhook at: http://localhost:3001/api/v1/webhooks/test" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    npm start
} else {
    Write-Status "Server not started" "info"
    Write-Host ""
    Write-Host "To start the server manually:" -ForegroundColor Yellow
    Write-Host "  cd api" -ForegroundColor Gray
    Write-Host "  npm start" -ForegroundColor Gray
}

Set-Location ..

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   • Complete Guide: SIMPLYBOOK-API-SETUP.md" -ForegroundColor Gray
Write-Host "   • Quick Reference: SIMPLYBOOK-QUICK-REF.md" -ForegroundColor Gray
Write-Host "   • Summary: SIMPLYBOOK-INTEGRATION-COMPLETE.md" -ForegroundColor Gray
Write-Host ""

Write-Host "🔗 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Add webhook URL to SimplyBook.me dashboard" -ForegroundColor Gray
Write-Host "      https://api.clairehamilton.net/api/v1/webhooks/simplybook" -ForegroundColor Cyan
Write-Host "   2. Test webhook by creating a booking" -ForegroundColor Gray
Write-Host "   3. Implement frontend booking form" -ForegroundColor Gray
Write-Host ""
