# Current technical baseline

This file records what is known before the Nexus tool-layer rewrite.

## What already works

The browser extension, proxy and Streamable HTTP path can work correctly.

Observed baselines:

- one small MCP server with 5 tools works
- a two-server combination with 45 tools works
- the extension can connect and execute the normal discovery flow
- the full proxy stack can initialize many MCP servers successfully

This proves the problem is not simply "more than 5 tools" or "more than 1 MCP server."

## What fails

Some mixed server groups connect successfully but the extension shows zero available tools.

The failure depends on the shape of the combined catalog, not just the tool count.

## Confirmed code risks

### 1. Strict catalog-wide parsing

File:

chrome-extension/src/mcpclient/plugins/streamable-http/StreamableHttpPlugin.ts

The plugin calls the MCP SDK client.listTools() method.

That method validates the complete tools/list response. If one aggregated tool is incompatible with the SDK schema, the whole call may reject.

### 2. Discovery errors are converted to empty success

The Streamable HTTP plugin catches listTools errors and continues.

Its outer getPrimitives error handler also returns an empty array.

This loses the difference between:

- valid zero tools
- one invalid tool
- parser failure
- request failure

### 3. Background code also converts errors to []

File:

chrome-extension/src/background/index.ts

The mcp:get-tools handler catches discovery errors and returns an empty array.

This creates a second path that can turn a real error into "0 tools."

### 4. Tool-update broadcast payload mismatch

Background broadcast shape:

~~~text
payload: {
  tools
}
~~~

Content-side listener in:

pages/content/src/core/mcp-client.ts

currently checks whether message.payload itself is an array.

If it is not, it uses [].

That means a valid broadcast with payload.tools can be interpreted as an empty tool update.

This is a concrete bug and must be fixed before large-catalog work is considered stable.

### 5. Tool store replaces the entire catalog

File:

pages/content/src/stores/tool.store.ts

setAvailableTools directly replaces availableTools.

If any upstream layer sends [], the store accepts it as authoritative.

There is no discovery status or last-known-good protection.

### 6. Enablement is keyed by tool name

The current store keeps enabledTools as a Set of tool names.

This can become ambiguous when large aggregated catalogs contain duplicate or colliding names.

### 7. UI already has useful large-list behavior

File:

pages/content/src/components/sidebar/AvailableTools/AvailableTools.tsx

The current UI already includes:

- search
- grouping by a prefix before a dot
- enabled/disabled sorting
- expandable tool details

Nexus should keep the useful parts and optimize them rather than rewrite the sidebar blindly.

## Working hypothesis

The false empty-catalog problem is produced by multiple layers that all treat errors as [].

Nexus therefore needs an end-to-end contract, not a one-line patch.

The catalog must carry both:

- data
- discovery status

and only a successful tools/list response may authoritatively replace the catalog.

## Next step

Implement Phase 1 from IMPLEMENTATION_PLAN.md, then run the TESTING.md matrix before changing the large-catalog UI.
