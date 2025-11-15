# BuildHub MCP Server

A Model Context Protocol (MCP) server that exposes BuildHub SDK functionality to VS Code Copilot Chat.

## Quick Setup

### 1. Install Dependencies

```powershell
cd mcp-server
npm install
```

### 2. Configure Environment

```powershell
# Copy environment template
Copy-Item .env.example .env

# Edit .env with your BuildHub credentials
notepad .env
```

Set these environment variables:
- `BUILDHUB_API_KEY`: Your BuildHub API key
- `BUILDHUB_API_URL`: BuildHub API base URL
- `BUILDHUB_TENANT_ID`: (Optional) Default tenant ID

### 3. Set Environment Variables in Windows

```powershell
# Set environment variables for your user account
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_KEY', 'your_actual_api_key', 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_API_URL', 'https://api.buildhub.com/v1', 'User')
[System.Environment]::SetEnvironmentVariable('BUILDHUB_TENANT_ID', 'your_tenant_id', 'User')
```

### 4. Restart VS Code

After setting environment variables, restart VS Code to enable the MCP server.

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_bookings` | List all bookings for a tenant | `tenant_id`, `status`, `limit` |
| `get_booking` | Get details for a specific booking | `booking_id` |
| `create_booking` | Create a new booking | `service_id`, `client_info`, `datetime`, `notes` |
| `list_services` | List available services | `tenant_id`, `category` |
| `check_availability` | Check service availability | `service_id`, `date`, `duration` |
| `list_tenants` | List all accessible tenants | None |
| `get_tenant_config` | Get tenant configuration | `tenant_id` |
| `update_booking_status` | Update booking status | `booking_id`, `status`, `notes` |

## Usage in VS Code

Once configured, you can use these tools in Copilot Chat:

```
@copilot List all bookings for today

@copilot Create a booking for service "haircut" for client John Doe at 2pm tomorrow

@copilot Check availability for service "massage" on December 1st
```

## Testing the Server

Test the server manually:

```powershell
cd mcp-server
$env:BUILDHUB_API_KEY = "your_key_here"
$env:BUILDHUB_API_URL = "https://api.buildhub.com/v1"
node index.js
```

## Troubleshooting

### Common Issues

1. **Environment variables not loaded**: Restart VS Code after setting environment variables
2. **API connection errors**: Verify your API key and URL are correct
3. **Tool not found**: Check that the MCP server is properly configured in `.vscode/settings.json`

### Debug Mode

Run the server in debug mode:

```powershell
cd mcp-server
npm run dev
```

### Logs

Check VS Code Output panel > "GitHub Copilot Chat" for MCP server logs.

## Customization

To customize the MCP server for your specific BuildHub SDK:

1. **Update API endpoints** in `index.js` to match your SDK structure
2. **Modify tool schemas** to match your API parameters
3. **Add new tools** by extending the `tools` array and `switch` statement
4. **Update error handling** for your specific API error formats

## Files Structure

```
mcp-server/
├── package.json          # Dependencies and scripts
├── index.js              # Main MCP server implementation
├── .env.example          # Environment variable template
├── .env                  # Your actual environment variables (gitignored)
└── README.md             # This file
```