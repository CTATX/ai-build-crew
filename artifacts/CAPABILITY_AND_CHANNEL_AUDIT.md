# Capability and Channel Audit

Audit date: August 8, 2026

## Fact

The public product, artifact hub, repository main branch, and release-candidate branch are not currently the same release.

| Capability | Sites Alpha 01 | GitHub main v0.1 | v0.2 release candidate |
|---|---:|---:|---:|
| Idea prompt | No | Yes | Yes, with beginner framing |
| Guided intake | No | Yes, defaults could pass silently | Yes, explicit unanswered states |
| Three-provider catalog | No | Yes | Yes |
| Cross-provider measured ranking | No | No | No |
| Deterministic cost engine | Yes | Yes | Yes |
| Budget block | No | Yes | Yes |
| Unknown-risk review | No | Partial | Yes |
| Person-neutral reusable UI | No | No | Yes |
| 12-month forecast | Annual run rate | No | Yes |
| Cost per completed task | No | No | Unreleased correction |
| Model-owned output/retry distribution | No | No | Unreleased correction; heuristic evidence |
| Independent corrupted-ledger detection | No | No | Unreleased correction |
| Saved estimate history | No | No | No |
| Actual-cost tracking | No | No | No |
| Automated catalog refresh | No | No | No |

## Control point

No release note may use “shipped” without naming the channel and the verified commit. Build success is not deployment success. A catalog comparison is not a measured evaluation. A set of logical modules is not a deployed multi-agent system.

## Action

- Treat v0.2 as a release candidate until both public channels run the same reviewed commit.
- Show the current capability boundary on the product page and in the presentation.
- Record every deployment with commit, timestamp, URL, smoke results, and rollback target.
- Re-run drift classification whenever copy, rules, catalog, engine, or artifacts change.
