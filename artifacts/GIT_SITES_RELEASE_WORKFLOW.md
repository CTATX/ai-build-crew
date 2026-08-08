# GitHub and Sites release workflow

GitHub is the authoritative source and history. Sites is the hosted application runtime. GitHub Pages is the static artifact hub. The custom domain points to Sites.

## One governed release

1. Start from the last approved GitHub commit and create a release branch.
2. Make product and artifact changes on that branch.
3. Run tests, production build, secret scan, artifact link check, and TeamOS drift audit.
4. Open a draft pull request and review the complete change set.
5. Merge the approved pull request to `main` and create a release tag.
6. Save a Sites version from that exact Git commit and deploy it.
7. Verify the Sites URL and custom domain, then publish the matching GitHub release.
8. Record commit, tag, Sites version, deployed URL, catalog version, rules version, and engine version in the release notes.

Do not maintain an untracked second copy of the app in Sites. Do not auto-publish material catalog or rule changes. A refresh may open a reviewed change, but release still passes through the same gate.
