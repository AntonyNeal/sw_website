# How I Converted Your Custom SDK into an MCP Server

## 1. Files Created or Modified

### **MCP-Specific Files Created:**

```
mcp-server/
├── package.json              # MCP dependencies and scripts
├── index.js                  # Main MCP server implementation (316 lines)
├── .env.example              # Environment variable template
├── README.md                 # Complete setup guide (257 lines)
├── SETUP-COMPLETE.md         # Installation summary
├── QUICK-REFERENCE.md        # Command reference
└── package-lock.json         # Dependency lock file
```

### **Configuration Files Modified:**

```
.vscode/settings.json         # Added MCP server configuration
.gitignore                   # Added MCP .env exclusions
README.md                    # Added MCP integration section
```

---

## 2. Complete Setup Process (Step-by-Step)

### **Step 1: Create MCP Server Directory Structure**

```powershell
mkdir mcp-server
cd mcp-server
```

### **Step 2: Initialize Node.js Project**

```powershell
npm init -y
```

### **Step 3: Install MCP Dependencies**

```powershell
npm install @modelcontextprotocol/sdk axios dotenv
```

### **Step 4: Create Main MCP Server (`mcp-server/index.js`)**

- Implemented 11 tools that wrap DigitalOcean API endpoints
- Used stdio transport for communication with VS Code
- Added comprehensive error handling

### **Step 5: Configure VS Code Integration**

Added MCP server configuration to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "digitalocean": {
      "command": "node",
      "args": ["C:\\Users\\Julian\\sw-web\\mcp-server\\index.js"],
      "env": {
        "DO_API_TOKEN": "${env:DO_API_TOKEN}"
      }
    }
  }
}
```

### **Step 6: Create Environment Configuration**

Created `.env.example` with required environment variables.

---

## 3. Key Code Snippets from MCP Implementation

### **Main Server Setup:**

```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const DO_API_BASE = 'https://api.digitalocean.com/v2';
const DO_API_TOKEN = process.env.DO_API_TOKEN;

