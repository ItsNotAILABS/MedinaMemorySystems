# Medina Builder Orchestrator

Python orchestrates file creation and shell commands. Node medina-builder invokes this when Python is available.

## Usage

```bash
echo '{"action":"build","projectDir":"generated/my-app","files":[...]}' | python orchestrator.py
```

## Actions

- `write` — write files only
- `build` — write files + npm install (dev server started by Node for preview)

## From the UI

1. Create a project
2. Click **Build & Run** (or ask Agent: "build and run my app")
3. Python writes files → terminal runs npm install → dev server starts
4. **Live Preview** tab shows `http://localhost:PORT` in embedded browser
