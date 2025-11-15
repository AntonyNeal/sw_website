# BuildHub MCP Server Configuration Validator
# ===========================================
# This script validates your MCP server setup and credentials

Write-Host "🔍 BuildHub MCP Server Configuration Check" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

$errors = @()
$warnings = @()

# Check if .env file exists
$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
    $errors += "❌ .env file not found. Run setup.ps1 first."
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    # Load .env variables
    $envContent = Get-Content $envPath
    foreach ($line in $envContent) {
        if ($line -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value -and -not $value.EndsWith('_here')) {
                [Environment]::SetEnvironmentVariable($name, $value, 'Process')
            }
        }
    }
}

# Check environment variables
Write-Host ""
Write-Host "🔑 Checking Environment Variables..." -ForegroundColor Yellow

$requiredVars = @('BUILDHUB_API_KEY', 'BUILDHUB_API_URL')
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, 'Process') -or [Environment]::GetEnvironmentVariable($var, 'User')
    if ([string]::IsNullOrWhiteSpace($value) -or $value.EndsWith('_here')) {
        $errors += "❌ $var is not set or has placeholder value"
    } else {
        Write-Host "   ✅ $var is configured" -ForegroundColor Green
        if ($var -eq 'BUILDHUB_API_KEY') {
            $maskedKey = '*' * ([Math]::Max($value.Length - 8, 0)) + $value.Substring([Math]::Max($value.Length - 8, 0))
            Write-Host "      Value: $maskedKey" -ForegroundColor Gray
        } else {
            Write-Host "      Value: $value" -ForegroundColor Gray
        }
    }
}

$optionalVar = 'BUILDHUB_TENANT_ID'
$tenantId = [Environment]::GetEnvironmentVariable($optionalVar, 'Process') -or [Environment]::GetEnvironmentVariable($optionalVar, 'User')
if ([string]::IsNullOrWhiteSpace($tenantId) -or $tenantId.EndsWith('_here')) {
    $warnings += "⚠️  $optionalVar is not set (optional, but recommended)"
} else {
    Write-Host "   ✅ $optionalVar is configured" -ForegroundColor Green
    Write-Host "      Value: $tenantId" -ForegroundColor Gray
}

# Check VS Code configuration
Write-Host ""
Write-Host "🎯 Checking VS Code MCP Configuration..." -ForegroundColor Yellow

$vscodeSettingsPath = Join-Path (Split-Path $PSScriptRoot) ".vscode\settings.json"
if (-not (Test-Path $vscodeSettingsPath)) {
    $errors += "❌ VS Code settings.json not found"
} else {
    Write-Host "   ✅ VS Code settings.json found" -ForegroundColor Green
    
    $settings = Get-Content $vscodeSettingsPath -Raw | ConvertFrom-Json
    if ($settings.'github.copilot.chat.mcp.enabled') {
        Write-Host "   ✅ MCP integration enabled" -ForegroundColor Green
    } else {
        $errors += "❌ MCP integration not enabled in VS Code settings"
    }
    
    if ($settings.'github.copilot.chat.mcp.servers'.buildhub) {
        Write-Host "   ✅ BuildHub MCP server configured" -ForegroundColor Green
    } else {
        $errors += "❌ BuildHub MCP server not configured in VS Code settings"
    }
}

# Check Node.js and dependencies
Write-Host ""
Write-Host "📦 Checking Dependencies..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
        
        # Check if version is >= 20
        $version = $nodeVersion -replace '^v', ''
        $majorVersion = [int]($version -split '\.')[0]
        if ($majorVersion -lt 20) {
            $warnings += "⚠️  Node.js version should be >= 20.0.0 (current: $nodeVersion)"
        }
    } else {
        $errors += "❌ Node.js not found"
    }
} catch {
    $errors += "❌ Node.js not found or not in PATH"
}

$packageJsonPath = Join-Path $PSScriptRoot "package.json"
$nodeModulesPath = Join-Path $PSScriptRoot "node_modules"

if (-not (Test-Path $packageJsonPath)) {
    $errors += "❌ package.json not found"
} else {
    Write-Host "   ✅ package.json found" -ForegroundColor Green
}

if (-not (Test-Path $nodeModulesPath)) {
    $errors += "❌ node_modules not found. Run 'npm install'"
} else {
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
}

# Test MCP server syntax
Write-Host ""
Write-Host "🧪 Testing MCP Server Syntax..." -ForegroundColor Yellow

$mcpServerPath = Join-Path $PSScriptRoot "index.js"
if (-not (Test-Path $mcpServerPath)) {
    $errors += "❌ MCP server (index.js) not found"
} else {
    try {
        # Basic syntax check
        $syntaxCheck = node -c $mcpServerPath 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ MCP server syntax is valid" -ForegroundColor Green
        } else {
            $errors += "❌ MCP server syntax error: $syntaxCheck"
        }
    } catch {
        $warnings += "⚠️  Could not validate MCP server syntax"
    }
}

# Summary
Write-Host ""
Write-Host "📋 Configuration Summary" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "🎉 Configuration looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Ready to use BuildHub MCP server!" -ForegroundColor Green
    Write-Host "   • Restart VS Code to apply changes" -ForegroundColor White
    Write-Host "   • Test with: @copilot list_tenants" -ForegroundColor White
} else {
    Write-Host "⚠️  Issues found that need attention:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   $warning" -ForegroundColor Yellow
    }
}

Write-Host ""