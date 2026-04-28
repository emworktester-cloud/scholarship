---
description: How to run the system locally on localhost:9000
---

# Run System Locally

// turbo-all

## Steps

1. Kill any existing process on port 9000:
```
cmd /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :9000 ^| findstr LISTENING') do taskkill /PID %a /F 2>nul"
```

2. Start the dev server using Vite:
```
cmd /c "cd c:\Users\USER\.gemini\antigravity\scratch\scholar && npm run dev"
```

3. Wait for `✓ ready` in the output, then verify the server responds:
- Check the command output for any errors
- Access the local site via http://localhost:9000

## Common Issues

- **`Port 9000 is in use`**: Kill the old process first (Step 1).
- **Missing modules**: Ensure you have run `npm install` inside the `scholar` directory.
- **Rollup failed to resolve import**: Ensure that relative import paths (e.g. `../../../assets/...`) are correct and the asset files actually exist in the `src/assets` folder.
