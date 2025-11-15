# Deploy API to DigitalOcean App Platform
Write-Host "Deploying API to DigitalOcean..." -ForegroundColor Cyan

# Check if doctl is installed
if (!(Get-Command doctl -ErrorAction SilentlyContinue)) {
    Write-Host "doctl CLI not found. Install from: https://docs.digitalocean.com/reference/doctl/how-to/install/" -ForegroundColor Red
    exit 1
}

# Get the app ID
Write-Host "Fetching app information..." -ForegroundColor Yellow
$apps = doctl apps list --format ID,Spec.Name --no-header
$octopusApp = $apps | Where-Object { $_ -match "octopus-app" }

if (!$octopusApp) {
    Write-Host "Could not find 'octopus-app'" -ForegroundColor Red
    doctl apps list
    exit 1
}

$appId = ($octopusApp -split '\s+')[0]
Write-Host "Found app: $appId" -ForegroundColor Green

# Update the app spec
Write-Host "Updating app configuration..." -ForegroundColor Yellow
doctl apps update $appId --spec app-spec.yaml

if ($LASTEXITCODE -eq 0) {
    Write-Host "App updated successfully!" -ForegroundColor Green
    Write-Host "Your API will be available at: https://clairehamilton.net/api" -ForegroundColor Cyan
} else {
    Write-Host "Deployment failed" -ForegroundColor Red
    exit 1
}
