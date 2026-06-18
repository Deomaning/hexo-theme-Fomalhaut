# ==========================================
# AI Knowledge Refinement Script
# Auto-analyze articles, extract tags, summary, key concepts
# Safe operation, only touches knowledge/ directory
# ==========================================

param(
    [string]$FilePath = "",
    [switch]$AutoMode = $false
)

$KnowledgeDir = "$PSScriptRoot\..\knowledge"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  AI Knowledge Refinement" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# If file specified, process only that file
if ($FilePath -ne "") {
    $Files = @(Get-Item -Path $FilePath)
} else {
    # Process all articles in 01-Inbox/
    $InboxDir = "$KnowledgeDir\01-Inbox"
    if (Test-Path $InboxDir) {
        $Files = Get-ChildItem -Path $InboxDir -Filter "*.md"
    } else {
        Write-Host "Inbox directory not found. Creating..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $InboxDir -Force | Out-Null
        $Files = @()
    }
}

if ($Files.Count -eq 0) {
    Write-Host "No files to process." -ForegroundColor Yellow
    Write-Host "Put new articles in knowledge/01-Inbox/" -ForegroundColor Gray
    exit
}

foreach ($File in $Files) {
    Write-Host "Processing: $($File.Name)" -ForegroundColor Yellow
    
    $Content = Get-Content -Path $File.FullName -Raw -Encoding UTF8
    
    # Extract existing front-matter
    $FrontMatterMatch = $Content -match "^---\s*\n(.*?)\n---"
    $ExistingFrontMatter = ""
    $BodyContent = $Content
    
    if ($FrontMatterMatch) {
        $ExistingFrontMatter = $matches[1]
        $BodyContent = $Content -replace "^---\s*\n.*?\n---\s*\n", ""
    }
    
    # Auto-extract info
    $Title = if ($ExistingFrontMatter -match "title:\s*(.+)") { $matches[1].Trim() } else { $File.BaseName }
    
    # Extract tags from content
    $AutoTags = @()
    
    # Tech keyword detection
    $TechKeywords = @{
        "AI" = @("AI", "GPT", "LLM", "machine learning", "deep learning", "neural network")
        "Coding" = @("code", "programming", "Java", "Python", "JavaScript", "Spring", "Docker", "debug")
        "Tools" = @("tool", "software", "plugin", "IDE", "Git", "Hexo", "Obsidian")
        "Methodology" = @("method", "process", "best practice", "pattern", "architecture")
        "Troubleshooting" = @("error", "fix", "solve", "debug", "issue", "problem")
    }
    
    foreach ($Category in $TechKeywords.Keys) {
        foreach ($Keyword in $TechKeywords[$Category]) {
            if ($BodyContent -match $Keyword) {
                $AutoTags += $Category
                break
            }
        }
    }
    
    # Deduplicate and limit
    $AutoTags = $AutoTags | Select-Object -Unique | Select-Object -First 5
    
    # Generate summary (first 200 chars)
    $PlainText = $BodyContent -replace "#+\s*", "" -replace "\[([^\]]+)\]\([^\)]+\)", '$1' -replace "\*\*|__", ""
    $Summary = $PlainText.Substring(0, [Math]::Min(200, $PlainText.Length)).Trim()
    if ($Summary.Length -eq 200) { $Summary += "..." }
    
    # Extract key concepts from headers
    $KeyConcepts = @()
    $Headers = [regex]::Matches($BodyContent, "^#{2,3}\s+(.+)$", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    foreach ($Header in $Headers | Select-Object -First 5) {
        $KeyConcepts += $Header.Groups[1].Value.Trim()
    }
    
    # Build new front-matter
    $NewFrontMatter = @"
---
title: $Title
date: $(Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
tags: [$($AutoTags -join ', ')]
categories: [knowledge]
published: false
summary: $Summary
concepts: [$($KeyConcepts -join ', ')]
source: knowledge
---
"@
    
    # Generate refinement report
    Write-Host "  Auto-extracted:" -ForegroundColor Green
    Write-Host "    Tags: $($AutoTags -join ', ')" -ForegroundColor Gray
    Write-Host "    Concepts: $($KeyConcepts -join ', ')" -ForegroundColor Gray
    Write-Host "    Summary: $Summary" -ForegroundColor Gray
    Write-Host ""
    
    # Auto mode: save directly
    if ($AutoMode) {
        $NewContent = "$NewFrontMatter`n`n$BodyContent"
        Set-Content -Path $File.FullName -Value $NewContent -Encoding UTF8
        Write-Host "  [Auto-saved] $($File.Name)" -ForegroundColor Green
        
        # Move to appropriate directory
        $TargetDir = "$KnowledgeDir\03-Areas"
        if (-not (Test-Path $TargetDir)) {
            New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
        }
        $TargetFile = "$TargetDir\$($File.Name)"
        Move-Item -Path $File.FullName -Destination $TargetFile -Force
        Write-Host "  [Moved] to 03-Areas/" -ForegroundColor Green
    } else {
        # Interactive mode: show preview
        Write-Host "  Preview new front-matter:" -ForegroundColor Cyan
        Write-Host $NewFrontMatter -ForegroundColor Gray
        Write-Host ""
        
        $Response = Read-Host "  Apply changes? (y/n)"
        if ($Response -eq "y") {
            $NewContent = "$NewFrontMatter`n`n$BodyContent"
            Set-Content -Path $File.FullName -Value $NewContent -Encoding UTF8
            Write-Host "  [Saved] $($File.Name)" -ForegroundColor Green
        }
    }
    
    Write-Host ""
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Refinement complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
