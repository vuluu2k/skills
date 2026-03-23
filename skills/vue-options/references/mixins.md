---
name: mixins
description: Vue Options API mixins — reusable logic shared across components. Use with caution in new code.
---

# Mixins

> ⚠️ **Discouraged in new code.** Mixins cause naming conflicts and make data flow hard to trace. Prefer composables (Composition API) when possible.

## Basic Usage

```js
// mixins/timestampMixin.js
export const timestampMixin = {
  data() {
    return {
      createdAt: null,
      updatedAt: null
    }
  },
  methods: {
    touchUpdatedAt() {
      this.updatedAt = new Date().toISOString()
    }
  },
  created() {
    this.createdAt = new Date().toISOString()
  }
}
```

```js
// Component using the mixin
import { timestampMixin } from './mixins/timestampMixin'

export default {
  mixins: [timestampMixin],
  data() {
    return { title: 'My Post' }
  },
  methods: {
    save() {
      this.touchUpdatedAt() // from mixin
      // save logic...
    }
  }
}
```

## Merge Strategy

When a mixin and the component define the same option, Vue merges them:

| Option | Merge Strategy |
|--------|---------------|
| `data` | Merged, component wins on conflict |
| `hooks` (e.g. `mounted`) | Both called; mixin hook runs first |
| `methods`, `computed` | Component wins on conflict |

## Problems with Mixins

```js
// ❌ Hard to tell where `isLoading` came from
export default {
  mixins: [loadingMixin, userMixin],
  methods: {
    fetchData() {
      this.isLoading = true // which mixin owns this?
    }
  }
}
```

- **Name conflicts** are silent and hard to debug.
- **Unclear ownership** — hard to know which mixin a property belongs to.
- **Cannot pass parameters** to customize mixin behavior.

## Mixin vs Composable

```js
// ✅ Composable (Composition API) — explicit, parameter-friendly
import { useLoading } from './composables/useLoading'

export default {
  setup() {
    const { isLoading, startLoading } = useLoading()
    return { isLoading, startLoading }
  }
}
```

<!--
Source references:
- https://vuejs.org/api/options-composition.html#mixins
- https://vuejs.org/guide/reusability/composables.html#comparisons-with-other-techniques
-->
