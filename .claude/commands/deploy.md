# Deploy

Build, verify, commit, and push to deploy via Vercel.

## Steps:
1. Run `npm run build` — if it fails, fix the errors first
2. Run `npm run lint` — fix any warnings
3. `git status` to review all changes
4. `git diff --stat` to see scope of changes
5. Stage relevant files (prefer specific files over `git add -A`)
6. Write a descriptive commit message explaining WHAT changed and WHY
7. `git push origin main` to trigger Vercel auto-deploy
8. Confirm push succeeded

## Commit message format:
First line: short summary (under 72 chars)
Blank line
Body: bullet points of what changed and why

Always include: Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
