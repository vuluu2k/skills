# My Skills

A personal collection of [Agent Skills](https://agentskills.io/home) for my work stack, focused on Vue Options API patterns.

**GitHub:** https://github.com/vuluu2k/skills

## Installation

Install all skills at once:

```bash
npx skills add vuluu2k/skills --skill='*'
```

Or install globally:

```bash
npx skills add vuluu2k/skills --skill='*' -g
```

Or install a specific skill only:

```bash
# Vue Options API skill only
npx skills add vuluu2k/skills --skill='vue-options'

# Pinia Options API skill only
npx skills add vuluu2k/skills --skill='pinia-options'
```

Learn more about the CLI at [agentskills.io](https://agentskills.io/home).

## Skills

### Hand-written Skills

Manually written and maintained for my team's specific conventions and patterns.

| Skill | Description |
|-------|-------------|
| [vue-options](skills/vue-options) | Vue 3 Options API — data, props, computed, methods, watch, lifecycle hooks, provide/inject, mixins |
| [pinia-options](skills/pinia-options) | Pinia Option Stores — state, getters, actions, $patch, $reset, mapState/mapWritableState/mapActions |

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
