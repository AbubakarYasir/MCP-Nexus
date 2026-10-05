# ADR 0003: Preserve the last-known-good catalog

Status: accepted

## Decision

If a refresh fails, MCP Nexus keeps the previous successful tool catalog.

Only a successful tools/list response that explicitly contains zero tools may replace the catalog with an empty list.

## Why

A network error, parser error and valid empty catalog are different states.

Converting all three into [] creates false "0 tools" failures and destroys user state.

## Consequence

Catalog state and discovery status are stored separately.
