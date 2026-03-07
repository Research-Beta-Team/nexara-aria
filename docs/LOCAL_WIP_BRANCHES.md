# Local-only WIP branches

Use a **local-only branch** when you want to work on a feature (e.g. ABM engine) without pushing it to GitHub. The branch and all commits stay on your machine until you merge and push.

## Workflow

1. **Create a branch and work only there**
   ```bash
   git checkout -b feature/abm-engine-wip
   ```

2. **Commit as usual on this branch.**  
   No change to your normal commit workflow.

3. **Do not push this branch.**  
   Do **not** run `git push origin feature/abm-engine-wip`. It stays only on your machine.

4. **When you're ready to ship**, merge into `main` (or your default branch) and push that branch:
   ```bash
   git checkout main
   git merge feature/abm-engine-wip
   git push origin main
   ```

Everything stays in the same repo and history; GitHub simply never sees the WIP branch until you merge and push.

## Summary

| Step        | Command / action                                      |
|------------|--------------------------------------------------------|
| Start WIP  | `git checkout -b feature/abm-engine-wip`              |
| Work       | Edit, commit as usual                                  |
| Keep local | Do **not** `git push` this branch                      |
| Ship       | `git checkout main` → `git merge feature/abm-engine-wip` → `git push origin main` |
