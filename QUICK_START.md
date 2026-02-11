# Quick Start - Complete the Backend Refactor

## 🚀 Run These Commands (in order):

### 1. Preview what will be deleted
```powershell
cd d:\8-2-26\backend
.\CLEANUP.ps1 -DryRun
```
This shows you all the old files/folders that will be removed. **No files are deleted.**

### 2. Run the actual cleanup
```powershell
.\CLEANUP.ps1
```
- Type `yes` when prompted
- Creates automatic backup in `backup_YYYYMMDD_HHMMSS/`
- Deletes old directory structure

### 3. Verify the build works
```powershell
cd functions
npm run build
```
Should now compile with **0 errors** (or only minor linting warnings).

### 4. Test everything works (optional)
```powershell
npm test  # If you have tests
```

---

## ✅ That's it!

Your backend is now properly structured following Clean Architecture principles.

### What Changed:
- ✅ `core/interfaces/` → `domain/repositories/` (with I- prefix)
- ✅ `interfaces/api/` → `adapters/http/`
- ✅ `interfaces/triggers/` → `adapters/events/`
- ✅ `modules/*/usecases/` → `application/use-cases/`
- ✅ `domain/flagEngine` → `business-logic/flags/`

### What to Do Next:
Read `BACKEND_REFACTOR_SUMMARY.md` for full details.

---

## 🆘 If Something Breaks

### Restore from backup:
```powershell
# Find your backup folder (will be named like backup_20260210_160812)
$backup = Get-ChildItem -Directory | Where-Object { $_.Name -like 'backup_*' } | Sort-Object -Descending | Select-Object -First 1

# Restore (copy everything back)
Copy-Item -Path "$($backup.FullName)\*" -Destination "functions\src" -Recurse -Force
```

Then revert `functions\src\index.ts` to use old export paths.

---

**Total Time**: ~5 minutes  
**Risk Level**: Low (automatic backups created)  
**Impact**: High (much cleaner codebase)
