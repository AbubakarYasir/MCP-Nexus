# Implementation plan

This is the file-by-file plan for turning the current fork into MCP Nexus.

No implementation should skip directly to the UI. The data path must become reliable first.

## Phase 1: fix discovery semantics

### chrome-extension/src/mcpclient/plugins/streamable-http/StreamableHttpPlugin.ts

Change:

- stop treating listTools failure as an empty tool list
- add tolerant tools/list collection
- support nextCursor pagination
- preserve raw fields
- return explicit errors
- keep resources/prompts failures independent where possible

Do not:

- rename wire tools
- silently drop the whole catalog
- return [] for request/parsing failure

### chrome-extension/src/mcpclient/core/McpClient.ts

Change:

- normalize tools one at a time
- catch schema serialization per tool
- produce discovery diagnostics
- separate discovery status from catalog data
- keep cache semantics explicit

The current normalizeTools map is catalog-wide. Replace it with a defensive loop so one tool cannot throw the entire normalization step.

### chrome-extension/src/mcpclient/types/primitives.ts

Add types for:

- RawTool
- ToolRecord or NormalizedTool v2
- ToolRejection
- DiscoveryDiagnostics
- DiscoveryResult

The type model must represent success-empty separately from failure.

### chrome-extension/src/mcpclient/index.ts

Change the backward-compatibility adapter carefully.

Legacy callers may still expect arrays, but the new internal API should expose structured discovery results.

Do not throw away outputSchema, annotations, icons or metadata during normalization.

## Phase 2: fix background and message contracts

### chrome-extension/src/background/index.ts

Change:

- remove "error -> []" behavior
- keep lastKnownGoodTools or, preferably, lastKnownGoodCatalog
- only replace the catalog after successful discovery
- broadcast discovery status separately from tool data
- keep connection health separate from tool-discovery health

### pages/content/src/types/messages.ts

Define one canonical tool-update payload.

Recommended shape:

~~~text
{
  tools: ToolRecord[],
  discovery: DiscoveryDiagnostics
}
~~~

Both sender and receiver must use the same type.

### pages/content/src/core/mcp-client.ts

Fix the current broadcast mismatch.

Current receiver checks whether message.payload is an array even though the background sends payload.tools.

Change it to consume the typed payload.

Also:

- never call setAvailableTools([]) merely because a refresh failed
- preserve wireName
- preserve discovery diagnostics

### pages/content/src/hooks/useMcpCommunication.ts

Change:

- refreshTools should receive an explicit discovery result
- filtering one invalid tool must not reinterpret the whole result as failure
- JSON.stringify of schemas must be guarded
- expose diagnostics to UI hooks
- keep enabled-state filtering separate from available-catalog state

## Phase 3: stable catalog and persistence

### pages/content/src/stores/tool.store.ts

Replace the current name-only catalog model with stable records.

Add state for:

- availableTools
- lastKnownGoodTools
- discoveryStatus
- lastDiscoveryError
- lastSuccessfulDiscoveryAt
- rejectedTools
- collisions
- enabledToolIds

Rules:

- failure preserves last-known-good
- valid empty success clears catalog
- enabled state uses stable IDs
- bulk enable/disable performs one storage update

### pages/content/src/types/stores.ts

Extend Tool types with:

- id
- wireName
- displayName
- sourceServer?
- inputSchema
- outputSchema?
- annotations?
- schemaFingerprint

Keep compatibility aliases only where needed.

### pages/content/src/utils/storage.ts

Migrate persisted enablement from names to stable IDs.

Migration must be safe and reversible during development.

## Phase 4: large-catalog UI

### pages/content/src/components/sidebar/AvailableTools/AvailableTools.tsx

Keep:

- search
- grouping
- expandable details

Improve:

- search index precomputation
- stable IDs as React keys
- server/source grouping from metadata rather than guessing only from dot prefixes
- lazy schema rendering
- compact status counts
- virtualization if profiling proves it is needed

Do not render all full JSON schemas for all tools at once.

### pages/content/src/components/mcpPopover/mcpPopover.tsx

Review tool-list rendering and any prompt generation that serializes the entire tool catalog.

Large catalogs should not create giant DOM trees or giant prompt payloads by default.

## Phase 5: diagnostics

Likely targets:

- pages/content/src/components/sidebar/ServerStatus
- pages/content/src/components/sidebar/AvailableTools
- pages/content/src/stores
- background messages

Add:

- connection status
- discovery status
- accepted/rejected/duplicate counts
- last success time
- transport
- sanitized export

## Phase 6: execution hardening

Files to review:

- pages/content/src/core/mcp-client.ts
- chrome-extension/src/background/index.ts
- chrome-extension/src/mcpclient/core/McpClient.ts
- pages/content/src/services/automation.service.ts

Rules:

- execution uses wireName
- displayName is never sent to tools/call
- tool errors do not imply connection failure
- auto-execute state is explicit
- destructive actions remain user-controlled

## Build and validation tools

Use the repository's existing toolchain:

~~~bash
pnpm install --frozen-lockfile
pnpm type-check
pnpm build
git diff --check
~~~

Browser validation:

- unpacked Chrome extension
- Streamable HTTP gateway
- minimal test config
- mixed-schema test config
- full 29-server stress profile

## Commit sequence

Recommended commits:

1. fix(discovery): add resilient tools/list collection
2. fix(messages): make tool-update payload consistent
3. feat(catalog): add stable catalog and diagnostics
4. feat(storage): persist stable tool enablement
5. feat(ui): optimize large tool catalog
6. feat(diagnostics): add discovery health UI
7. fix(execution): harden wire-name execution
8. test: add large-catalog regression coverage

Each commit should build on its own.
