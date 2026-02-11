# Comprehensive Import Update Script
# Updates all imports in infrastructure, adapters, and use cases

$ErrorActionPreference = "Continue"
$srcPath = "functions\src"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating All Import Statements" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# === REPOSITORY IMPORTS ===
$repositoryMappings = @{
    'AnalyticsRepository' = 'IAnalyticsRepository'
    'AssessmentAssignmentRepository' = 'IAssessmentAssignmentRepository'
    'AssessmentRepository' = 'IAssessmentRepository'
    'OrganizationRepository' = 'IOrganizationRepository'
    'SchoolRepository' = 'ISchoolRepository'
    'TeacherAssignmentRepository' = 'ITeacherAssignmentRepository'
    'UserRepository' = 'IUserRepository'
    'WellnessRepository' = 'IWellnessRepository'
}

# === SERVICE IMPORTS ===
$serviceMappings = @{
    'AuthService' = 'IAuthService'
    'NotificationService' = 'INotificationService'
    'TenantContextService' = 'ITenantContextService'
}

# === USE CASE MAPPINGS ===
$useCaseMappings = @{
    'modules/admin/usecases' = 'application/use-cases/admin'
    'modules/analytics/usecases' = 'application/use-cases/analytics'
    'modules/assessment/usecases' = 'application/use-cases/assessment'
    'modules/school/usecases' = 'application/use-cases/school'
    'modules/users/usecases' = 'application/use-cases/users'
    'modules/wellness/usecases' = 'application/use-cases/wellness'
}

# === API/ADAPTER MAPPINGS ===
$adapterMappings = @{
    'interfaces/api' = 'adapters/http'
    'interfaces/triggers' = 'adapters/events'
}

# === BUSINESS LOGIC MAPPINGS ===
$businessLogicMappings = @{
    'domain/flagEngine' = 'business-logic/flags/engine'
    'domain/flagDerivers' = 'business-logic/flags/derivers'
    'domain/scheduler' = 'business-logic/scheduler'
}

function Update-FileContent {
    param (
        [string]$FilePath
    )
    
    if (!(Test-Path $FilePath) -or $FilePath -match '\\node_modules\\') {
        return $false
    }
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    if (!$content) { return $false }
    
    $originalContent = $content
    
    # Update repository imports
    foreach ($oldName in $repositoryMappings.Keys) {
        $newName = $repositoryMappings[$oldName]
        
        # Update import path from core/interfaces/XxxRepository
        $content = $content -replace "from (['\`"])(.*)core/interfaces/$oldName(['\`"])", "from `$1`$2domain/repositories/$newName`$3"
        
        # Update interface name usage (type annotations, implements, etc.)
        # Only replace when it's a standalone word
        $content = $content -replace "\b$oldName\b", $newName
    }
    
    # Update service imports
    foreach ($oldName in $serviceMappings.Keys) {
        $newName = $serviceMappings[$oldName]
        
        # Update import path
        $content = $content -replace "from (['\`"])(.*)core/interfaces/$oldName(['\`"])", "from `$1`$2application/services/$newName`$3"
        
        # Update interface name usage
        $content = $content -replace "\b$oldName\b", $newName
    }
    
    # Update use case imports
    foreach ($oldPath in $useCaseMappings.Keys) {
        $newPath = $useCaseMappings[$oldPath]
        $content = $content -replace [regex]::Escape($oldPath), $newPath
    }
    
    # Update adapter imports
    foreach ($oldPath in $adapterMappings.Keys) {
        $newPath = $adapterMappings[$oldPath]
        $content = $content -replace [regex]::Escape($oldPath), $newPath
    }
    
    # Update business logic imports
    foreach ($oldPath in $businessLogicMappings.Keys) {
        $newPath = $businessLogicMappings[$oldPath]
        $content = $content -replace [regex]::Escape($oldPath), $newPath
    }
    
    if ($content -ne $originalContent) {
        Set-Content $FilePath $content -NoNewline
        return $true
    }
    
    return $false
}

# Process all TypeScript files
Write-Host "Processing files in infrastructure..." -ForegroundColor Yellow
$infraFiles = Get-ChildItem -Path "$srcPath\infrastructure" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
$count = 0
foreach ($file in $infraFiles) {
    if (Update-FileContent $file.FullName) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}
Write-Host "Updated $count infrastructure files" -ForegroundColor Cyan
Write-Host ""

Write-Host "Processing files in adapters..." -ForegroundColor Yellow
$adapterFiles = Get-ChildItem -Path "$srcPath\adapters" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
$count = 0
foreach ($file in $adapterFiles) {
    if (Update-FileContent $file.FullName) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}
Write-Host "Updated $count adapter files" -ForegroundColor Cyan
Write-Host ""

Write-Host "Processing files in application..." -ForegroundColor Yellow
$appFiles = Get-ChildItem -Path "$srcPath\application" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
$count = 0
foreach ($file in $appFiles) {
    if (Update-FileContent $file.FullName) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}
Write-Host "Updated $count application files" -ForegroundColor Cyan
Write-Host ""

Write-Host "Processing files in business-logic..." -ForegroundColor Yellow
$bizFiles = Get-ChildItem -Path "$srcPath\business-logic" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
$count = 0
foreach ($file in $bizFiles) {
    if (Update-FileContent $file.FullName) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}
Write-Host "Updated $count business logic files" -ForegroundColor Cyan
Write-Host ""

Write-Host "Processing remaining files in interfaces (old location)..." -ForegroundColor Yellow
$oldInterfaceFiles = Get-ChildItem -Path "$srcPath\interfaces" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
$count = 0
foreach ($file in $oldInterfaceFiles) {
    if (Update-FileContent $file.FullName) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}
Write-Host "Updated $count files in old interfaces directory" -ForegroundColor Cyan
Write-Host ""

Write-Host "Processing remaining files in modules (old location)..." -ForegroundColor Yellow
$oldModuleFiles = Get-ChildItem -Path "$srcPath\modules" -Filter "*.ts" -Recurse -ErrorAction SilentlyContinue
$count = 0
foreach ($file in $oldModuleFiles) {
    if (Update-FileContent $file.FullName) {
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
        $count++
    }
}
Write-Host "Updated $count files in old modules directory" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Import Update Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step: Update index.ts to export from new locations" -ForegroundColor Yellow
Write-Host ""
