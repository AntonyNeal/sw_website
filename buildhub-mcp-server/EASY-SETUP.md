# 🚀 Quick Setup: Use BuildHub MCP in Any Project

## Option 1: NPM Package (Recommended)

### Step 1: Publish to NPM
```powershell
cd c:\Repos\buildhub\mcp-server
npm login
npm publish --access public
```

### Step 2: Use in Another Project
```powershell
# In your other project
npm install buildhub-mcp-server

# Add to your package.json scripts
"scripts": {
  "mcp": "buildhub-mcp-server"
}
```

### Step 3: Configure VS Code in Other Project
Create `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "buildhub": {
      "command": "npm",
      "args": ["run", "mcp"],
      "env": {
        "BUILDHUB_API_KEY": "your-api-key",
        "BUILDHUB_API_URL": "https://api.buildhub.com/v1",
        "BUILDHUB_TENANT_ID": "your-tenant-id"
      }
    }
  }
}
```

---

## Option 2: Direct Node Path (Quick & Easy)

### Step 1: Use Absolute Path
In your other project's `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "buildhub": {
      "command": "node",
      "args": ["c:\\Repos\\buildhub\\mcp-server\\index.js"],
      "env": {
        "BUILDHUB_API_KEY": "your-api-key",
        "BUILDHUB_API_URL": "https://api.buildhub.com/v1",
        "BUILDHUB_TENANT_ID": "your-tenant-id"
      }
    }
  }
}
```

### Step 2: Restart VS Code
Close and reopen VS Code in your other project.

---

## Option 3: Symlink Package (For Local Development)

### Step 1: Create Global Link
```powershell
cd c:\Repos\buildhub\mcp-server
npm link
```

### Step 2: Link in Other Project
```powershell
cd c:\path\to\other-project
npm link buildhub-mcp-server
```

### Step 3: Configure VS Code
Same as Option 1, Step 3.

---

## Option 4: Copy Files (Simplest)

### Step 1: Copy MCP Server
```powershell
# Copy the entire mcp-server folder to your other project
xcopy /E /I c:\Repos\buildhub\mcp-server c:\path\to\other-project\buildhub-mcp
```

### Step 2: Install Dependencies
```powershell
cd c:\path\to\other-project\buildhub-mcp
npm install
```

### Step 3: Configure VS Code
In `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "buildhub": {
      "command": "node",
      "args": ["./buildhub-mcp/index.js"],
      "env": {
        "BUILDHUB_API_KEY": "your-api-key",
        "BUILDHUB_API_URL": "https://api.buildhub.com/v1",
        "BUILDHUB_TENANT_ID": "your-tenant-id"
      }
    }
  }
}
```

---

## 🎯 Easiest Recipe (Recommended)

**Use Option 2 - Direct Node Path** if you want the simplest setup with no extra steps:

1. Open your other project in VS Code
2. Create `.vscode/settings.json`
3. Paste this:
```json
{
  "mcp.servers": {
    "buildhub": {
      "command": "node",
      "args": ["c:\\Repos\\buildhub\\mcp-server\\index.js"],
      "env": {
        "BUILDHUB_API_KEY": "your-api-key-here",
        "BUILDHUB_API_URL": "https://api.buildhub.com/v1"
      }
    }
  }
}
```
4. Replace `your-api-key-here` with your actual API key
5. Reload VS Code (Ctrl+Shift+P → "Developer: Reload Window")
6. Open Copilot Chat - BuildHub tools are now available!

---

## 🔧 Environment Variables

Instead of hardcoding in settings.json, you can use system environment variables:

```powershell
# Set once, use everywhere
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_KEY', 'your-key', 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_URL', 'https://api.buildhub.com/v1', 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_TENANT_ID', 'your-tenant', 'User')
```

Then in `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "buildhub": {
      "command": "node",
      "args": ["c:\\Repos\\buildhub\\mcp-server\\index.js"]
    }
  }
}
```
(No env needed - uses system variables)

---

## ✅ Verify It's Working

In VS Code Copilot Chat, try:
```
@buildhub list bookings
```

You should see the MCP server respond with booking data!

---

## 📝 Available Tools

- `list_bookings` - List all bookings for a tenant
- `get_booking` - Get specific booking details
- `create_booking` - Create a new booking
- `list_services` - List available services
- `check_availability` - Check service availability
