# ==========================================
# Knowledge Base Sync Script
# Safe operation, does not affect blog
# Features:
#   1. knowledge -> blog (published: true)
#   2. blog -> knowledge (auto archive)
#   3. generate knowledge index
# ==========================================

param(
    [switch]$DryRun = $false,
    [switch]$GenerateIndex = $false
)

$KnowledgeDir = "$PSScriptRoot\..\knowledge"
$PostsDir = "$PSScriptRoot\..\source\_posts"
$IndexFile = "$KnowledgeDir\index.md"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Knowledge Base Sync" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Ensure directories exist
@("01-Inbox", "02-Projects", "03-Areas", "04-Resources", "05-Reviews", "99-Templates") | ForEach-Object {
    $Dir = "$KnowledgeDir\$_"
    if (-not (Test-Path $Dir)) {
        New-Item -ItemType Directory -Path $Dir -Force | Out-Null
        Write-Host "Created: $Dir" -ForegroundColor Gray
    }
}

# ==========================================
# Phase 1: Knowledge -> Blog
# ==========================================
Write-Host "[Phase 1] Knowledge -> Blog" -ForegroundColor Yellow
Write-Host ""

$KnowledgeFiles = Get-ChildItem -Path $KnowledgeDir -Recurse -Filter "*.md" | 
    Where-Object { $_.FullName -notmatch "99-Templates" -and $_.Name -ne "README.md" -and $_.Name -ne "index.md" }

$ToPublish = @()
$PublishedCount = 0

foreach ($File in $KnowledgeFiles) {
    $Content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
    
    # Remove BOM if present
    if ($Content.StartsWith("`u{FEFF}")) {
        $Content = $Content.Substring(1)
    }
    
    # Check published: true (more flexible matching)
    if ($Content -match "published:\s*true") {
        $ToPublish += $File
    }
}

Write-Host "Found $($ToPublish.Count) articles to publish" -ForegroundColor Green
Write-Host ""

foreach ($File in $ToPublish) {
    $TargetFile = Join-Path $PostsDir $File.Name
    $SourceContent = Get-Content -Path $File.FullName -Raw -Encoding UTF8
    
    # Check if update needed
    $NeedSync = $true
    if (Test-Path $TargetFile) {
        $TargetContent = Get-Content -Path $TargetFile -Raw -Encoding UTF8
        if ($TargetContent -eq $SourceContent) {
            $NeedSync = $false
        }
    }
    
    if ($NeedSync) {
        if (-not $DryRun) {
            Copy-Item -Path $File.FullName -Destination $TargetFile -Force
            Write-Host "  [Sync] $($File.Name)" -ForegroundColor Green
            $PublishedCount++
        } else {
            Write-Host "  [DryRun] Would sync: $($File.Name)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  [Skip] $($File.Name) - up to date" -ForegroundColor Gray
    }
}

Write-Host ""

# ==========================================
# Phase 2: Blog -> Knowledge (Archive)
# ==========================================
Write-Host "[Phase 2] Blog -> Knowledge (Archive)" -ForegroundColor Yellow
Write-Host ""

$BlogFiles = Get-ChildItem -Path $PostsDir -Filter "*.md"
$ArchivedCount = 0

foreach ($File in $BlogFiles) {
    $KnowledgePath = "$KnowledgeDir\04-Resources\$($File.Name)"
    
    # Archive if not exists in knowledge
    if (-not (Test-Path $KnowledgePath)) {
        if (-not $DryRun) {
            Copy-Item -Path $File.FullName -Destination $KnowledgePath -Force
            Write-Host "  [Archive] $($File.Name) -> 04-Resources/" -ForegroundColor Green
            $ArchivedCount++
        } else {
            Write-Host "  [DryRun] Would archive: $($File.Name)" -ForegroundColor Gray
        }
    }
}

Write-Host ""

# ==========================================
# Phase 3: Generate Index
# ==========================================
if ($GenerateIndex -or -not $DryRun) {
    Write-Host "[Phase 3] Generate Knowledge Index" -ForegroundColor Yellow
    Write-Host ""
    
    $IndexContent = @"
# Knowledge Base Index

> Auto-generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
> Total: $($KnowledgeFiles.Count) notes

## Directory Structure

```
knowledge/
├── 01-Inbox/      ($((Get-ChildItem "$KnowledgeDir\01-Inbox" -Filter "*.md" -ErrorAction SilentlyContinue).Count))
├── 02-Projects/   ($((Get-ChildItem "$KnowledgeDir\02-Projects" -Filter "*.md" -ErrorAction SilentlyContinue).Count))
├── 03-Areas/      ($((Get-ChildItem "$KnowledgeDir\03-Areas" -Filter "*.md" -ErrorAction SilentlyContinue).Count))
├── 04-Resources/  ($((Get-ChildItem "$KnowledgeDir\04-Resources" -Filter "*.md" -ErrorAction SilentlyContinue).Count))
├── 05-Reviews/    ($((Get-ChildItem "$KnowledgeDir\05-Reviews" -Filter "*.md" -ErrorAction SilentlyContinue).Count))
└── 99-Templates/  (templates)
```

## Published Articles

"@
    
    # List published articles
    foreach ($File in $ToPublish | Sort-Object Name) {
        $Content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
        $Title = if ($Content -match "title:\s*(.+)") { $matches[1].Trim() } else { $File.BaseName }
        $Tags = if ($Content -match "tags:\s*\[(.*?)\]") { $matches[1].Trim() } else { "" }
        $Summary = if ($Content -match "summary:\s*(.+)") { $matches[1].Trim() } else { "" }
        
        $IndexContent += "- **$Title** [$Tags] - $Summary`n"
    }
    
    $IndexContent += @"

## Tag Statistics

"@
    
    # Count tags
    $TagStats = @{}
    foreach ($File in $KnowledgeFiles) {
        $Content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
        if ($Content -match "tags:\s*\[(.*?)\]") {
            $Tags = $matches[1] -split "," | ForEach-Object { $_.Trim() }
            foreach ($Tag in $Tags) {
                if ($TagStats.ContainsKey($Tag)) {
                    $TagStats[$Tag]++
                } else {
                    $TagStats[$Tag] = 1
                }
            }
        }
    }
    
    foreach ($Tag in $TagStats.Keys | Sort-Object) {
        $IndexContent += "- $Tag : $($TagStats[$Tag]) notes`n"
    }
    
    $IndexContent += @"

## Recent Updates

"@
    
    # Recent files
    $RecentFiles = $KnowledgeFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 10
    foreach ($File in $RecentFiles) {
        $Content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
        $Title = if ($Content -match "title:\s*(.+)") { $matches[1].Trim() } else { $File.BaseName }
        $Date = $File.LastWriteTime.ToString("yyyy-MM-dd")
        $IndexContent += "- [$Date] $Title`n"
    }
    
    if (-not $DryRun) {
        Set-Content -Path $IndexFile -Value $IndexContent -Encoding UTF8
        Write-Host "  [Generated] index.md" -ForegroundColor Green
    } else {
        Write-Host "  [DryRun] Would generate index" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Sync Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Published to blog: $PublishedCount" -ForegroundColor Green
Write-Host "  Archived from blog: $ArchivedCount" -ForegroundColor Green
Write-Host "  Total knowledge files: $($KnowledgeFiles.Count)" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "This was a DRY RUN. No files were modified." -ForegroundColor Yellow
    Write-Host "Run without -DryRun to apply changes." -ForegroundColor Yellow
}
