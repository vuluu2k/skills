# API Calls in Composables (not in Stores)

## The Pattern

Store actions should only **mutate state**. HTTP requests and business logic should live in **composable functions** that call the store.

```
Component
  └── calls composable (useXxxApi)
        └── fetches data from API
        └── calls store action to update state
```

## Example: User Feature

### 1. The Store (state only)

```ts
// stores/user.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => currentUser.value !== null)

  function setUser(user: User) {
    currentUser.value = user
  }

  function setLoading(value: boolean) {
    isLoading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, isLoading, error, isLoggedIn, setUser, setLoading, setError, logout }
})
```

### 2. The API Composable

```ts
// composables/useUserApi.ts
import { useUserStore } from '@/stores/user'

export function useUserApi() {
  const store = useUserStore()

  async function fetchCurrentUser() {
    store.setLoading(true)
    store.setError(null)
    try {
      const response = await fetch('/api/me')
      if (!response.ok) throw new Error('Failed to fetch user')
      const user = await response.json()
      store.setUser(user)
    } catch (err) {
      store.setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      store.setLoading(false)
    }
  }

  async function updateProfile(data: { name: string }) {
    store.setLoading(true)
    try {
      const response = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await response.json()
      store.setUser(updated)
    } finally {
      store.setLoading(false)
    }
  }

  return { fetchCurrentUser, updateProfile }
}
```

### 3. Use in Component

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useUserApi } from '@/composables/useUserApi'

const userStore = useUserStore()
const { currentUser, isLoading, error } = storeToRefs(userStore)

const { fetchCurrentUser, updateProfile } = useUserApi()

onMounted(() => {
  fetchCurrentUser()
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="currentUser">Hello, {{ currentUser.name }}</div>
</template>
```

## Why This Pattern?

| Without composable (anti-pattern) | With composable (recommended) |
|---|---|
| Stores become fat with HTTP logic | Stores stay lean — only state mutations |
| Hard to test store actions (need to mock fetch) | Composables are easy to test in isolation |
| Loading/error state gets duplicated | Clearly owned by the composable |
| Actions hard to reuse across components | Composables are reusable by design |

## Rules

- Store actions: **only set state** (`ref.value = ...`).
- Composables: **fetch data, handle errors, call store setters**.
- One composable per domain entity (e.g. `useUserApi`, `useCartApi`, `useProductApi`).
- Composables can be used across multiple components without duplicating fetch logic.
