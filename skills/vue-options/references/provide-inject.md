---
name: provide-inject
description: Vue Options API provide/inject for dependency injection across deep component trees.
---

# provide / inject

Use for passing data/functions deep into a component tree without prop drilling.
Only use when props would require passing through many intermediate components.

## Basic Usage

```js
// Ancestor component (Provider)
export default {
  provide() {
    return {
      theme: 'dark',
      appTitle: this.title // from data/props
    }
  },
  data() {
    return { title: 'My App' }
  }
}
```

```js
// Deep descendant component (Consumer)
export default {
  inject: ['theme', 'appTitle'],
  mounted() {
    console.log(this.theme)    // 'dark'
    console.log(this.appTitle) // 'My App'
  }
}
```

## With Default Values

```js
export default {
  inject: {
    theme: {
      default: 'light'  // fallback if no provider found
    },
    user: {
      from: 'currentUser', // alias the injection key
      default: null
    }
  }
}
```

## Reactive provide

By default, provided values are **not reactive**. To make them reactive, provide a `ref` or reactive object.

```js
import { ref } from 'vue'

export default {
  provide() {
    const count = ref(0)
    return {
      count,
      increment: () => count.value++
    }
  }
}
```

```js
// Consumer can now react to count changes
export default {
  inject: ['count', 'increment']
}
```

## When to Use

| Use provide/inject | Use props instead |
|--------------------|-------------------|
| Data needed by many deeply nested components | Direct parent-child communication |
| App-wide context (theme, locale, auth) | Fewer than 2-3 component levels deep |
| Avoiding prop drilling | Data flow needs to be explicit and traceable |

<!--
Source references:
- https://vuejs.org/api/options-composition.html#provide
- https://vuejs.org/guide/components/provide-inject.html
-->
