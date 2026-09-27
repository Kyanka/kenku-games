# Rule 05 — Git Workflow

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code; always deployable |
| `feature/<name>` | New features, e.g. `feature/snake-game` |
| `fix/<name>` | Bug fixes, e.g. `fix/zero-auth-mismatch` |
| `chore/<name>` | Infra, tooling, deps — no user-facing change |

**Never commit directly to `main`** for anything non-trivial. Open a PR, get a review (or self-review), then merge.

---

## Commit message convention

```
<type>(<scope>): <short imperative description>

[optional body: what & why, not how]
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `core` | Architecture, refactor, internal restructure (no new feature, no bug) |
| `chore` | Config, deps, build scripts, CI |
| `docs` | Documentation only |
| `test` | Tests only |

### Scope (optional but encouraged)

Use the package or area: `web`, `server`, `db`, `zero`, `deploy`, `auth`.

### Examples

```
feat(web): add username loading state to Profile page
fix(server): return real userID from handleQueryRequest for zero auth
core(zero): wire bearer token auth through ZeroProvider
chore(deps): add pino and pino-pretty to server
docs(.claude): add deployment and git workflow rules
```

---

## Pull requests

- Title follows the same `type(scope): description` format
- Description should include: **What** changed, **Why**, and **How to test**
- Link related issues if any
- Squash-merge preferred to keep `main` history clean

---

## Tagging releases

```bash
git tag v0.1.0 -m "Initial working auth + profile sync"
git push origin v0.1.0
```

Use semantic versioning: `MAJOR.MINOR.PATCH`.
This is an educational project, so `0.x` versions are fine indefinitely.
