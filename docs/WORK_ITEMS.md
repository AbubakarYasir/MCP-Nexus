# Work items

GitHub Issues are currently disabled for this repository, so this file is the canonical implementation checklist until the issue tracker is enabled.

## P0 — baseline and documentation

- [x] fork upstream
- [x] rename product to MCP Nexus
- [x] keep upstream remote
- [x] fix missing 16px icon in the fork
- [x] document project mission
- [x] document architecture
- [x] document tool-ingestion rules
- [x] document test strategy
- [x] document security model
- [x] document upstream strategy
- [x] record current failure baseline

## P1 — resilient discovery

- [x] tolerant tools/list collection
- [x] nextCursor pagination
- [x] per-tool normalization
- [x] guarded schema serialization
- [x] preserve outputSchema/annotations/metadata
- [ ] explicit discovery result
- [x] no error -> [] conversion
- [x] last-known-good behavior
- [x] fix background/content tool-update payload mismatch
- [x] regression tests

## P2 — stable catalog

- [ ] ToolRecord model
- [ ] stable internal ids
- [ ] exact wireName
- [ ] source metadata when available
- [ ] schema fingerprint
- [ ] collision diagnostics
- [ ] enabledToolIds
- [ ] storage migration

## P3 — large-catalog UI

- [ ] keep and optimize search
- [ ] source/server grouping
- [ ] compact rows
- [ ] lazy details
- [ ] performance measurement
- [ ] virtualization if needed
- [ ] total/enabled/rejected counts

## P4 — diagnostics

- [ ] discovery status
- [ ] last successful discovery
- [ ] accepted/rejected/duplicate counts
- [ ] per-tool rejection reasons
- [ ] transport details
- [ ] sanitized diagnostic export

## P5 — execution/security

- [ ] exact wire-name execution tests
- [ ] tool error vs connection error separation
- [ ] auto-execute review
- [ ] result-rendering sanitization review
- [ ] secret leakage review

## P6 — release

- [ ] full 29-server stress test
- [ ] 300+ tool performance test
- [ ] Chrome production build
- [ ] Firefox review
- [ ] attribution/license review
- [ ] migration notes
- [ ] release notes
- [ ] reproducible package


## Technical debt

- [ ] fix inherited content-script ImportMeta.env typing
- [ ] fix inherited DOM iterable typing
- [ ] fix inherited browser timer versus NodeJS.Timeout typing
