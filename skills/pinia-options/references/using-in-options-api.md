---
name: using-in-options-api
description: How to use Pinia stores in Options API components via mapState, mapWritableState, and mapActions.
---

# Using Pinia in Options API Components

Pinia provides 3 helpers to connect stores with Options API components:

| Helper | Purpose |
|--------|---------|
| `mapState` | Map state/getters → computed (readonly) |
| `mapWritableState` | Map state → computed (writable, supports v-model) |
| `mapActions` | Map actions → methods |

## Full Example

```js
// components/UserList.vue
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  computed: {
    // Readonly: access state and getters
    ...mapState(useUserStore, ['users', 'loading', 'userCount']),

    // Writable: can use with v-model or direct assignment
    ...mapWritableState(useUserStore, ['currentUser']),

    // With aliases
    ...mapState(useUserStore, {
      allUsers: 'users',      // alias for state
      count: 'userCount',     // alias for getter
    })
  },

  methods: {
    ...mapActions(useUserStore, ['fetchUsers', 'fetchUserById']),

    // With aliases
    ...mapActions(useUserStore, {
      loadUsers: 'fetchUsers'
    }),

    async handleEdit(userId) {
      await this.fetchUserById(userId) // mapped action
      this.$router.push('/edit')
    }
  },

  async created() {
    await this.fetchUsers()
  }
}
```

## Using with v-model

```vue
<template>
  <!-- currentUser is mapped with mapWritableState, so v-model works -->
  <input v-model="currentUser.name" />
</template>
```

> ❌ Do not use `mapState` with `v-model` — it is readonly and Vue will warn.
> ✅ Use `mapWritableState` for fields that need direct mutation.

## Direct Store Access (without map helpers)

When you need more flexibility, access the store directly via `setup()`:

```js
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const store = useUserStore()
    return { store }
  },
  computed: {
    userCount() {
      return this.store.userCount
    }
  },
  methods: {
    async load() {
      await this.store.fetchUsers()
    }
  }
}
```

## Important Notes

- Never call `useStore()` at module scope — only inside `setup()`, `computed`, or `methods`.
- `mapActions` returns pre-bound functions — safe to destructure without losing `this`.
- `mapState` maps both **state** and **getters** — no need to distinguish between them.

<!--
Source references:
- https://pinia.vuejs.org/core-concepts/
- https://pinia.vuejs.org/cookbook/options-api.html
-->
