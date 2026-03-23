---
name: state
description: Vue Options API state options — data, computed, methods, watch.
---

# State: data, computed, methods, watch

## data

Must be a **function** returning an object. This ensures each component instance gets its own reactive state.

```js
export default {
  data() {
    return {
      message: 'Hello',
      count: 0,
      user: null
    }
  }
}
```

> ❌ Never use a plain object — it would be shared across all instances.

## computed

Derived reactive values. **Cached** until dependencies change — use instead of methods for template expressions.

```js
export default {
  data() {
    return { firstName: 'John', lastName: 'Doe' }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
    // Writable computed
    fullNameWritable: {
      get() {
        return `${this.firstName} ${this.lastName}`
      },
      set(value) {
        ;[this.firstName, this.lastName] = value.split(' ')
      }
    }
  }
}
```

## methods

Functions for event handlers and component logic. Not cached — called fresh every time.

```js
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    },
    async fetchUser(id) {
      this.user = await api.getUser(id)
    }
  }
}
```

> Do **not** use arrow functions for methods — they break `this` binding.

## watch

Run side effects when reactive data changes. Use for API calls, logging, or syncing external state.

```js
export default {
  data() {
    return { searchQuery: '', results: [] }
  },
  watch: {
    // Simple watcher
    searchQuery(newVal, oldVal) {
      this.fetchResults(newVal)
    },
    // Deep watcher (watches nested object changes)
    user: {
      handler(newVal) {
        console.log('User changed:', newVal)
      },
      deep: true
    },
    // Immediate watcher (runs on mount too)
    userId: {
      handler(id) {
        this.fetchUser(id)
      },
      immediate: true
    }
  }
}
```

| Option | Purpose |
|--------|---------|
| `deep: true` | Watch nested object properties |
| `immediate: true` | Run handler immediately on mount |
| `flush: 'post'` | Run after DOM update |

<!--
Source references:
- https://vuejs.org/api/options-state.html
-->
