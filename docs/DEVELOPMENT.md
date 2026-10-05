# Development guide

## Requirements

- Node.js 22.12 or newer
- pnpm 9.15.1
- Git
- Chrome or Chromium

The repository currently uses a pnpm workspace and Turborepo.

## Install

~~~bash
pnpm install --frozen-lockfile
~~~

Do not casually upgrade dependencies while working on the tool-ingestion rewrite. Keep reliability changes separate from dependency changes.

## Validate

~~~bash
pnpm type-check
pnpm build
~~~

The unpacked extension is generated in:

~~~text
dist
~~~

Load it from chrome://extensions with Developer mode enabled.

## Development branch

Current main development branch:

~~~text
feat/all-mcp-research-stack
~~~

Keep the upstream remote:

~~~text
origin   -> AbubakarYasir/MCP-Nexus
upstream -> srbhptl39/MCP-SuperAssistant
~~~

## Local MCP testing

Use a local gateway endpoint and keep MCP configs outside the repository.

Example:

~~~text
http://localhost:3006/mcp
~~~

Recommended transport for the current Nexus work:

~~~text
Streamable HTTP
~~~

Do not commit:

- API keys
- auth headers
- local MCP config files containing secrets
- database passwords
- user-specific absolute paths in public docs

## Change discipline

Keep commits narrow.

Good examples:

~~~text
fix(discovery): preserve catalog when tools/list fails
feat(catalog): add stable tool identity
feat(ui): add virtualized tool list
docs: document large-catalog architecture
~~~

Avoid mixing:

- branding
- dependency upgrades
- discovery logic
- UI redesign

in one commit.

## Before every push

~~~bash
pnpm type-check
pnpm build
git diff --check
~~~

When tests are added, they become part of this gate.

## Browser test loop

1. build
2. reload the unpacked extension
3. refresh the AI webpage
4. connect to the gateway
5. inspect tool count
6. run at least one known tool
7. inspect extension service-worker logs
8. inspect page console only when needed

## Debugging rule

Never diagnose a discovery failure from the UI count alone.

Check the full chain:

~~~text
gateway startup
initialize
tools/list request
tools/list response
normalization
catalog update
UI state
~~~

## Upstream sync

See [UPSTREAM.md](UPSTREAM.md) before merging upstream changes.
