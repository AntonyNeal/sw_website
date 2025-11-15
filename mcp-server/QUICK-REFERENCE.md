# WebApp Builder MCP - Quick Reference

## Usage

All commands start with `@workspace` in GitHub Copilot Chat:

```
@workspace [your request about generating code or analyzing project]
```

## Quick Commands

| What you want             | What to ask                                          |
| ------------------------- | ---------------------------------------------------- |
| Generate React component  | `Generate a UserProfile component in src/components` |
| Create API route          | `Generate API routes for Products in api/routes`     |
| Build SDK data source     | `Create SDK data source for Products`                |
| Set up new tenant         | `Create tenant "acmecorp" named "Acme Corporation"`  |
| List project files        | `List all files in src/components`                   |
| Read a file               | `Read the src/components/Button.tsx file`            |
| Analyze project           | `Analyze the project structure`                      |
| View tenants              | `List all configured tenants`                        |
| Check booking integration | `Show the SimplyBook configuration`                  |

## Available Tools

### Code Generation

- `generate_react_component` - Create TypeScript React components
- `generate_api_route` - Generate Express REST API routes
- `generate_sdk_datasource` - Build SDK data source files
- `generate_tenant_config` - Set up new tenant configuration

### File Operations

- `read_project_file` - Read any file in the project
- `write_project_file` - Create or update project files
- `list_directory` - Browse directory contents

### Project Analysis

- `analyze_project_structure` - Get project overview
- `get_tenant_list` - List all tenants
- `get_simplybook_config` - View integration config

## Examples

### Generate Complete Feature

```
@workspace Create a complete Reviews feature:
1. Generate Reviews component in src/components
2. Create API route for reviews in api/routes
3. Build SDK data source for reviews
```

### Set Up New Client

```
@workspace Set up a new tenant "johndoe" named "John Doe Services"
```

### Analyze Before Building

```
@workspace Analyze the project structure and show me:
- All React components
- API routes
- SDK data sources
```

## File Locations

- MCP Server: `mcp-server/index.js`
- Configuration: `.vscode/settings.json`
- Components: `src/components/`
- API Routes: `api/routes/`
- SDK Sources: `sdk/src/datasources/`
- Tenants: `src/tenants/`

## Troubleshooting

| Problem             | Solution                        |
| ------------------- | ------------------------------- |
| Tools not showing   | Restart VS Code completely      |
| Generation fails    | Check file paths are correct    |
| Can't find files    | Use `list_directory` to explore |
| Server not starting | Verify Node.js >= 20.0.0        |

## Pro Tips

1. **Use PascalCase** for component/resource names
2. **Be specific** with paths (e.g., `src/components` not just `components`)
3. **Review generated code** - it's scaffolding you can customize
4. **Combine tools** - generate component + route + data source together
5. **Analyze first** - use `analyze_project_structure` when unsure

---

**Need more help?** See full documentation in `README.md`
