# Backend File Structure Migration Script
# This script will:
# 1. Move repository interfaces to domain/repositories with 'I' prefix
# 2. Move service interfaces to application/services with 'I' prefix
# 3. Move use cases to application/use-cases
# 4. Move API handlers to adapters/http
# 5. Move triggers to adapters/events
# 6. Move business logic to business-logic
# 7. Update all import statements

$ErrorActionPreference = "Stop"
$srcPath = "functions\src"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend File Structure Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Move Repository Interfaces
Write-Host "[1/7] Moving repository interfaces..." -ForegroundColor Yellow

$repositoryFiles = @(
    "AnalyticsRepository.ts",
    "AssessmentAssignmentRepository.ts",
    "AssessmentRepository.ts",
    "OrganizationRepository.ts",
    "SchoolRepository.ts",
    "TeacherAssignmentRepository.ts",
    "UserRepository.ts",
    "WellnessRepository.ts"
)

foreach ($file in $repositoryFiles) {
    $source = "$srcPath\core\interfaces\$file"
    $newName = "I$file"
    $dest = "$srcPath\domain\repositories\$newName"
    
    if (Test-Path $source) {
        Write-Host "  Moving $file -> domain/repositories/$newName" -ForegroundColor Green
        Copy-Item $source $dest -Force
    }
}

# Step 2: Move Service Interfaces
Write-Host "[2/7] Moving service interfaces..." -ForegroundColor Yellow

$serviceFiles = @(
    "AuthService.ts",
    "NotificationService.ts",
    "TenantContextService.ts"
)

foreach ($file in $serviceFiles) {
    $source = "$srcPath\core\interfaces\$file"
    $newName = "I$file"
    $dest = "$srcPath\application\services\$newName"
    
    if (Test-Path $source) {
        Write-Host "  Moving $file -> application/services/$newName" -ForegroundColor Green
        Copy-Item $source $dest -Force
    }
}

# Step 3: Move Use Cases
Write-Host "[3/7] Moving use cases..." -ForegroundColor Yellow

# Create subdirectories
New-Item -ItemType Directory -Force -Path "$srcPath\application\use-cases\admin" | Out-Null
New-Item -ItemType Directory -Force -Path "$srcPath\application\use-cases\analytics" | Out-Null
New-Item -ItemType Directory -Force -Path "$srcPath\application\use-cases\assessment" | Out-Null
New-Item -ItemType Directory -Force -Path "$srcPath\application\use-cases\school" | Out-Null
New-Item -ItemType Directory -Force -Path "$srcPath\application\use-cases\users" | Out-Null
New-Item -ItemType Directory -Force -Path "$srcPath\application\use-cases\wellness" | Out-Null

# Copy use case directories
$useCaseDirs = @(
    @{Source="modules\admin\usecases"; Dest="application\use-cases\admin"},
    @{Source="modules\analytics\usecases"; Dest="application\use-cases\analytics"},
    @{Source="modules\assessment\usecases"; Dest="application\use-cases\assessment"},
    @{Source="modules\school\usecases"; Dest="application\use-cases\school"},
    @{Source="modules\users\usecases"; Dest="application\use-cases\users"},
    @{Source="modules\wellness\usecases"; Dest="application\use-cases\wellness"}
)

foreach ($dir in $useCaseDirs) {
    $source = "$srcPath\$($dir.Source)"
    $dest = "$srcPath\$($dir.Dest)"
    
    if (Test-Path $source) {
        Write-Host "  Copying $($dir.Source) -> $($dir.Dest)" -ForegroundColor Green
        Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force
    }
}

# Step 4: Move API Handlers to adapters/http
Write-Host "[4/7] Moving API handlers to adapters/http..." -ForegroundColor Yellow

if (Test-Path "$srcPath\interfaces\api") {
    Write-Host "  Copying interfaces/api -> adapters/http" -ForegroundColor Green
    Copy-Item -Path "$srcPath\interfaces\api\*" -Destination "$srcPath\adapters\http" -Recurse -Force
}

# Step 5: Move Triggers to adapters/events
Write-Host "[5/7] Moving triggers to adapters/events..." -ForegroundColor Yellow

if (Test-Path "$srcPath\interfaces\triggers") {
    Write-Host "  Copying interfaces/triggers -> adapters/events" -ForegroundColor Green
    Copy-Item -Path "$srcPath\interfaces\triggers\*" -Destination "$srcPath\adapters\events" -Recurse -Force
}

# Step 6: Move Business Logic
Write-Host "[6/7] Moving business logic..." -ForegroundColor Yellow

# Move flag derivers
if (Test-Path "$srcPath\domain\flagDerivers") {
    Write-Host "  Moving domain/flagDerivers -> business-logic/flags/derivers" -ForegroundColor Green
    Copy-Item -Path "$srcPath\domain\flagDerivers\*" -Destination "$srcPath\business-logic\flags\derivers" -Recurse -Force
}

# Move flag engine
if (Test-Path "$srcPath\domain\flagEngine.ts") {
    Write-Host "  Moving domain/flagEngine.ts -> business-logic/flags/engine.ts" -ForegroundColor Green
    Copy-Item "$srcPath\domain\flagEngine.ts" "$srcPath\business-logic\flags\engine.ts" -Force
}

# Move scheduler
if (Test-Path "$srcPath\domain\scheduler") {
    Write-Host "  Moving domain/scheduler -> business-logic/scheduler" -ForegroundColor Green
    Copy-Item -Path "$srcPath\domain\scheduler\*" -Destination "$srcPath\business-logic\scheduler" -Recurse -Force
}

# Step 7: Update imports in repository interfaces (add 'I' prefix)
Write-Host "[7/7] Updating repository interface names..." -ForegroundColor Yellow

foreach ($file in $repositoryFiles) {
    $newName = "I$file"
    $path = "$srcPath\domain\repositories\$newName"
    
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $interfaceName = $file -replace '\.ts$', ''
        $newInterfaceName = "I$interfaceName"
        
        # Update interface name
        $content = $content -replace "export interface $interfaceName\b", "export interface $newInterfaceName"
        
        Set-Content $path $content -NoNewline
        Write-Host "  Updated interface name: $interfaceName -> $newInterfaceName" -ForegroundColor Green
    }
}

# Update service interface names
foreach ($file in $serviceFiles) {
    $newName = "I$file"
    $path = "$srcPath\application\services\$newName"
    
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $interfaceName = $file -replace '\.ts$', ''
        $newInterfaceName = "I$interfaceName"
        
        # Update interface name
        $content = $content -replace "export interface $interfaceName\b", "export interface $newInterfaceName"
        
        Set-Content $path $content -NoNewline
        Write-Host "  Updated interface name: $interfaceName -> $newInterfaceName" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 1 Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files have been COPIED (not moved) to new locations." -ForegroundColor Yellow
Write-Host "Original files are still in place." -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run UPDATE_IMPORTS.ps1 to update all import statements" -ForegroundColor White
Write-Host "2. Test that everything compiles" -ForegroundColor White
Write-Host "3. Run CLEANUP.ps1 to remove old files" -ForegroundColor White
Write-Host ""
