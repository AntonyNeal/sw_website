# WebApp Builder MCP Server

A unified Model Context Protocol (MCP) server designed to assist in building web applications with reusable components, generic interfaces, and multi-tenant architecture.

## What is This?

This MCP server provides AI-powered tools to help you build web applications faster by:

- **Generating React components** with TypeScript
- **Creating API routes** with Express.js
- **Building SDK data sources** for your APIs
- **Setting up multi-tenant configurations**
- **Analyzing project structure**
- **Managing integrations** (SimplyBook.me, etc.)

## Quick Setup

### Prerequisites

- Node.js 20.0.0 or higher
- VS Code with GitHub Copilot
- This project workspace

### Installation

The MCP server is already configured. Just restart VS Code to activate it.

## Available Tools

### Code Generation

1. **generate_react_component** - Create React+TypeScript components
2. **generate_api_route** - Build Express REST APIs
3. **generate_sdk_datasource** - Generate SDK data sources
4. **generate_tenant_config** - Set up new tenants

### Project Management

5. **read_project_file** - Read any project file
6. **write_project_file** - Create or update files
7. **list_directory** - Browse project structure
8. **analyze_project_structure** - Get project overview

### Integration Tools

9. **get_simplybook_config** - View booking integration setup
10. **get_tenant_list** - List all configured tenants

## Usage Examples

### Generate a New Component

```
@workspace Generate a UserProfile component in src/components
```

### Create Complete Feature

```
@workspace Create a Products feature with:
- React component in src/components
- API route in api/routes
- SDK data source
```

### Set Up New Tenant

```
@workspace Create tenant "acmecorp" named "Acme Corporation"
```

## Architecture

This MCP works with your multi-tenant booking platform built on:

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **SDK**: TypeScript client library
- **Integrations**: SimplyBook.me
- **Styling**: Tailwind CSS

## Documentation

- **[Usage Guide](./QUICK-REFERENCE.md)** - Common commands
- **[Project README](../README.md)** - Platform overview
- **[Multi-Tenant Guide](../MULTI-TENANT-ARCHITECTURE.md)** - Architecture details

## Support

Use `@workspace` prefix in GitHub Copilot Chat to access these tools. The MCP server understands your project structure and generates code that matches your patterns.

---

**Start building faster with AI-powered scaffolding!** 🚀
