---
description: Feature branch git workflow
---

## Creating a Feature Branch

1. Ensure you are on the latest `main` branch:
```bash
git checkout main
git pull origin main
```

2. Create and checkout a new feature branch:
```bash
git checkout -b feature/<ticket-id>-short-description
# Example: feature/BX-123-add-user-login
```

## During Development

3. Commit frequently with meaningful messages following Conventional Commits:
```
feat: add login form validation
fix: handle empty email edge case
chore: update dependencies
```

4. Push branch to remote regularly:
```bash
git push origin feature/<branch-name>
```

## Creating a Pull Request

5. Rebase on `main` before opening a PR to keep history clean:
```bash
git fetch origin
git rebase origin/main
```

6. Open a Pull Request with:
   - Title matching the ticket: `feat: BX-123 Add user login`
   - Description of changes and testing steps
   - Link to the ticket/issue

## After Merge

7. Delete the feature branch locally and remotely:
```bash
git branch -d feature/<branch-name>
git push origin --delete feature/<branch-name>
```
