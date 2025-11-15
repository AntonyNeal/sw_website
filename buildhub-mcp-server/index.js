#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

// BuildHub API Configuration
const BUILDHUB_API_BASE = process.env.BUILDHUB_API_URL || "https://api.buildhub.com/v1";
const BUILDHUB_API_KEY = process.env.BUILDHUB_API_KEY || "dev-mode-no-auth";
const BUILDHUB_TENANT_ID = process.env.BUILDHUB_TENANT_ID || "default-tenant";

// Development mode warning
if (BUILDHUB_API_KEY === "dev-mode-no-auth") {
  console.warn("⚠️  Running in DEV MODE - No API key configured. API calls will use mock data.");
}

// API Helper function for BuildHub
async function callBuildHubApi(endpoint, method = "GET", data = null) {
  try {
    const config = {
      method,
      url: `${BUILDHUB_API_BASE}${endpoint}`,
      headers: {
        Authorization: `Bearer ${BUILDHUB_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(
      `BuildHub API Error: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

// Create MCP server
const server = new Server(
  {
    name: "buildhub-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_bookings",
        description: "List all bookings for a tenant",
        inputSchema: {
          type: "object",
          properties: {
            tenant_id: {
              type: "string",
              description: "The tenant ID (optional, defaults to configured tenant)",
            },
            status: {
              type: "string",
              description: "Filter by booking status (e.g., 'pending', 'confirmed', 'completed')",
            },
            limit: {
              type: "number",
              description: "Maximum number of bookings to return",
            },
          },
          additionalProperties: false,
        },
      },
      {
        name: "get_booking",
        description: "Get details for a specific booking",
        inputSchema: {
          type: "object",
          properties: {
            booking_id: {
              type: "string",
              description: "The ID of the booking to retrieve",
            },
          },
          required: ["booking_id"],
          additionalProperties: false,
        },
      },
      {
        name: "create_booking",
        description: "Create a new booking",
        inputSchema: {
          type: "object",
          properties: {
            tenant_id: {
              type: "string",
              description: "The tenant ID (optional, defaults to configured tenant)",
            },
            service_id: {
              type: "string",
              description: "The service to book",
            },
            client_info: {
              type: "object",
              description: "Client information",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
              },
              required: ["name", "email"],
            },
            datetime: {
              type: "string",
              description: "Booking datetime in ISO format",
            },
            notes: {
              type: "string",
              description: "Additional booking notes",
            },
          },
          required: ["service_id", "client_info", "datetime"],
          additionalProperties: false,
        },
      },
      {
        name: "list_services",
        description: "List available services for a tenant",
        inputSchema: {
          type: "object",
          properties: {
            tenant_id: {
              type: "string",
              description: "The tenant ID (optional, defaults to configured tenant)",
            },
            category: {
              type: "string",
              description: "Filter by service category",
            },
          },
          additionalProperties: false,
        },
      },
      {
        name: "check_availability",
        description: "Check availability for a service on a specific date/time",
        inputSchema: {
          type: "object",
          properties: {
            tenant_id: {
              type: "string",
              description: "The tenant ID (optional, defaults to configured tenant)",
            },
            service_id: {
              type: "string",
              description: "The service ID to check availability for",
            },
            date: {
              type: "string",
              description: "Date to check availability (YYYY-MM-DD format)",
            },
            duration: {
              type: "number",
              description: "Duration in minutes",
            },
          },
          required: ["service_id", "date"],
          additionalProperties: false,
        },
      },
      {
        name: "list_tenants",
        description: "List all accessible tenants",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "get_tenant_config",
        description: "Get configuration for a specific tenant",
        inputSchema: {
          type: "object",
          properties: {
            tenant_id: {
              type: "string",
              description: "The tenant ID to get configuration for",
            },
          },
          required: ["tenant_id"],
          additionalProperties: false,
        },
      },
      {
        name: "update_booking_status",
        description: "Update the status of a booking",
        inputSchema: {
          type: "object",
          properties: {
            booking_id: {
              type: "string",
              description: "The booking ID to update",
            },
            status: {
              type: "string",
              description: "New status for the booking",
              enum: ["pending", "confirmed", "completed", "cancelled"],
            },
            notes: {
              type: "string",
              description: "Optional notes for the status change",
            },
          },
          required: ["booking_id", "status"],
          additionalProperties: false,
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;
    const tenantId = args.tenant_id || BUILDHUB_TENANT_ID;

    switch (name) {
      case "list_bookings": {
        let endpoint = `/tenants/${tenantId}/bookings`;
        const queryParams = new URLSearchParams();
        
        if (args.status) queryParams.append('status', args.status);
        if (args.limit) queryParams.append('limit', args.limit.toString());
        
        if (queryParams.toString()) {
          endpoint += `?${queryParams.toString()}`;
        }
        
        const data = await callBuildHubApi(endpoint);
        result = {
          bookings: data.bookings || data,
          count: data.bookings?.length || (Array.isArray(data) ? data.length : 0),
          tenant_id: tenantId,
        };
        break;
      }

      case "get_booking": {
        const data = await callBuildHubApi(`/bookings/${args.booking_id}`);
        result = {
          booking: data.booking || data,
          booking_id: args.booking_id,
        };
        break;
      }

      case "create_booking": {
        const bookingData = {
          tenant_id: tenantId,
          service_id: args.service_id,
          client_info: args.client_info,
          datetime: args.datetime,
          notes: args.notes || "",
        };

        const data = await callBuildHubApi(
          `/tenants/${tenantId}/bookings`,
          "POST",
          bookingData
        );
        result = {
          booking: data.booking || data,
          message: "Booking created successfully",
        };
        break;
      }

      case "list_services": {
        let endpoint = `/tenants/${tenantId}/services`;
        if (args.category) {
          endpoint += `?category=${encodeURIComponent(args.category)}`;
        }

        const data = await callBuildHubApi(endpoint);
        result = {
          services: data.services || data,
          count: data.services?.length || (Array.isArray(data) ? data.length : 0),
          tenant_id: tenantId,
        };
        break;
      }

      case "check_availability": {
        let endpoint = `/tenants/${tenantId}/services/${args.service_id}/availability`;
        const queryParams = new URLSearchParams();
        queryParams.append('date', args.date);
        if (args.duration) queryParams.append('duration', args.duration.toString());
        
        endpoint += `?${queryParams.toString()}`;

        const data = await callBuildHubApi(endpoint);
        result = {
          availability: data.availability || data,
          service_id: args.service_id,
          date: args.date,
          tenant_id: tenantId,
        };
        break;
      }

      case "list_tenants": {
        const data = await callBuildHubApi("/tenants");
        result = {
          tenants: data.tenants || data,
          count: data.tenants?.length || (Array.isArray(data) ? data.length : 0),
        };
        break;
      }

      case "get_tenant_config": {
        const data = await callBuildHubApi(`/tenants/${args.tenant_id}/config`);
        result = {
          config: data.config || data,
          tenant_id: args.tenant_id,
        };
        break;
      }

      case "update_booking_status": {
        const updateData = {
          status: args.status,
          notes: args.notes || "",
        };

        const data = await callBuildHubApi(
          `/bookings/${args.booking_id}/status`,
          "PATCH",
          updateData
        );
        result = {
          booking: data.booking || data,
          message: `Booking status updated to ${args.status}`,
          booking_id: args.booking_id,
        };
        break;
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("BuildHub MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});