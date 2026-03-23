---
name: pinia
description: Pinia state management for Vue 3 using Composition API (Setup Stores) — TypeScript-first, storeToRefs for reactivity, focused stores, and API calls in composables. Use when the project uses Vue 3 Composition API / <script setup>.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on https://pinia.vuejs.org and instructions/pinia.md
---

# Pinia (Composition API / Setup Stores)

> This skill focuses on **Setup Stores** with TypeScript and using them inside **Composition API / `<script setup>`** components.

## Key Rules (from instructions)

- **Prefer TypeScript** over JavaScript for all stores and composables.
- **Use `storeToRefs`** when destructuring state from stores to maintain reactivity.
- **Prefer smaller, focused stores** over large monolithic stores.
- **Keep API calls in separate composable functions** — do not embed them directly in store actions.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Setup Stores | Define stores with `ref`, `computed`, functions inside `defineStore` | [setup-stores](references/setup-stores.md) |
| Using in Components | `storeToRefs`, direct action calls in `<script setup>` | [using-in-components](references/using-in-components.md) |
| API in Composables | Separate API calls from store actions via composable functions | [api-in-composables](references/api-in-composables.md) |

## Quick Reference

### Define a Setup Store (TypeScript)

```ts
// stores/counter.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('My App')

  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, name, doubled, increment }
})
```

### Use in a `<script setup>` Component

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// ✅ Use storeToRefs to keep reactivity when destructuring state/getters
const { count, doubled } = storeToRefs(store)

// ✅ Actions can be destructured directly (they are plain functions)
const { increment } = store
</script>

<template>
  <p>Count: {{ count }} | Doubled: {{ doubled }}</p>
  <button @click="increment">Increment</button>
</template>
```

### API Calls in Composables (not in stores)

```ts
// composables/useCounterApi.ts
import { useCounterStore } from '@/stores/counter'

export function useCounterApi() {
  const store = useCounterStore()

  async function fetchCount() {
    const data = await fetch('/api/counter').then(r => r.json())
    store.count = data.count
  }

  return { fetchCount }
}
```

```vue
<script setup lang="ts">
import { useCounterApi } from '@/composables/useCounterApi'

const { fetchCount } = useCounterApi()
</script>
```

## Key Rules Detail

- **Never** call `useStore()` at module top-level — only inside `setup()` / `<script setup>` / composables.
- `storeToRefs` extracts **reactive refs** for state and getters; actions remain plain functions and don't need `storeToRefs`.
- Each store should represent **one domain concern** — split user, cart, notifications into separate stores.
- Store actions should orchestrate state mutations only; delegate HTTP/fetch calls to composables.
