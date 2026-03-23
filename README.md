# My Skills

A personal collection of [Agent Skills](https://agentskills.io/home) for my work stack, focused on Vue Options API patterns.

**GitHub:** https://github.com/vuluu2k/skills

## Installation

Install all skills at once using official agentskills:

```bash
npx skills add vuluu2k/skills --skill='*'
```

### ⚡ Recommended: Install specific Collection directly

We built a custom CLI wrapper to allow installing predefined batches of skills directly to your project:

```bash
npx @vuluu2k/vskills install
```

This will run an interactive wizard to let you select a repository collection (like `builderx_spa`) and it will automatically dump all required skills directly into your current working directory.

Learn more about the CLI at [agentskills.io](https://agentskills.io/home).

## Available Collections

When using `npx @vuluu2k/vskills install`, you can select from the following curated collections:

| Collection | Included Skills |
|------------|-----------------|
| **`builderx_spa`** | `vue-options`, `pinia-options`, `builderx_spa-api`, `builderx_spa-permission`, `vue-antdv-tailwind` |
| **`vue3-standard`** | `vue`, `pinia`, `vue-best-practices`, `vue-router-best-practices`, `vue-testing-best-practices` |

## Available Skills

Some of the primary hand-crafted skills included are:

- **`vue`**: Modern Vue 3 Composition API style with script setup
- **`pinia`**: Pinia state management using Composition API
- **`vue-options`**: Best practices for Vue Options API style
- **`pinia-options`**: Clean patterns for Pinia options without Composition API
- **`builderx_spa-api`**: Deep API fetching rules + class-based endpoints pattern overriding standard HTTP
- **`builderx_spa-permission`**: Role-based access rules utilizing bitwise permissions
- **`vue-antdv-tailwind`**: Guide to cleanly mixing Ant Design Vue components with Tailwind CSS

## Generate Your Own Skills

Fork or clone this repository to create your own skill collection.

1. Clone the repo:
   ```bash
   git clone https://github.com/vuluu2k/skills
   cd skills
   npm install
   ```

2. Update `meta.ts` with your own projects and sources.

3. Add new submodules:
   ```bash
   npm start init
   ```

4. Sync vendor skills:
   ```bash
   npm start sync
   ```

5. Ask your AI agent to generate skills:
   > "Generate skills for `<project>` based on the docs in `sources/<project>/`"

See [SKILL_GUIDE.md](SKILL_GUIDE.md) for detailed guidelines on writing skills.

## Management CLI

```bash
npm start              # Interactive menu
npm start install      # Install skill collections to a target project
npm start init         # Clone submodules from meta.ts
npm start sync         # Pull updates + sync vendor skills
npm start check        # Check for available updates
npm start cleanup      # Remove skills not listed in meta.ts
```

## Structure

```
.
├── meta.ts                     # Register all skills (sources, vendors, manual)
├── SKILL_GUIDE.md              # Full guide for creating skills
├── scripts/
│   └── cli.ts                  # CLI tool for managing skills
├── instructions/               # AI generation rules per skill
│   ├── vue-options.md
│   └── pinia-options.md
├── sources/                    # Cloned OSS repos to generate skills from
├── vendor/                     # Repos with existing skills to sync
└── skills/
    ├── vue-options/
    └── pinia-options/
```

## License

MIT
