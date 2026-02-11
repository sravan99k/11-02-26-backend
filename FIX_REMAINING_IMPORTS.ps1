# Fix Remaining Import Paths
# Updates all remaining references to old module paths

$ErrorActionPreference = "Continue"
$srcPath = "functions\src"

Write-Host "Fixing remaining import paths..." -ForegroundColor Cyan

# Define a function for safer replacement
function Safe-Replace {
    param($content, $oldPath, $newPath)
    # Using [regex]::Escape for the part we want to literal match if needed, 
    # but here we want to match the core part of the import.
    # We'll use simple string replace for the specific path segments to avoid PS regex escaping hell.
    return $content.Replace($oldPath, $newPath)
}

# Fix paths in adapters
$adapterFiles = Get-ChildItem -Path "$srcPath\adapters" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $adapterFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (!$content) { continue }
    
    $original = $content
    
    # Fix use case imports (modules/* -> application/use-cases/*)
    $content = $content.Replace("modules/admin/usecases", "application/use-cases/admin")
    $content = $content.Replace("modules/analytics/usecases", "application/use-cases/analytics")
    $content = $content.Replace("modules/assessment/usecases", "application/use-cases/assessment")
    $content = $content.Replace("modules/school/usecases", "application/use-cases/school")
    $content = $content.Replace("modules/users/usecases", "application/use-cases/users")
    $content = $content.Replace("modules/wellness/usecases", "application/use-cases/wellness")
    
    if ($content -ne $original) {
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
    }
}

# Fix paths in infrastructure
$infraFiles = Get-ChildItem -Path "$srcPath\infrastructure" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $infraFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (!$content) { continue }
    
    $original = $content
    
    # Fix domain/flag* -> business-logic/flags/*
    $content = $content.Replace("domain/flagEngine", "business-logic/flags/engine")
    $content = $content.Replace("domain/flagDerivers", "business-logic/flags/derivers")
    $content = $content.Replace("domain/scheduler", "business-logic/scheduler")
    
    if ($content -ne $original) {
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
    }
}

# Fix paths in application/use-cases
$useCaseFiles = Get-ChildItem -Path "$srcPath\application\use-cases" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $useCaseFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (!$content) { continue }
    
    $original = $content
    
    # Fix any remaining old paths
    $content = $content.Replace("modules/admin/usecases", "application/use-cases/admin")
    $content = $content.Replace("modules/analytics/usecases", "application/use-cases/analytics")
    $content = $content.Replace("modules/assessment/usecases", "application/use-cases/assessment")
    $content = $content.Replace("modules/school/usecases", "application/use-cases/school")
    $content = $content.Replace("modules/users/usecases", "application/use-cases/users")
    $content = $content.Replace("modules/wellness/usecases", "application/use-cases/wellness")
    
    if ($content -ne $original) {
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Done!" -ForegroundColor Green
