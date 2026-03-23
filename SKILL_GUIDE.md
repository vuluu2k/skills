# SKILL_GUIDE.md

Complete guide for creating and managing agent skills in this repository.

---

## What is a Skill?

A **skill** is a set of Markdown files that teach an AI agent how to work with a specific technology or workflow. The agent reads these files before writing code to ensure it follows the correct conventions.

---

## Skill Types

| Type | Location | How it's maintained |
|------|----------|---------------------|
| **Manual** | `skills/{name}/` | Written by hand |
| **Generated** | `skills/{name}/` | AI-generated from `sources/{name}/docs/` |
| **Synced** | `skills/{name}/` | Copied automatically from `vendor/{name}/skills/` |

All three types result in the same file structure under `skills/`.

---

## File Structure

```
skills/{skill-name}/
├── SKILL.md                  ← Required: main index file
├── GENERATION.md             ← For generated skills: tracks source Git SHA
├── SYNC.md                   ← For synced skills: tracks vendor Git SHA
└── references/
    ├── core-*.md             ← Core concepts (always read)
    ├── features-*.md         ← Optional features
    ├── advanced-*.md         ← Advanced topics
    └── best-practices-*.md   ← Patterns and pitfalls
```

---

## SKILL.md Format

```markdown
---
name: skill-name
description: One-line description — this is what the AI reads to decide whether to load the skill.
metadata:
  author: your-name
  version: "YYYY.MM.DD"
  source: Hand-written / Generated from <url>
---

# Skill Title

> One-line summary and context (e.g. what version this covers, key constraints).

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Topic Name | Short description | [ref-name](references/ref-name.md) |

## Features (optional)

| Topic | Description | Reference |
|-------|-------------|-----------|
| Feature Name | Short description | [ref-name](references/ref-name.md) |

## Quick Reference

A compact, self-contained code example that shows the most common usage.
This should be readable without opening any reference file.
```

---

## Reference File Format

```markdown
---
name: reference-name
description: Short description of what this reference covers.
---

# Topic Name

Brief intro — when and why to use this.

## Section A

Explanation + code example.

## Section B

Explanation + code example.

<!--
Source references:
- https://official-docs-url.com/topic
-->
```

---

## Reference File Naming

Prefix files with a category to indicate priority:

| Prefix | Meaning |
|--------|---------|
| `core-` | Must-read fundamentals |
| `features-` | Optional features, load when needed |
| `advanced-` | Complex or rarely-used topics |
| `best-practices-` | Patterns, pitfalls, conventions |

Examples: `core-state.md`, `features-transitions.md`, `best-practices-testing.md`

---

## Adding a Manual Skill (Type 1 — Hand-written)

1. Create the skill directory:
   ```bash
   mkdir -p skills/{skill-name}/references
   ```

2. Create `skills/{skill-name}/SKILL.md` — see the format above.

3. Create reference files in `skills/{skill-name}/references/`.

4. Register the skill name in `meta.ts` under `manual`:
   ```ts
   export const manual = [
     'vue-options',
     'pinia-options',
     '{skill-name}', // ← add here
   ]
   ```

---

## Adding a Generated Skill (Type 2 — From OSS Docs)

1. Add the repo to `submodules` in `meta.ts`:
   ```ts
   export const submodules = {
     'skill-name': 'https://github.com/org/repo',
   }
   ```

2. Clone the submodule:
   ```bash
   npm start init
   ```

3. Add a generation instruction file (optional but recommended):
   ```
   instructions/{skill-name}.md
   ```
   Use this to define conventions (e.g. prefer TypeScript, avoid certain patterns).

4. Read the docs from `sources/{skill-name}/` and write the skill files manually into `skills/{skill-name}/`.

5. Create `skills/{skill-name}/GENERATION.md`:
   ```markdown
   # Generation Info

   - **Source:** `sources/{skill-name}`
   - **Git SHA:** `<run: cd sources/{skill-name} && git rev-parse HEAD>`
   - **Generated:** YYYY-MM-DD
   ```

### Updating a Generated Skill

1. Check what changed since the last generation:
   ```bash
   cd sources/{skill-name}
   git diff {old-sha}..HEAD -- docs/
   ```

2. Update affected reference files.

3. Update `GENERATION.md` with the new Git SHA.

---

## Adding a Synced Skill (Type 3 — Vendor)

1. Add the vendor to `meta.ts`:
   ```ts
   export const vendors = {
     'vendor-name': {
       source: 'https://github.com/org/repo',
       skills: {
         'source-skill-name': 'output-skill-name',
       }
     }
   }
   ```

2. Clone the vendor submodule:
   ```bash
   npm start init
   ```

3. Sync the skill:
   ```bash
   npm start sync
   ```
   This copies files from `vendor/{name}/skills/{skill}/` to `skills/{output-name}/` and creates `SYNC.md`.

> ⚠️ Do **not** edit synced skill files manually. Changes must go to the upstream vendor repo.

---

## Adding an Instruction File

Create `instructions/{skill-name}.md` to define conventions for AI-generated or AI-updated skills.

```markdown
- Prefer TypeScript over JavaScript.
- Always use X pattern, never Y pattern.
- The target audience is Options API users, do not mention Composition API.
```

This file is read alongside the source docs when asking an AI to generate or update the skill.

---

## CLI Commands

```bash
npm start              # Interactive menu
npm start init         # Clone submodules registered in meta.ts
npm start sync         # Pull updates + sync all vendor skills
npm start check        # Check if submodules have upstream updates
npm start cleanup      # Remove skills/submodules not listed in meta.ts
```

---

## Writing Guidelines

1. **Write for agents, not humans** — avoid long prose, prefer concise bullet points and code examples.
2. **One concept per file** — split large topics into multiple reference files.
3. **Always include code** — every section should have a working example.
4. **Explain trade-offs** — not just *how*, but *when* and *why*.
5. **Be consistent** — use TypeScript unless the skill explicitly targets JavaScript.
6. **Avoid duplication** — if two references overlap heavily, merge or cross-link them.
