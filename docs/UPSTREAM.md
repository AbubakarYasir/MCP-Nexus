# Upstream strategy

MCP Nexus is a fork of MCP SuperAssistant.

Upstream:

~~~text
https://github.com/srbhptl39/MCP-SuperAssistant
~~~

Nexus should keep useful upstream fixes without losing the large-catalog architecture.

## Remote layout

~~~text
origin   AbubakarYasir/MCP-Nexus
upstream srbhptl39/MCP-SuperAssistant
~~~

## Sync workflow

~~~bash
git fetch upstream
git switch feat/all-mcp-research-stack
git merge upstream/main
~~~

Resolve conflicts locally, run the full validation gate, then push to origin.

Do not blindly merge upstream changes in these sensitive areas:

- MCP client
- transport plugins
- tool normalization
- tool store
- enablement persistence
- diagnostics
- large-catalog UI

Review them against Nexus invariants first.

## Nexus invariants

Upstream changes must not reintroduce:

- discovery error -> []
- full-catalog failure because one tool is incompatible
- array-index tool identity
- execution using display names instead of wire names
- destructive refresh behavior
- secret-bearing diagnostics

## Attribution

Keep the original MIT license and clearly credit MCP SuperAssistant.

Nexus should describe itself as a fork and evolution, not as the original project.
