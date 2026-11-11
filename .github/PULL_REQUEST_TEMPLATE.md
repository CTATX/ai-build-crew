## Summary

<!-- What changed and why. -->

## Release checklist (D-2026-11-11-07 / D-2026-11-11-08)

Full procedure: [RELEASE_CHECKLIST.md](../RELEASE_CHECKLIST.md). Tess – Release & Test has a veto until these pass. She does not ship.

Mutual-check (CT): "we check one another when we miss as I do and I did". Anyone, CT included, calls out a skipped check before release.

- [ ] Preview first, with bindings, storage, and settings identical to prod (preview target recorded)
- [ ] `release-parity` CI is green (`node scripts/release/parity-check.mjs`)
- [ ] Parity table in the checklist is filled (names only): `ASSETS`, `DB`, `IMAGES`, and the listed vars/secrets
- [ ] Signed-in / owner smoke recorded: live data loads, every page opens, new feature works (who / when CT)
- [ ] Rollback target recorded (Sites version / deploy id + commit; Pages SHA if published)
- [ ] KV write-rate lesson considered if this change writes to a rate-limited store (about 1 write/sec per key; mocks must rate-limit)
- [ ] Mira YES
- [ ] Clara PASS at this SHA
- [ ] Vera PASS or n/a
- [ ] Tess – Release & Test GO
- [ ] CT prod go (only CT; not this PR alone)
