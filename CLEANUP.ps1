# Cleanup Old File Structure
# This script removes old directories after migration is verified

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"
$srcPath = "functions\src"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Structure Cleanup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be deleted" -ForegroundColor Yellow
    Write-Host ""
}

# Directories to remove
$directoriesToRemove = @(
    "$srcPath\core\interfaces",
    "$srcPath\interfaces\api",
    "$srcPath\interfaces\triggers",
    "$srcPath\domain\flagDerivers",
    "$srcPath\domain\scheduler"
)

# Files to remove
$filesToRemove = @(
    "$srcPath\domain\flagEngine.ts"
)

# Modules use case directories to remove (keep the module directory itself for now)
$useCaseDirsToRemove = @(
    "$srcPath\modules\admin\usecases",
    "$srcPath\modules\analytics\usecases",
    "$srcPath\modules\assessment\usecases",
    "$srcPath\modules\school\usecases",
    "$srcPath\modules\users\usecases",
    "$srcPath\modules\wellness\usecases"
)

# Safety check
if (!$Force) {
    Write-Host "⚠️  WARNING: This will DELETE the following:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Directories:" -ForegroundColor Yellow
    foreach ($dir in $directoriesToRemove) {
        if (Test-Path $dir) {
            $count = (Get-ChildItem $dir -Recurse -File).Count
            Write-Host "  - $dir ($count files)" -ForegroundColor Yellow
        }
    }
    foreach ($dir in $useCaseDirsToRemove) {
        if (Test-Path $dir) {
            $count = (Get-ChildItem $dir -Recurse -File).Count
            Write-Host "  - $dir ($count files)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Files:" -ForegroundColor Yellow
    foreach ($file in $filesToRemove) {
        if (Test-Path $file) {
            Write-Host "  - $file" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "These files have been COPIED to new locations." -ForegroundColor Cyan
    Write-Host "Make sure the build succeeds before running cleanup!" -ForegroundColor Red
    Write-Host ""
    
    $confirmation = Read-Host "Are you sure you want to proceed? (yes/no)"
    if ($confirmation -ne 'yes') {
        Write-Host "Cleanup cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Create backup before deletion
$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Write-Host "Creating backup in: $backupDir..." -ForegroundColor Yellow

if (!$DryRun) {
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    
    # Backup directories
    foreach ($dir in ($directoriesToRemove + $useCaseDirsToRemove)) {
        if (Test-Path $dir) {
            $relativePath = $dir -replace [regex]::Escape($srcPath), ''
            $backupPath = Join-Path $backupDir $relativePath
            Write-Host "  Backing up: $dir" -ForegroundColor Green
            Copy-Item -Path $dir -Destination $backupPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Backup files
    foreach ($file in $filesToRemove) {
        if (Test-Path $file) {
            $relativePath = $file -replace [regex]::Escape($srcPath), ''
            $backupPath = Join-Path $backupDir $relativePath
            $backupParent = Split-Path $backupPath -Parent
            New-Item -ItemType Directory -Force -Path $backupParent -ErrorAction SilentlyContinue | Out-Null
            Write-Host "  Backing up: $file" -ForegroundColor Green
            Copy-Item -Path $file -Destination $backupPath -Force
        }
    }
}

Write-Host ""
Write-Host "Deleting old directories and files..." -ForegroundColor Yellow
Write-Host ""

# Delete use case directories first (sub-directories of modules)
foreach ($dir in $useCaseDirsToRemove) {
    if (Test-Path $dir) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would delete: $dir" -ForegroundColor Gray
        } else {
            Write-Host "  Deleting: $dir" -ForegroundColor Red
            Remove-Item -Path $dir -Recurse -Force
        }
    }
}

# Delete main directories
foreach ($dir in $directoriesToRemove) {
    if (Test-Path $dir) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would delete: $dir" -ForegroundColor Gray
        } else {
            Write-Host "  Deleting: $dir" -ForegroundColor Red
            Remove-Item -Path $dir -Recurse -Force
        }
    }
}

# Delete files
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would delete: $file" -ForegroundColor Gray
        } else {
            Write-Host "  Deleting: $file" -ForegroundColor Red
            Remove-Item -Path $file -Force
        }
    }
}

# Clean up empty parent directories
Write-Host ""
Write-Host "Cleaning up empty directories..." -ForegroundColor Yellow

$emptyDirs = @(
    "$srcPath\core",
    "$srcPath\interfaces",
    "$srcPath\modules\admin",
    "$srcPath\modules\analytics",
    "$srcPath\modules\assessment",
    "$srcPath\modules\school",
    "$srcPath\modules\users",
    "$srcPath\modules\wellness",
    "$srcPath\modules"
)

foreach ($dir in $emptyDirs) {
    if (Test-Path $dir) {
        $items = Get-ChildItem $dir -ErrorAction SilentlyContinue
        if ($items.Count -eq 0) {
            if ($DryRun) {
                Write-Host "  [DRY RUN] Would delete empty dir: $dir" -ForegroundColor Gray
            } else {
                Write-Host "  Deleting empty dir: $dir" -ForegroundColor Red
                Remove-Item -Path $dir -Force
            }
        } else {
            Write-Host "  Keeping non-empty dir: $dir (Contains $($items.Count) items)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (!$DryRun) {
    Write-Host "Backup saved to: $backupDir" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run 'npm run build' to verify compilation" -ForegroundColor White
    Write-Host "2. Test your application" -ForegroundColor White
    Write-Host "3. If issues arise, restore from backup" -ForegroundColor White
} else {
    Write-Host "This was a DRY RUN. No files were deleted." -ForegroundColor Yellow
    Write-Host "Run without -DryRun flag to actually delete files." -ForegroundColor White
}

Write-Host ""
