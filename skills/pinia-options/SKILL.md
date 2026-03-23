---
name: pinia-options
description: Pinia state management for Vue using Options API style — define stores with state, getters, actions, and use them in Options API components via mapState/mapWritableState/mapActions.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on https://pinia.vuejs.org
---

# Pinia (Options API Style)

> This skill focuses on **Option Stores** and using them inside **Options API components**.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Option Stores | Define stores with state, getters, actions | [core-option-stores](references/core-option-stores.md) |
| Using in Options API | mapState, mapWritableState, mapActions | [using-in-options-api](references/using-in-options-api.md) |

## Quick Reference

### Define a store

```ts
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'My App'
  }),
  getters: {
    doubled: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
    async fetchData() {
      const data = await api.getData()
      this.name = data.name
    }
  }
})
```

### Use in an Options API component

```js
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useCounterStore } from '@/stores/counter'

export default {
  computed: {
    ...mapState(useCounterStore, ['doubled']),       // readonly
    ...mapWritableState(useCounterStore, ['count'])  // writable
  },
  methods: {
    ...mapActions(useCounterStore, ['increment'])
  }
}
```

## Key Rules

- `state` must be a **function** returning an object — same as `data()` in Vue.
- `getters` are equivalent to `computed` — cached, receive `state` as parameter.
- `actions` are equivalent to `methods` — can be async, use `this` to access state.
- Options API components use `mapState` / `mapWritableState` / `mapActions` to connect to stores.
- Never call `useStore()` at module scope — only call it inside a function or method.
