---
name: vue-options
description: Vue 3 Options API — data, props, computed, methods, watch, emits, provide/inject, lifecycle hooks, and mixins. Use when the project uses Options API style (Vue 2 legacy or explicit Vue 3 Options API preference).
metadata:
  author: my_job
  version: "2026.3.23"
  source: Hand-written based on https://vuejs.org/api/options-state.html
---

# Vue Options API

> Use this skill for Vue projects written in **Options API** style.
> For new Vue 3 projects, prefer the `vue` skill (Composition API with `<script setup>`).

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| State: data, computed, methods, watch | Reactive state, derived values, event handlers, side effects | [state](references/state.md) |
| Props & Emits | Receiving data from parent, emitting events to parent | [props-emits](references/props-emits.md) |
| Lifecycle Hooks | Component creation, mounting, updating, unmounting | [lifecycle](references/lifecycle.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| provide / inject | Dependency injection across deep component trees | [provide-inject](references/provide-inject.md) |
| Mixins | Reusable logic shared across components (use with caution) | [mixins](references/mixins.md) |

## Quick Reference

### Full SFC Template

```vue
<script>
export default {
  name: 'MyComponent',

  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },

  emits: ['update'],

  data() {
    return {
      localCount: this.count
    }
  },

  computed: {
    doubled() {
      return this.localCount * 2
    }
  },

  watch: {
    count(newVal) {
      this.localCount = newVal
    }
  },

  methods: {
    increment() {
      this.localCount++
      this.$emit('update', this.localCount)
    }
  },

  mounted() {
    console.log('Component mounted')
  }
}
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ localCount }} | Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Key Rules

- `data` must be a **function** (not an object) to avoid shared state across instances.
- `computed` properties are **cached** — only recompute when dependencies change.
- Use `watch` for **side effects** (API calls, logging), not for deriving state.
- Declare all `emits` explicitly to document the component's contract.
- Avoid `mixins` in new code — prefer composables (Composition API) for reuse.
