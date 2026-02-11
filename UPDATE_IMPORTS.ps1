# Update Import Statements Script
# This script updates all import statements to reflect the new file structure

$ErrorActionPreference = "Stop"
$srcPath = "functions\src"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating Import Statements" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define all import mappings
$importMappings = @(
    # Repository interfaces
    @{
        Old = "from ['\`"].*core/interfaces/AnalyticsRepository['\`"]"
        New = "from '../../../domain/repositories/IAnalyticsRepository'"
        InterfaceName = "AnalyticsRepository"
        NewInterfaceName = "IAnalyticsRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/AssessmentAssignmentRepository['\`"]"
        New = "from '../../../domain/repositories/IAssessmentAssignmentRepository'"
        InterfaceName = "AssessmentAssignmentRepository"
        NewInterfaceName = "IAssessmentAssignmentRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/AssessmentRepository['\`"]"
        New = "from '../../../domain/repositories/IAssessmentRepository'"
        InterfaceName = "AssessmentRepository"
        NewInterfaceName = "IAssessmentRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/OrganizationRepository['\`"]"
        New = "from '../../../domain/repositories/IOrganizationRepository'"
        InterfaceName = "OrganizationRepository"
        NewInterfaceName = "IOrganizationRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/SchoolRepository['\`"]"
        New = "from '../../../domain/repositories/ISchoolRepository'"
        InterfaceName = "SchoolRepository"
        NewInterfaceName = "ISchoolRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/TeacherAssignmentRepository['\`"]"
        New = "from '../../../domain/repositories/ITeacherAssignmentRepository'"
        InterfaceName = "TeacherAssignmentRepository"
        NewInterfaceName = "ITeacherAssignmentRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/UserRepository['\`"]"
        New = "from '../../../domain/repositories/IUserRepository'"
        InterfaceName = "UserRepository"
        NewInterfaceName = "IUserRepository"
    },
    @{
        Old = "from ['\`"].*core/interfaces/WellnessRepository['\`"]"
        New = "from '../../../domain/repositories/IWellnessRepository'"
        InterfaceName = "WellnessRepository"
        NewInterfaceName = "IWellnessRepository"
    },
    
    # Service interfaces
    @{
        Old = "from ['\`"].*core/interfaces/AuthService['\`"]"
        New = "from '../../../application/services/IAuthService'"
        InterfaceName = "AuthService"
        NewInterfaceName = "IAuthService"
    },
    @{
        Old = "from ['\`"].*core/interfaces/NotificationService['\`"]"
        New = "from '../../../application/services/INotificationService'"
        InterfaceName = "NotificationService"
        NewInterfaceName = "INotificationService"
    },
    @{
        Old = "from ['\`"].*core/interfaces/TenantContextService['\`"]"
        New = "from '../../../application/services/ITenantContextService'"
        InterfaceName = "TenantContextService"
        NewInterfaceName = "ITenantContextService"
    }
)

# Function to update imports in a file
function Update-FileImports {
    param (
        [string]$FilePath
    )
    
    if (!(Test-Path $FilePath)) {
        return
    }
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    $updated = $false
    
    foreach ($mapping in $importMappings) {
        # Update import path
        if ($content -match $mapping.Old) {
            # Calculate relative path based on file location
            $relativePath = Get-RelativePath $FilePath $mapping.New
            
            # Update the import statement
            $content = $content -replace $mapping.Old, "from '$relativePath'"
            $updated = $true
        }
        
        # Update interface name usage (only if not already prefixed with I)
        if ($mapping.InterfaceName) {
            # Match interface name that's not already prefixed with I
            $pattern = "\b$($mapping.InterfaceName)\b"
            if ($content -match $pattern -and $content -notmatch "I$($mapping.InterfaceName)") {
                $content = $content -replace $pattern, $mapping.NewInterfaceName
                $updated = $true
            }
        }
    }
    
    if ($updated -and $content -ne $originalContent) {
        Set-Content $FilePath $content -NoNewline
        Write-Host "  ✓ Updated: $FilePath" -ForegroundColor Green
        return $true
    }
    
    return $false
}

# Function to calculate relative path
function Get-RelativePath {
    param (
        [string]$From,
        [string]$To
    )
    
    # This is a simplified version - you may need to adjust based on file depth
    # For now, using a standard pattern
    return $To
}

# Get all TypeScript files
Write-Host "Scanning TypeScript files..." -ForegroundColor Yellow
$files = Get-ChildItem -Path $srcPath -Filter "*.ts" -Recurse | Where-Object { $_.Name -ne "index.ts" }

Write-Host "Found $($files.Count) files to process" -ForegroundColor Cyan
Write-Host ""

$updatedCount = 0
foreach ($file in $files) {
    if (Update-FileImports $file.FullName) {
        $updatedCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Import Update Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updated $updatedCount files" -ForegroundColor White
Write-Host ""
Write-Host "Note: Some paths may need manual adjustment" -ForegroundColor Yellow
Write-Host "Please verify compilation before proceeding to cleanup." -ForegroundColor Yellow
Write-Host ""
