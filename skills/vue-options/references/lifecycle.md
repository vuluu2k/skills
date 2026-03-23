---
name: lifecycle
description: Vue Options API lifecycle hooks — creation, mounting, updating, unmounting.
---

# Lifecycle Hooks

## Diagram

```
new Vue()
  │
  ├── beforeCreate   → instance initializing (no data/props yet)
  ├── created        → data/props/computed/methods available; no DOM yet
  │
  ├── beforeMount    → template compiled; about to insert into DOM
  ├── mounted        → component inserted into DOM ✅ (use for DOM access)
  │
  ├── beforeUpdate   → reactive data changed; DOM not yet updated
  ├── updated        → DOM updated ✅ (avoid heavy logic here)
  │
  ├── beforeUnmount  → component about to be removed (cleanup here ✅)
  └── unmounted      → component removed from DOM
```

## Common Hooks

### created
Runs after instance is set up. Use for initial data fetching (no DOM available).

```js
export default {
  data() {
    return { user: null }
  },
  async created() {
    this.user = await api.getUser(this.userId)
  }
}
```

### mounted
Runs after DOM is inserted. Use for DOM manipulation, third-party libs initialization.

```js
export default {
  mounted() {
    // Access the component's DOM
    this.$el.focus()
    // Initialize a chart, map, etc.
    this.chart = new Chart(this.$refs.canvas, { ... })
  }
}
```

### beforeUnmount
Run cleanup before the component is destroyed — remove event listeners, clear timers, destroy third-party instances.

```js
export default {
  data() {
    return { timer: null }
  },
  mounted() {
    this.timer = setInterval(this.tick, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
    this.chart?.destroy()
  }
}
```

### updated
Runs after every reactive re-render. Use sparingly — prefer `watch` or `computed` for reacting to specific changes.

```js
export default {
  updated() {
    // Runs on every update — be careful with performance
    console.log('DOM updated')
  }
}
```

## Keep-Alive Hooks

When a component is wrapped in `<KeepAlive>`:

```js
export default {
  activated() {
    // Component brought back into view
    this.startPolling()
  },
  deactivated() {
    // Component hidden but kept alive
    this.stopPolling()
  }
}
```

<!--
Source references:
- https://vuejs.org/api/options-lifecycle.html
- https://vuejs.org/guide/essentials/lifecycle.html
-->
