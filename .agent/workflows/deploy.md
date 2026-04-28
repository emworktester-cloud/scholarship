---
description: How to deploy the application and database updates zero-touch
---

# Deploy System (Zero-Touch)

// turbo-all

## 1. Database Deployment (Supabase Zero-Touch)

To deploy or update the database schema directly to Supabase without manual CLI intervention, run the custom Node deployment script. This uses the direct connection string.

```bash
cmd /c "cd c:\Users\USER\.gemini\antigravity\scratch\scholar && node scripts/db-deploy.js"
```

## 2. GitHub Deployment (Zero-Touch)

To push code changes to the remote GitHub repository (`emworktester-cloud/scholarship`) automatically, run the `deploy.bat` script.

1. MUST check for build errors first before deploying:
```bash
cmd /c "cd c:\Users\USER\.gemini\antigravity\scratch\scholar && npm run build"
```
Wait for the command to COMPLETE successfully. If it FAILS, you MUST fix the TypeScript/Vite errors first.

2. Run the auto-deploy script with a commit message:
```bash
cmd /c "C:\Users\USER\.gemini\antigravity\scratch\scholar\deploy.bat ""your commit message here"""
```

## Notes
- Build usually takes a few seconds to a minute via Vite `npm run build`.
- Database pushes apply raw SQL via the `pg` client. Ensure SQL syntax is standard PostgreSQL.
- **AI Rule**: After successfully deploying or pushing to Git, ALWAYS reply to the user with a summary of the actions taken, the result of the GitHub/DB push, and the COMMIT HASH (รหัส commit) so the user can verify easily.
