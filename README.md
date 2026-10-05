# MCP Nexus

**One browser extension. Every MCP tool.**

MCP Nexus is an open-source browser extension for using Model Context Protocol tools inside ChatGPT and other web AI apps.

The goal is simple: connect one MCP gateway, keep all of your servers available, and never lose the whole tool list because one tool has an unusual schema.

> Status: MCP Nexus is in active development. The current branch is a working fork of MCP SuperAssistant while the multi-server tool layer is being rebuilt.

## Why MCP Nexus

Large MCP setups expose a real weakness in many browser clients: they work with a few tools, then fail when the catalog becomes large or one server returns a schema the client does not expect.

MCP Nexus is being built around the opposite rule:

**one bad tool must never break the rest of the catalog.**

The project is targeting:

- one gateway with many MCP servers behind it
- hundreds of tools in one catalog
- tolerant tool-schema handling
- stable tool state across reconnects
- fast search and server grouping
- clear diagnostics instead of silent "0 tools"
- safe manual execution, with automation as an explicit choice
- ChatGPT first, while keeping the upstream multi-platform architecture

## The idea

~~~text
AI website
   |
MCP Nexus
   |
Streamable HTTP gateway
   |
+-------------------------------+
| MCP server | MCP server | ... |
+-------------------------------+
   |
hundreds of tools, one catalog
~~~

The extension should not care whether the gateway has 1 server or 100. Discovery, validation and UI rendering must degrade per tool, not fail as one block.

## Current work

We are rebuilding the tool-discovery path before adding more features.

The first target is a stress profile of **29 MCP servers and 300+ tools through one gateway** without splitting the configuration.

See:

- [Project plan](docs/PROJECT_PLAN.md)
- [Current technical baseline](docs/BASELINE.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Tool ingestion design](docs/TOOL_INGESTION.md)
- [Roadmap](docs/ROADMAP.md)
- [Testing plan](docs/TESTING.md)
- [Developer setup](docs/DEVELOPMENT.md)
- [Security model](docs/SECURITY.md)
- [Upstream strategy](docs/UPSTREAM.md)

## Developer quick start

Requirements:

- Node.js 22.12 or newer
- pnpm 9.15.1
- Chrome or another Chromium browser

~~~bash
pnpm install --frozen-lockfile
pnpm type-check
pnpm build
~~~

Then open chrome://extensions, enable Developer mode, choose **Load unpacked**, and select the generated dist folder.

For the full workflow, read [DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Principles

1. **Never turn an error into an empty catalog.**
2. **Keep the last known good tools when refresh fails.**
3. **Validate tools independently.**
4. **Preserve exact wire names for execution.**
5. **Keep the UI usable with hundreds or thousands of tools.**
6. **Show the user what failed and where.**
7. **Do not commit local MCP configs or API keys.**

## Project origin

MCP Nexus is a fork of [MCP SuperAssistant](https://github.com/srbhptl39/MCP-SuperAssistant) and keeps its MIT license.

The fork exists to push the architecture toward large, research-heavy MCP stacks while preserving useful upstream platform integrations.

## License

MIT.
