# My Skills

Personal agent skills built for my work stack.

## Structure

```
.
├── meta.ts                     # Register all skills (sources, vendors, manual)
├── scripts/
│   └── cli.ts                  # CLI tool for managing skills
├── instructions/               # Prompts for AI skill generation (optional)
│   └── {project}.md
├── sources/                    # Cloned OSS repos to generate skills from
│   └── {project}/
├── vendor/                     # Repos with existing skills to sync
│   └── {project}/
└── skills/                     # All skills (generated, synced, or hand-written)
    └── {skill-name}/
        ├── SKILL.md
        └── references/
            └── *.md
```

## CLI Commands

```bash
npm start              # Interactive menu
npm start init         # Clone submodules from meta.ts
npm start sync         # Pull updates + sync vendor skills
npm start check        # Check for available updates
npm start cleanup      # Remove skills not listed in meta.ts
```

## Adding a New Manual Skill

1. Create `skills/{skill-name}/SKILL.md`
2. Add references in `skills/{skill-name}/references/`
3. Register the name in `meta.ts` under `manual`

## Adding a Source Skill (generated from docs)

1. Add the repo to `submodules` in `meta.ts`
2. Run `npm start init` to clone it
3. Read the docs in `sources/{project}/` and write skills manually into `skills/{project}/`
4. Create `skills/{project}/GENERATION.md` with the current Git SHA

## Adding a Vendor Skill (synced from existing)

1. Add the repo to `vendors` in `meta.ts`
2. Run `npm start init` to clone it
3. Run `npm start sync` to copy skills from the vendor repo into `skills/`

## Adding an Instruction File

Create `instructions/{project}.md` to guide AI generation with project-specific rules.

## Skill Format

```yaml
# SKILL.md frontmatter
---
name: skill-name
description: Short description shown to AI agents
metadata:
  author: your-name
  version: "YYYY.MM.DD"
---
```
