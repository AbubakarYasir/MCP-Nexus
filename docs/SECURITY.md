# Security model

MCP Nexus can trigger real tools. Treat tool execution as a privileged action.

## Trust boundaries

There are four separate trust zones:

1. the AI webpage
2. the browser extension
3. the MCP gateway
4. the MCP servers and systems they can access

Do not assume a tool is safe because it appears in the catalog.

## User control

Manual execution is the safest baseline.

Automatic execution may be useful, but it should always be:

- visible
- explicitly enabled
- easy to disable
- scoped where possible

Future Nexus hardening should make destructive or high-impact actions harder to trigger silently.

## Secrets

Never commit:

- MCP API keys
- authorization headers
- database credentials
- private tokens
- secret-bearing local configs

Diagnostic exports must remove secrets.

## Local gateway

A localhost gateway may still expose powerful tools.

Users should understand that another local process or browser context that can reach the gateway may become part of the threat model.

The gateway should bind as narrowly as practical and use authentication when exposed beyond localhost.

## Tool metadata

Descriptions and schemas are untrusted input.

They may be:

- malformed
- extremely large
- misleading
- intentionally hostile

Nexus must not evaluate schema text as code.

## Tool results

Tool results are also untrusted.

Render them as data. Avoid injecting unsanitized HTML into the page.

## Reporting security problems

Until a dedicated private reporting channel exists, do not publish live credentials or exploit details in a public issue. Open a minimal issue asking for a private contact path instead.
