# Composables

**Rule:** Always use Composables instead of Mixins.

Composables are plain functions that use the Composition API to encapsulate and reuse stateful logic.

## 1. Defining a Composable

By convention, composable functions start with `use`. They should return `refs` or `computed` properties so components can choose what to expose or destructure.

```ts
// composables/useMouse.ts
import { shallowRef, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  // Encapsulated state
  const x = shallowRef(0)
  const y = shallowRef(0)

  // Encapsulated logic & side-effects
  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // Return values (not reactive destructuring here, returning the refs directly)
  return { x, y }
}
```

## 2. Using the Composable

```vue
<script setup lang="ts">
import { useMouse } from './composables/useMouse'

// Consume the composable
const { x, y } = useMouse()
</script>

<template>
  Mouse position: {{ x }}, {{ y }}
</template>
```

## Mixins vs Composables

Why Composables are strictly preferred:
- **No Property Name Conflicts:** You dynamically rename destructured properties when calling the composable.
- **Clear Origins:** You can easily trace exactly which state/method came from which composable.
- **TypeScript Support:** Composables are regular functions and type-check perfectly without advanced trickery.
