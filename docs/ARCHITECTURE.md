# MCP Nexus architecture

## Current shape

MCP Nexus currently inherits the MCP SuperAssistant architecture.

~~~text
Web page content script
        |
Chrome runtime messages
        |
Background service worker
        |
McpClient
        |
Transport plugin
        |
MCP gateway
        |
many MCP servers
~~~

The extension talks to one gateway endpoint. The gateway can aggregate many MCP servers behind that endpoint.

That is the model we want to keep for the first stable Nexus release.

## Current failure path

The important failure is not connection startup. It is discovery.

A simplified version of the current path is:

~~~text
tools/list
   |
SDK parses the full response
   |
one tool violates the SDK schema
   |
listTools throws
   |
transport catches the error
   |
returns an empty primitive list
   |
background returns []
   |
UI stores []
   |
user sees "0 tools"
~~~

This destroys useful information. A discovery error and a valid empty tool list are not the same thing.

## Target architecture

~~~text
Transport
   |
Raw discovery
   |
Resilient page collector
   |
Per-tool normalizer
   |
Catalog validator
   |
Stable tool catalog
   |   | -- diagnostics
   |
UI + executor
~~~

### 1. Transport

Owns connection and MCP request delivery.

It must not decide that a schema failure means "zero tools."

### 2. Raw discovery

Fetches tools/list pages.

Responsibilities:

- request every page
- preserve raw server fields
- report protocol errors
- return explicit discovery success or failure

### 3. Per-tool normalizer

Converts one raw tool at a time.

A bad tool is skipped or quarantined individually.

Minimum requirement for a usable tool:

- non-empty string name

Everything else should be handled defensively.

### 4. Catalog validator

Builds the usable catalog.

Responsibilities:

- duplicate detection
- stable identity
- schema serialization
- source metadata when available
- diagnostics for rejected tools

### 5. Stable tool catalog

The UI must read from a last-known-good catalog.

A refresh has three possible outcomes:

- success with tools: replace catalog
- success with zero tools: replace catalog with empty
- failure: keep old catalog and record the failure

### 6. UI

The UI should not render hundreds of large schema objects at once.

Use:

- compact rows
- search
- grouping
- lazy details
- virtualization when needed

### 7. Executor

Execution must use the exact wire tool name.

Display labels and internal IDs must never silently change the name sent to tools/call.

## Identity model

Preferred internal shape:

~~~text
ToolRecord
- id
- wireName
- displayName
- description
- inputSchema
- outputSchema
- sourceServer?
- annotations?
- rawMeta?
- schemaFingerprint
~~~

If the gateway exposes source-server metadata, use it in the stable ID.

If it does not, use the exact wire name plus a schema fingerprint and report collisions rather than guessing.

## State model

The catalog needs:

- current tools
- last successful discovery timestamp
- last discovery error
- rejected tool diagnostics
- enabled tool IDs
- duplicate/collision diagnostics

Enabled state should be keyed by stable IDs, not array indexes.

## Compatibility rule

Nexus should preserve unknown MCP fields wherever practical.

The extension should be strict about what it sends to tools/call, but tolerant about extra fields received during discovery.
