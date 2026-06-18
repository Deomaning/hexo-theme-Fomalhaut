# Knowledge Base - Anhao

> Personal knowledge management system based on PARA method
> Integrated with Hexo blog workflow

## Directory Structure (PARA)

```
knowledge/
├── 01-Inbox/          # Inbox - unprocessed notes
├── 02-Projects/       # Projects - active projects
├── 03-Areas/          # Areas - ongoing responsibilities
├── 04-Resources/      # Resources - reference materials
├── 05-Reviews/        # Reviews - periodic reviews
├── 99-Templates/      # Templates - note templates
├── index.md           # Auto-generated index
└── README.md          # This file
```

## Workflow

### 1. Create Note

Put new notes in `01-Inbox/`:

```markdown
---
title: Your Note Title
date: 2026-06-18
tags: [tag1, tag2]
categories: [knowledge]
published: false
summary: Brief description
---

# Your Note Title

Content here...
```

### 2. AI Refinement (Auto)

Run the refinement script to auto-extract tags, summary, and concepts:

```powershell
# Process all files in 01-Inbox/
.\tools\ai-refine.ps1 -AutoMode

# Or process specific file
.\tools\ai-refine.ps1 -FilePath "knowledge\01-Inbox\your-note.md" -AutoMode
```

This will:
- Auto-detect tags from content
- Generate summary
- Extract key concepts from headers
- Move to `03-Areas/` (default)

### 3. Publish to Blog

When ready to publish, change `published: false` to `published: true`:

```markdown
---
published: true
---
```

Then sync:

```powershell
# Dry run first (safe)
.\tools\sync-knowledge.ps1 -DryRun

# Actually sync
.\tools\sync-knowledge.ps1
```

This will:
- Copy `published: true` articles to `source/_posts/`
- Archive blog articles to `04-Resources/`
- Generate index.md

### 4. Build & Deploy

```powershell
hexo clean
hexo generate
hexo deploy
```

## Scripts

| Script | Purpose | Safe? |
|--------|---------|-------|
| `ai-refine.ps1` | Auto-extract metadata | Yes, only touches knowledge/ |
| `sync-knowledge.ps1` | Bidirectional sync | Yes, dry-run by default |

## Front-matter Fields

| Field | Description | Auto-generated? |
|-------|-------------|-----------------|
| title | Article title | Manual |
| date | Creation date | Auto |
| tags | Tags for categorization | Auto |
| categories | Category | Manual |
| published | Publish to blog? | Manual |
| summary | Brief description | Auto |
| concepts | Key concepts | Auto |
| source | Source identifier | Auto |

## Integration with Blog

- Blog articles are auto-archived to `04-Resources/`
- Knowledge articles with `published: true` sync to blog
- Tags are shared between systems
- Index is auto-generated for overview

## Tips

1. **Start with Inbox**: Dump everything in `01-Inbox/` first
2. **Refine regularly**: Run `ai-refine.ps1` weekly
3. **Publish selectively**: Only set `published: true` for polished articles
4. **Review monthly**: Check `05-Reviews/` for periodic reflection
