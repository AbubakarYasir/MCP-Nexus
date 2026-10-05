# Contributing to MCP Nexus

Thanks for helping build a browser MCP client that can handle serious multi-server setups.

## Before coding

Read:

1. [Project plan](docs/PROJECT_PLAN.md)
2. [Architecture](docs/ARCHITECTURE.md)
3. [Tool ingestion design](docs/TOOL_INGESTION.md)
4. [Testing plan](docs/TESTING.md)

## Setup

~~~bash
pnpm install --frozen-lockfile
pnpm type-check
pnpm build
~~~

Load dist as an unpacked extension in Chrome.

## Pull requests

Keep each pull request focused.

A good PR explains:

- the failure or limitation
- the invariant being protected
- how it was tested
- whether it changes tool identity or execution behavior

## Core rule

**Never fix a bad tool by deleting the good tools around it.**

Errors should be isolated and visible.

## Security

Do not include API keys, private MCP configs or credentials in issues, tests, logs or screenshots.

## Style

Prefer simple code and explicit state over clever fallbacks.

Do not turn exceptions into empty successful results unless the protocol itself returned a valid empty result.
