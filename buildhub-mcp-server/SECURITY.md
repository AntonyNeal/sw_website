# 🔒 Security Guidelines for BuildHub MCP Server

## Credential Protection

### ✅ What's Protected

1. **Environment Files**
   - `.env` files are automatically git-ignored
   - Only `.env.example` templates are committed
   - Multiple environment patterns are excluded (`.env.local`, `.env.production`, etc.)

2. **Setup Scripts**
   - `setup.ps1` securely handles credential input with hidden prompts
   - Credentials are stored only locally, never in code
   - Environment variables are set at user level for persistence

3. **Validation**
   - `validate.ps1` checks configuration without exposing credentials
   - API keys are masked in output logs
   - Comprehensive security checks included

### 🚫 Never Commit These Files

```
mcp-server/.env
mcp-server/.env.local
mcp-server/.env.production
mcp-server/.env.staging
*.env (except *.env.example)
```

### ✅ Safe to Commit

```
mcp-server/.env.example
mcp-server/setup.ps1
mcp-server/validate.ps1
mcp-server/package.json
mcp-server/index.js
.vscode/settings.json (uses environment variable references)
```

## Setup Process

### 1. Automated Setup (Recommended)

```powershell
cd mcp-server
npm run setup
```

This will:
- Create `.env` from template
- Securely prompt for credentials
- Set persistent environment variables
- Validate configuration

### 2. Manual Setup

```powershell
# Copy template
Copy-Item .env.example .env

# Edit .env with your credentials
notepad .env

# Set environment variables
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_KEY', 'your_key', 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_URL', 'https://api.buildhub.com/v1', 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_TENANT_ID', 'your_tenant', 'User')
```

## Environment Variables

### Required
- `BUILDHUB_API_KEY` - Your BuildHub API key
- `BUILDHUB_API_URL` - BuildHub API endpoint

### Optional
- `BUILDHUB_TENANT_ID` - Default tenant ID
- `BUILDHUB_TIMEOUT` - API request timeout (default: 30000ms)
- `BUILDHUB_DEBUG` - Enable debug logging (true/false)

## VS Code Integration Security

The `.vscode/settings.json` file uses environment variable references:

```json
{
  "github.copilot.chat.mcp.servers": {
    "buildhub": {
      "env": {
        "BUILDHUB_API_KEY": "${env:BUILDHUB_API_KEY}",
        "BUILDHUB_API_URL": "${env:BUILDHUB_API_URL}",
        "BUILDHUB_TENANT_ID": "${env:BUILDHUB_TENANT_ID}"
      }
    }
  }
}
```

This ensures:
- No hardcoded credentials in VS Code settings
- Settings file can be safely committed
- Credentials are loaded from environment at runtime

## Validation and Testing

### Check Configuration
```powershell
npm run validate
```

### Test MCP Server
```powershell
npm run dev
```

## Best Practices

### ✅ Do
- Use the provided setup scripts
- Keep credentials in environment variables only
- Regularly rotate API keys
- Use different credentials for development/production
- Validate configuration before deployment

### ❌ Don't
- Hardcode credentials in source code
- Commit `.env` files
- Share `.env` files via chat/email
- Use production credentials in development
- Store credentials in VS Code settings directly

## Troubleshooting

### "API Key not found" errors
1. Run `npm run validate` to check configuration
2. Restart VS Code after setting environment variables
3. Verify environment variables with: `echo $env:BUILDHUB_API_KEY`

### VS Code MCP not working
1. Check VS Code settings are correct
2. Restart VS Code completely
3. Check VS Code Output panel for MCP errors

### Permission errors
1. Ensure PowerShell execution policy allows scripts
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Emergency Response

### If Credentials are Compromised
1. **Immediately revoke** the API key in BuildHub dashboard
2. **Generate new** API key
3. **Update environment** variables with new key
4. **Restart** VS Code
5. **Review git history** to ensure no commits contain credentials

### Git History Cleanup (if needed)
```powershell
# Remove files from git history (use with caution)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch mcp-server/.env' --prune-empty --tag-name-filter cat -- --all

# Force push (destructive - coordinate with team)
git push --force --all
```

## Support

For security concerns or questions:
1. Check this documentation
2. Run `npm run validate` for diagnostics
3. Review MCP server logs in VS Code Output panel
4. Contact BuildHub support for API-related issues