# Tool ingestion design

This is the core reliability work in MCP Nexus.

## Problem

The inherited client relies on the MCP SDK's strict tools/list result schema.

That is normally useful. In an aggregated gateway, however, one incompatible tool can cause the entire list request to fail.

The inherited code then catches the error and returns an empty array. The UI cannot tell the difference between:

- a server with zero tools
- a parser failure
- a transport failure
- one incompatible tool inside a large valid response

MCP Nexus must keep those states separate.

## Required discovery contract

Discovery returns one of these explicit outcomes:

### Success

~~~text
status: success
tools: [...]
rejectedTools: [...]
diagnostics: [...]
~~~

### Valid empty catalog

~~~text
status: success
tools: []
~~~

### Failure

~~~text
status: error
error: ...
previousCatalogPreserved: true
~~~

A thrown error must never be converted into success with an empty tools array.

## Tool acceptance

A raw tool is accepted when it has a non-empty string name.

Fields should then be normalized defensively:

- description: string or empty string
- inputSchema: preserve object when possible, otherwise safe empty object
- outputSchema: preserve when present
- annotations: preserve
- icons: preserve
- _meta: preserve
- unknown fields: keep in raw metadata when useful

Schema JSON serialization must be guarded. A serialization error on one tool must not stop the catalog.

## Pagination

tools/list may return nextCursor.

Nexus must:

1. fetch the first page
2. append accepted tools
3. follow nextCursor until absent
4. keep per-page diagnostics
5. reject infinite cursor loops
6. enforce a high but finite safety limit

## Duplicate names

Never silently overwrite duplicate tools.

Store:

- exact wire name
- stable internal ID
- optional source server
- schema fingerprint

If two tools are indistinguishable from the metadata available to the extension, report a collision.

Do not invent a renamed wire tool unless the gateway itself exposes such a name.

## Last-known-good behavior

Refresh logic:

~~~text
if discovery succeeded:
    catalog = new catalog
    clear discovery error
else:
    catalog = previous catalog
    store discovery error
~~~

A valid empty response is allowed to clear the catalog.

A failed request is not.

## Notifications

If the server later supports tools/list_changed notifications, treat them as refresh requests.

A notification must not directly clear the catalog.

## Diagnostics

Every discovery run should record:

- transport
- start/end time
- pages fetched
- raw tool count
- accepted tool count
- rejected tool count
- duplicate count
- error summary
- whether the old catalog was preserved

Do not include API keys, auth headers or full secret-bearing server configs.

## Execution boundary

The tool catalog may use stable internal IDs, but tools/call must receive the exact wireName.

Display names are presentation only.

## Performance

For 300+ tools:

- normalization should be linear
- schema stringification should happen once per discovery
- large schema details should not render until opened
- filtering should use precomputed lowercase search text
- enabled state should not trigger one storage write per tool during bulk operations

## First implementation slice

The first patch should only change discovery semantics:

1. permissive tools/list collection
2. per-tool normalization
3. explicit errors
4. last-known-good fallback

Do not mix the first reliability patch with a UI redesign.
