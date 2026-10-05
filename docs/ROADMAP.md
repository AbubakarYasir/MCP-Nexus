# MCP Nexus roadmap

## Phase 0 — Baseline

Status: in progress

- fork and rebrand as MCP Nexus
- keep upstream remote
- document architecture and goals
- keep production build working
- keep a known-good single-server test

Exit: docs exist, build works, baseline is reproducible.

## Phase 1 — Resilient discovery

- permissive tools/list reader
- pagination
- per-tool normalization
- no silent [] fallback on failure
- last-known-good catalog
- discovery diagnostics

Exit: mixed servers cannot collapse the whole catalog because of one tool.

## Phase 2 — Stable catalog

- stable tool IDs
- exact wire names
- duplicate detection
- preserve outputSchema, annotations and metadata
- durable enable/disable state
- safe bulk enable/disable

Exit: reconnects and refreshes do not scramble tool state.

## Phase 3 — Large catalog UI

- instant search
- grouping by source/server when metadata exists
- compact list
- lazy schema details
- virtualization if measurements show it is needed
- useful counts

Exit: 300+ tools remain fast and understandable.

## Phase 4 — Diagnostics

- diagnostics panel
- last discovery status
- rejected tools
- duplicate collisions
- transport details
- sanitized export report

Exit: "0 tools" is never the only clue a user gets.

## Phase 5 — Execution hardening

- wire-name correctness tests
- clear manual/automatic execution state
- argument validation UX
- failure recovery
- security review of auto-execute paths

Exit: large catalog discovery and execution are both dependable.

## Phase 6 — Release hardening

- stress tests
- memory/performance checks
- Chrome packaging
- Firefox compatibility review
- migration notes
- upstream attribution review
- release notes

Exit: first stable MCP Nexus release.
