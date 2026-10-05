# Testing plan

MCP Nexus needs tests that prove large catalogs fail safely.

## Required test matrix

| Case | Expected result |
|---|---|
| One small server | all tools appear |
| Two compatible servers | combined tools appear |
| Many compatible servers | complete catalog appears |
| One unusual input schema | other tools still appear |
| Tool with outputSchema | tool remains discoverable |
| One invalid tool object | only that tool is rejected |
| tools/list request fails | old catalog is preserved |
| Server explicitly returns zero tools | catalog becomes empty |
| Paginated tools/list | all pages are merged |
| Duplicate tool names | collision is reported |
| Reconnect | stable tool state survives |
| 300+ tools | UI remains responsive |
| Tool execution after large discovery | correct wire name is called |

## Stress profile

The primary real-world stress target is:

~~~text
29 MCP servers
300+ tools
one Streamable HTTP gateway
one browser extension connection
~~~

The exact private server configuration is not part of the repository.

## Regression baselines

Always keep at least:

- one known-good minimal server
- one high-tool-count server
- one server with schemas that previously triggered empty-catalog behavior

## Discovery assertions

A discovery test should assert more than tool count.

Check:

- status
- accepted count
- rejected count
- duplicate count
- pagination count
- last successful timestamp
- whether the previous catalog was preserved

## UI assertions

For a large catalog:

- sidebar opens quickly
- search responds immediately
- scrolling does not freeze
- opening one tool does not render every schema
- enabled count equals real enabled IDs
- a discovery error is visible without deleting old tools

## Execution assertions

For every execution test:

- selected internal ID maps to one exact wireName
- tools/call uses that wireName
- arguments are unchanged
- result belongs to the same execution record
- a tool failure does not mark the gateway disconnected unless the connection really failed

## Release gate

A release candidate cannot ship if any test can produce a false "0 tools" state from a non-empty last-known-good catalog.
