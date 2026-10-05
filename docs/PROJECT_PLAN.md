# MCP Nexus project plan

## Mission

Build a browser MCP client that stays reliable when one gateway exposes many servers and hundreds of tools.

The first real target is a 29-server, 300+ tool research stack through one Streamable HTTP endpoint.

## Non-negotiable requirements

MCP Nexus must:

1. connect to one gateway that can aggregate many MCP servers
2. keep the complete tool catalog available without splitting configs
3. treat malformed or unusual tools as local failures, not catalog-wide failures
4. distinguish "the server returned zero tools" from "tool discovery failed"
5. keep last-known-good tools during transient refresh failures
6. preserve exact tool names used on the wire
7. tolerate valid and future MCP fields without throwing them away
8. support paginated tools/list responses
9. detect duplicate or conflicting tool identities
10. stay responsive with hundreds or thousands of tools
11. show useful diagnostics for connection, discovery, parsing and execution
12. avoid storing or publishing users' MCP secrets

## Scope for the first stable Nexus release

### Core reliability

- resilient Streamable HTTP discovery
- per-tool normalization
- safe schema serialization
- last-known-good catalog
- pagination
- duplicate detection
- deterministic tool identity
- clear discovery errors

### Large catalog UX

- search
- server/source grouping when source metadata is available
- enabled/disabled state that survives refreshes
- lazy or virtualized rendering
- tool counts and health summary

### Diagnostics

- connection state
- last successful discovery time
- tool count
- rejected tool count
- discovery errors
- duplicate names
- transport information
- exportable diagnostic report with secrets removed

### Execution

- exact wire-name execution
- tool arguments preserved as structured JSON
- manual execution as the safe baseline
- automation remains explicit and visible

## Not required for the first stable release

These are useful, but they do not block the core goal:

- replacing the existing proxy
- direct connection to 29 separate local processes from the extension
- cloud sync
- marketplace features
- new AI websites before the core catalog is stable
- major visual redesign before large-catalog performance works

## Success definition

A release candidate is acceptable when:

- a one-server setup still works
- a mixed multi-server setup works
- a full stress stack can expose 300+ tools without showing a false empty catalog
- one incompatible tool can be rejected without removing valid tools
- a failed refresh keeps the last-known-good catalog
- tool execution still reaches the correct wire tool
- the sidebar remains usable at large scale

## Work order

The implementation order is intentional:

1. freeze and document the baseline
2. repair tool ingestion
3. add catalog identity and persistence
4. add large-catalog UI
5. add diagnostics
6. harden execution and security
7. performance test
8. package a release

Do not start cosmetic rewrites before phases 2 and 3 are stable.
