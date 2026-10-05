# ADR 0002: Tool failures are isolated

Status: accepted

## Decision

Tool discovery and normalization must fail per tool whenever possible.

One incompatible tool must not clear valid tools from the catalog.

## Why

Aggregated gateways combine software written by different teams, SDK versions and schema generators.

Catalog-wide strict parsing creates a single point of failure.

## Consequence

Nexus will use a tolerant discovery boundary and its own per-tool normalization before data enters the stable catalog.
