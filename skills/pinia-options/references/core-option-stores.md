---
name: core-option-stores
description: Defining Option Stores in Pinia — state, getters, actions, $patch, $reset, subscriptions.
---

# Option Stores

Option Stores follow the same structure as Vue Options API:
- `state` ↔ `data`
- `getters` ↔ `computed`
- `actions` ↔ `methods`

## Defining a Store

```ts
// stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

interface State {
  users: User[]
  currentUser: User | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: [],
    currentUser: null,
    loading: false
  }),

  getters: {
    // Receives state as parameter — cached
    userCount: (state) => state.users.length,

    // Use `this` to access other getters (explicit return type required)
    hasUsers(): boolean {
      return this.userCount > 0
    },

    // Returns a function (loses caching — use when a parameter is needed)
    getUserById: (state) => {
      return (id: number) => state.users.find(u => u.id === id) ?? null
    }
  },

  actions: {
    // Sync action
    setCurrentUser(user: User) {
      this.currentUser = user
    },

    // Async action
    async fetchUsers() {
      this.loading = true
      try {
        this.users = await api.getUsers()
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
      const user = await api.getUser(id)
      this.currentUser = user
      return user
    },

    // Access another store inside an action
    async fetchCurrentUserOrders() {
      const orderStore = useOrderStore() // call inside function, not at module scope
      if (this.currentUser) {
        await orderStore.fetchByUserId(this.currentUser.id)
      }
    }
  }
})
```

## $patch — Update Multiple State Properties at Once

```ts
// Object syntax
store.$patch({
  loading: false,
  currentUser: { id: 1, name: 'Alice', email: 'alice@example.com' }
})

// Function syntax (use for complex mutations like push, splice)
store.$patch((state) => {
  state.users.push(newUser)
  state.loading = false
})
```

## $reset — Reset State to Initial Values

Option Stores have built-in `$reset()` — no extra code needed:

```ts
const store = useUserStore()
store.$reset() // reverts state to what was returned by state()
```

## $subscribe — Watch State Changes

```ts
store.$subscribe((mutation, state) => {
  // mutation.type: 'direct' | 'patch object' | 'patch function'
  // mutation.storeId: 'user'
  localStorage.setItem('user', JSON.stringify(state))
})

// Keep subscription alive after component is unmounted
store.$subscribe(callback, { detached: true })
```

## $onAction — Watch Action Calls

```ts
const unsubscribe = store.$onAction(({ name, args, after, onError }) => {
  console.log(`Action "${name}" called with`, args)

  after((result) => {
    console.log(`Action "${name}" finished`)
  })

  onError((error) => {
    console.error(`Action "${name}" failed:`, error)
  })
})

// Cleanup
unsubscribe()
```

<!--
Source references:
- https://pinia.vuejs.org/core-concepts/
- https://pinia.vuejs.org/core-concepts/state.html
- https://pinia.vuejs.org/core-concepts/getters.html
- https://pinia.vuejs.org/core-concepts/actions.html
-->