// Create MCP server
const server = new Server(
  {
    name: 'digitalocean-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
```

### **API Helper Function:**

```javascript
async function callDOApi(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${DO_API_BASE}${endpoint}`,
      headers: {
        Authorization: `Bearer ${DO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(`DigitalOcean API Error: ${error.response?.data?.message || error.message}`);
  }
}
```

### **Tool Registration:**

```javascript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_apps',
        description: 'List all DigitalOcean App Platform apps in your account',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_app',
        description: 'Get details for a specific DigitalOcean App Platform app',
        inputSchema: {
          type: 'object',
          properties: {
            app_id: {
              type: 'string',
              description: 'The ID of the app to retrieve',
            },
          },
          required: ['app_id'],
        },
      },
      // ... 9 more tools
    ],
  };
});
```

### **Tool Execution Handler:**

```javascript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'list_apps': {
        const data = await callDOApi('/apps');
        result = {
          apps: data.apps || [],
          count: data.apps?.length || 0,
        };
        break;
      }
      // ... other cases
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});
```

---

## 4. Dependencies and Configuration

### **MCP Server Package.json:**

```json
{
  "name": "digitalocean-mcp-server",
  "version": "1.0.0",
  "description": "Model Context Protocol server for DigitalOcean integration",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "axios": "^1.11.0",
    "dotenv": "^16.4.5"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### **Environment Configuration (.env.example):**

```env
# DigitalOcean MCP Server Environment Variables
# Get your API token from: https://cloud.digitalocean.com/account/api/tokens
DO_API_TOKEN=your_digitalocean_api_token_here
```

---

## 5. How to Run/Start the MCP Server

### **Setup Commands:**

```powershell
# 1. Navigate to MCP directory
cd mcp-server

# 2. Install dependencies (if not already done)
npm install

# 3. Set environment variable
[System.Environment]::SetEnvironmentVariable('DO_API_TOKEN', 'your_token_here', 'User')

# 4. Test server manually
$env:DO_API_TOKEN = "your_token_here"
node index.js

# 5. Start with VS Code (automatic via .vscode/settings.json)
# Just restart VS Code after setting environment variable
```

### **VS Code Integration:**

The MCP server automatically starts when VS Code loads, configured via `.vscode/settings.json`. No manual startup needed.

---

## 6. Structure of MCP Tools/Functions Exposed

### **11 Tools Implemented:**

| Tool Name                   | Purpose                   | Input Schema                       |
| --------------------------- | ------------------------- | ---------------------------------- |
| `list_apps`                 | List App Platform apps    | No parameters                      |
| `get_app`                   | Get app details           | `app_id: string`                   |
| `list_databases`            | List managed databases    | No parameters                      |
| `get_database`              | Get DB connection details | `database_id: string`              |
| `list_droplets`             | List VMs/Droplets         | No parameters                      |
| `get_droplet`               | Get Droplet details       | `droplet_id: string`               |
| `add_ssh_key`               | Add SSH public key        | `name: string, public_key: string` |
| `list_ssh_keys`             | List all SSH keys         | No parameters                      |
| `list_domains`              | List domains              | No parameters                      |
| `list_functions_namespaces` | List Functions namespaces | No parameters                      |
| `get_account`               | Get account info          | No parameters                      |

### **Tool Response Format:**

```javascript
// Success response
{
  content: [
    {
      type: 'text',
      text: JSON.stringify(result, null, 2),
    },
  ],
}

// Error response
{
  content: [
    {
      type: 'text',
      text: `Error: ${error.message}`,
    },
  ],
  isError: true,
}
```

---

## 7. Replicating This Setup in Your BuildHub Project

### **For BuildHub MCP Server:**

1. **Create structure:**

   ```powershell
   mkdir buildhub-mcp-server
   cd buildhub-mcp-server
   npm init -y
   ```

2. **Install dependencies:**

   ```powershell
   npm install @modelcontextprotocol/sdk axios dotenv
   ```

3. **Create `index.js`** - Replace DigitalOcean API calls with your BuildHub SDK methods:

   ```javascript
   // Instead of callDOApi, use your SDK
   import { ServiceBookingSDK } from '../sdk/src/index.js';

   const sdk = new ServiceBookingSDK({
     baseURL: process.env.BUILDHUB_API_URL,
     apiKey: process.env.BUILDHUB_API_KEY,
   });

   // Replace tools with your SDK methods
   case 'list_bookings': {
     const bookings = await sdk.bookings.list();
     result = { bookings, count: bookings.length };
     break;
   }
   ```

4. **Update VS Code settings:**
   ```json
   {
     "github.copilot.chat.mcp.servers": {
       "buildhub": {
         "command": "node",
         "args": ["path/to/buildhub-mcp-server/index.js"],
         "env": {
           "BUILDHUB_API_KEY": "${env:BUILDHUB_API_KEY}"
         }
       }
     }
   }
   ```

---

## 8. Example BuildHub SDK to MCP Tool Mapping

Based on your existing SDK structure, here are potential MCP tools:

### **Booking Management Tools:**

```javascript
{
  name: 'list_bookings',
  description: 'List all bookings for a tenant',
  inputSchema: {
    type: 'object',
    properties: {
      tenant_id: { type: 'string', description: 'Tenant ID' },
      status: { type: 'string', description: 'Filter by booking status' }
    },
    required: ['tenant_id']
  }
},
{
  name: 'create_booking',
  description: 'Create a new booking',
  inputSchema: {
    type: 'object',
    properties: {
      tenant_id: { type: 'string' },
      service_id: { type: 'string' },
      client_info: { type: 'object' },
      datetime: { type: 'string' }
    },
    required: ['tenant_id', 'service_id', 'client_info', 'datetime']
  }
}
```

### **Tenant Management Tools:**

```javascript
{
  name: 'list_tenants',
  description: 'List all tenants',
  inputSchema: { type: 'object', properties: {} }
},
{
  name: 'get_tenant_config',
  description: 'Get tenant configuration',
  inputSchema: {
    type: 'object',
    properties: {
      tenant_id: { type: 'string', description: 'Tenant ID' }
    },
    required: ['tenant_id']
  }
}
```

### **Availability Tools:**

```javascript
{
  name: 'check_availability',
  description: 'Check availability for a service',
  inputSchema: {
    type: 'object',
    properties: {
      tenant_id: { type: 'string' },
      service_id: { type: 'string' },
      date_range: { type: 'object' }
    },
    required: ['tenant_id', 'service_id', 'date_range']
  }
}
```

---

## Key Conversion Principles

1. **Wrap SDK Methods**: Each SDK method becomes an MCP tool
2. **Input Validation**: Use JSON Schema for tool parameters
3. **Error Handling**: Consistent error format for all tools
4. **Environment Config**: Store credentials in environment variables
5. **VS Code Integration**: Register server in workspace settings
6. **Documentation**: Provide clear usage examples and troubleshooting

The key is mapping your existing SDK methods to MCP tools using the same pattern I used for the DigitalOcean API!
