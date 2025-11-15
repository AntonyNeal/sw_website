param(
    [Parameter(Mandatory=$false)]
    [string]$ApiKey,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://api.buildhub.com/v1",
    
    [Parameter(Mandatory=$false)]
    [string]$TenantId
)

Write-Host "BuildHub MCP Server Environment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if .env exists
$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item (Join-Path $PSScriptRoot ".env.example") $envPath
}

# Function to securely prompt for credentials
function Get-SecureInput {
    param([string]$Prompt, [bool]$IsSecret = $false)
    
    if ($IsSecret) {
        $secureInput = Read-Host $Prompt -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureInput)
        $plainText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
        return $plainText
    } else {
        return Read-Host $Prompt
    }
}

# Collect credentials if not provided
if (-not $ApiKey) {
    Write-Host ""
    Write-Host "Please provide your BuildHub API Key" -ForegroundColor Green
    Write-Host "You can find this in BuildHub Dashboard -> API Settings" -ForegroundColor Gray
    $ApiKey = Get-SecureInput "API Key (input hidden)" -IsSecret $true
}

if (-not $TenantId) {
    Write-Host ""
    Write-Host "Please provide your default Tenant ID (optional)" -ForegroundColor Green
    Write-Host "You can find this in BuildHub Dashboard -> Organization Settings" -ForegroundColor Gray
    $TenantId = Read-Host "Tenant ID (press Enter to skip)"
}

# Validate inputs
if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Error "API Key is required!"
    exit 1
}

Write-Host ""
Write-Host "Setting up environment variables..." -ForegroundColor Yellow

# Set environment variables for current session
$env:BUILDHUB_API_KEY = $ApiKey
$env:BUILDHUB_API_URL = $ApiUrl
if ($TenantId) { $env:BUILDHUB_TENANT_ID = $TenantId }

# Set persistent environment variables for user
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_KEY', $ApiKey, 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_URL', $ApiUrl, 'User')
if ($TenantId) {
    [System.Environment]::SetEnvironmentVariable('BUILDHUB_TENANT_ID', $TenantId, 'User')
}

# Update .env file
$envContent = Get-Content $envPath
$envContent = $envContent -replace '^BUILDHUB_API_KEY=.*', "BUILDHUB_API_KEY=$ApiKey"
$envContent = $envContent -replace '^BUILDHUB_API_URL=.*', "BUILDHUB_API_URL=$ApiUrl"
if ($TenantId) {
    $envContent = $envContent -replace '^BUILDHUB_TENANT_ID=.*', "BUILDHUB_TENANT_ID=$TenantId"
}
$envContent | Set-Content $envPath

Write-Host ""
Write-Host "Environment variables configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor White
if ($TenantId) {
    Write-Host "Tenant ID: $TenantId" -ForegroundColor White
}
$maskedKey = "*" * ($ApiKey.Length - 8) + $ApiKey.Substring($ApiKey.Length - 8)
Write-Host "API Key: $maskedKey" -ForegroundColor White

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Restart VS Code to apply MCP server changes" -ForegroundColor White
Write-Host "2. Test the MCP server with: npm run dev" -ForegroundColor White
Write-Host "3. Use BuildHub tools in VS Code Copilot Chat" -ForegroundColor White

Write-Host ""
Write-Host "Security Note:" -ForegroundColor Yellow
Write-Host "Your credentials are stored securely and excluded from git" -ForegroundColor Gray