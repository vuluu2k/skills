# My Job Skills

Personal agent skills built for my work stack.

## Structure

```
.
└── skills/                     # All skills go here
    └── {skill-name}/
        ├── SKILL.md            # Main index + quick reference
        └── references/
            └── *.md            # Detailed reference files per topic
```

## Adding a New Skill

1. Create a folder: `skills/{skill-name}/`
2. Add `SKILL.md` with frontmatter and topic table
3. Add reference files in `references/`

## Skill Format

### `SKILL.md` frontmatter

```yaml
---
name: skill-name
description: One-line description shown to the AI agent
metadata:
  author: your-name
  version: "YYYY.MM.DD"
---
```

### `references/*.md` frontmatter

```yaml
---
name: topic-name
description: Short description of this reference
---
```
