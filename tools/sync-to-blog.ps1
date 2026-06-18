# ==========================================
# Obsidian Knowledge Base -> Hexo Blog Sync Script
# Only sync articles with published: true in front-matter
# ==========================================

$KnowledgeDir = "$PSScriptRoot\..\knowledge"
$PostsDir = "$PSScriptRoot\..\source\_posts"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Obsidian -> Hexo Blog Sync" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Get all markdown files (exclude templates and README)
$AllFiles = Get-ChildItem -Path $KnowledgeDir -Recurse -Filter "*.md" | 
    Where-Object { $_.FullName -notmatch "99-Templates" -and $_.Name -ne "README.md" }

$PublishedFiles = @()
$SkippedFiles = @()

foreach ($File in $AllFiles) {
    $Content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
    
    # Extract front-matter (between --- lines)
    $FrontMatterMatch = $Content -match "^---\s*\n(.*?)\n---"
    $IsPublished = $false
    
    if ($FrontMatterMatch) {
        $FrontMatter = $matches[1]
        # Check for published: true only in front-matter
        if ($FrontMatter -match "^published:\s*true\s*$") {
            $IsPublished = $true
        }
    }
    
    if ($IsPublished) {
        $PublishedFiles += $File
    } else {
        $SkippedFiles += $File
    }
}

Write-Host "Found files: $($AllFiles.Count)" -ForegroundColor Yellow
Write-Host "  - To publish: $($PublishedFiles.Count)" -ForegroundColor Green
Write-Host "  - Skipped (not published): $($SkippedFiles.Count)" -ForegroundColor Gray
Write-Host ""

# Sync published articles
$SyncedCount = 0
foreach ($File in $PublishedFiles) {
    $TargetFile = Join-Path $PostsDir $File.Name
    
    # Check if target exists and content is same
    if (Test-Path $TargetFile) {
        $TargetContent = Get-Content -Path $TargetFile -Raw -Encoding UTF8
        $SourceContent = Get-Content -Path $File.FullName -Raw -Encoding UTF8
        
        if ($TargetContent -eq $SourceContent) {
            Write-Host "  [Skip] $($File.Name) - same content" -ForegroundColor Gray
            continue
        }
    }
    
    Copy-Item -Path $File.FullName -Destination $TargetFile -Force
    Write-Host "  [Sync] $($File.Name)" -ForegroundColor Green
    $SyncedCount++
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Sync complete: $SyncedCount files updated" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: run 'npx hexo generate' to build blog" -ForegroundColor Yellow
