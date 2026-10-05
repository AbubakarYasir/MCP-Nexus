# ADR 0001: One gateway, many MCP servers

Status: accepted

## Decision

MCP Nexus will keep one browser connection to an MCP gateway for the first stable release.

The gateway may aggregate many MCP servers.

## Why

This keeps browser networking simple and matches the working deployment model inherited from MCP SuperAssistant.

It also avoids asking the extension to spawn or directly manage local MCP processes.

## Consequence

Nexus must be much more resilient when one tools/list response represents many underlying servers.

The extension cannot assume a small homogeneous tool list.
