---
name: pinia-options
description: Pinia state management cho Vue dùng Options API style — định nghĩa store với state, getters, actions và cách dùng trong Options API components qua mapState/mapActions/mapWritableState.
metadata:
  author: my_job
  version: "2026.3.23"
  source: Hand-written based on https://pinia.vuejs.org
---

# Pinia (Options API Style)

> Kỹ năng này tập trung vào cách viết Pinia **Option Stores** và sử dụng chúng trong **Options API components**.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Option Stores | Định nghĩa store với state, getters, actions | [core-option-stores](references/core-option-stores.md) |
| Dùng trong Options API | mapState, mapWritableState, mapActions | [using-in-options-api](references/using-in-options-api.md) |

## Quick Reference

### Định nghĩa store

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

### Dùng trong component Options API

```js
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useCounterStore } from '@/stores/counter'

export default {
  computed: {
    ...mapState(useCounterStore, ['doubled']),      // readonly
    ...mapWritableState(useCounterStore, ['count']) // writable
  },
  methods: {
    ...mapActions(useCounterStore, ['increment'])
  }
}
```

## Key Rules

- `state` là **function**, trả về object — giống `data()` trong Vue.
- `getters` tương đương `computed` — có cache, nhận `state` làm tham số.
- `actions` tương đương `methods` — có thể async, dùng `this` để truy cập state.
- Options API component dùng `mapState` / `mapWritableState` / `mapActions` để kết nối store.
- Không gọi `useStore()` ở module scope — chỉ gọi trong function/method.
