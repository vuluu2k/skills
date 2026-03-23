---
name: vue
description: Vue 3 Composition API — <script setup>, reactivity (shallowRef/ref), props without destructure, computed, watch, provide/inject, and composables. Use when the project uses modern Vue 3 Composition API style.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on https://vuejs.org and instructions/vue.md
---

# Vue 3 (Composition API)

> This skill focuses on the **Composition API** and **`<script setup>`** explicitly strongly typed with TypeScript.

## Key Rules (from instructions)

- **Prefer TypeScript** over JavaScript (`<script setup lang="ts">`).
- **Always use Composition API** over Options API.
- **Prefer `<script setup>`** over explicit `setup()` functions.
- **Prefer `shallowRef` over `ref`** for performance if deep reactivity is not used.
- **Discourage Reactive Props Destructure** (use `props.myProp` instead).

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| State & Reactivity | `shallowRef`, `ref`, `computed`, `watch` | [state](references/state.md) |
| Props & Emits | `defineProps` (no destructuring), `defineEmits` | [props-emits](references/props-emits.md) |
| Lifecycle Hooks | `onMounted`, `onUpdated`, `onUnmounted` | [lifecycle](references/lifecycle.md) |

## Features & Patterns

| Topic | Description | Reference |
|-------|-------------|-----------|
| Composables | State logic reuse (instead of Mixins) | [composables](references/composables.md) |
| Provide / Inject | Dependency injection across deep component trees | [provide-inject](references/provide-inject.md) |

## Quick Reference

### Full SFC Template (`<script setup>`)

```vue
<script setup lang="ts">
import { shallowRef, computed, watch, onMounted } from 'vue'

// -- Props & Emits --
interface Props {
  title: string
  count?: number
}
// ❌ Do NOT destructure props, keep the `props` object
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  update: [newCount: number]
}>()

// -- State --
// ✅ Prefer shallowRef if deep tracking isn't needed
const localCount = shallowRef(props.count)

// -- Computed --
const doubled = computed(() => localCount.value * 2)

// -- Watchers --
watch(() => props.count, (newVal) => {
  localCount.value = newVal
})

// -- Methods --
function increment() {
  localCount.value++
  emit('update', localCount.value)
}

// -- Lifecycle --
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div>
    <h1>{{ props.title }}</h1>
    <p>Count: {{ localCount }} | Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```
