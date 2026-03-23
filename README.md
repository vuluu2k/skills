<div align="center">
  <h1>🚀 vskills: Supercharge Your AI Agents</h1>
  <p><strong>Curated Coding Expertise for Cursor, GitHub Copilot, & AgentSkills</strong></p>
  <p>
    <a href="README.vn.md">🇻🇳 Read in Vietnamese (Đọc Tiếng Việt)</a> •
    <a href="https://agentskills.io/home" target="_blank">About AgentSkills</a>
  </p>
</div>

## 🤔 The Problem

Are you tired of constantly reminding your AI assistant about your team's specific coding standards? Tired of generic Vue components when you need strict Ant Design + Tailwind integrations, or boilerplate REST endpoints when your team uses class-based APIs and Action Fallbacks?

## 💡 The Solution

**`vskills`** is a curated collection of highly specific, context-rich "Agent Skills" designed to align your AI with your exact development stack. Stop prompting, start building.

By feeding your AI specialized `SKILL.md` documents, you **eliminate AI hallucinations** and strictly enforce your project's architecture.

## ✨ Why You Need This

- 🧠 **Instant Project Onboarding:** One command dumps all necessary context right into your `.agents/skills` folder.
- 🎯 **Pinpoint Accuracy:** From niche Vue Options API patterns to Elixir Phoenix Ecto.Multi rules, get the code exactly how you want it.
- ⚡ **Zero-Friction Setup:** Interactive, beautifully designed CLI makes managing skills effortless.

---

## 📦 Installation & Quick Start

Forget manual copying. We've built an elegant, interactive CLI to inject expertise directly into your repository.

```bash
npx @vuluu2k/vskills install
```

> **Pro Tip:** Alternatively, install every skill globally using the official runner:  
> `npx skills add vuluu2k/skills --skill='*'`

---

## 📚 Curated Collections

Pick the exact brain-upgrade your AI needs.

| Collection | Focus Area | Included Skills |
|------------|------------|-----------------|
| 🏗️ **`builderx_spa`** | Specialized BuilderX Frontend | `vue-options`, `pinia-options`, `builderx_spa-api`, `builderx_spa-permission`, `vue-antdv-tailwind` |
| ⚙️ **`builderx_api`** | Phoenix Elixir Backend | `builderx_api-schemas`, `builderx_api-controllers`, `builderx_api-contexts` |
| 🌟 **`vue3-standard`** | Pure Vue 3 Mastery | `vue`, `pinia`, `vue-best-practices`, `vue-router-best-practices`, `vue-testing-best-practices` |

## 🛠️ Deep-Dive: Available Skills

Some of the primary hand-crafted skills included in our collections:

### Frontend & Vue Ecosystem
- **`vue` / `vue-best-practices`**: Modern Vue 3 Composition API style with script setup, animation techniques, and advanced rendering.
- **`pinia`**: State management using Composition API.
- **`vue-options` / `pinia-options`**: The definitive best practices for organizations still leveraging the powerful Vue Options API style.
- **`vue-router-best-practices`**: Avoid navigation infinite loops and lifecycle gotchas.
- **`vue-testing-best-practices`**: Blackbox testing, Vitest setups, and E2E Playwright.

### Advanced Architectural Patterns
- **`builderx_spa-api`**: Deep API fetching rules + class-based endpoints pattern overriding standard HTTP.
- **`builderx_spa-permission`**: Role-based access rules utilizing bitwise permissions.
- **`vue-antdv-tailwind`**: The definitive guide to cleanly mixing Ant Design Vue components with Tailwind CSS utility classes.

### Backend Mastery (Elixir / Phoenix)
- **`builderx_api-schemas`**: Core Ecto schema conventions including custom json serializers.
- **`builderx_api-controllers`**: Action fallback and standard tuple responses for Phoenix controllers.
- **`builderx_api-contexts`**: Ecto.Multi and Outbox pattern usage for complex multi-step transactions.

---

## ⚙️ Generate & Manage Your Own Skills

Want to build your own AI knowledge base? Fork or clone this repository to start creating your team's custom skill collection.

1. **Clone the repo:**
   ```bash
   git clone https://github.com/vuluu2k/skills
   cd skills
   npm install
   ```

2. **Update `meta.ts`** with your own projects and sources.

3. **Use the powerful CLI** to manage everything:
   ```bash
   npm start              # Open the interactive menu
   npm start install      # Install skill collections to a target project
   npm start init         # Clone tracked submodules from meta.ts
   npm start sync         # Pull updates + sync vendor skills
   npm start check        # Check for available remote updates
   npm start cleanup      # Remove stale skills not listed in meta.ts
   ```

4. **Ask your AI agent to generate skills:**
   > "Generate skills for `<project>` based on the docs in `sources/<project>/`"

See [SKILL_GUIDE.md](SKILL_GUIDE.md) for detailed guidelines on writing the perfect AI skills.

---
<div align="center">
  <p>Built with ❤️ by vuluu2k. License: MIT</p>
</div>
