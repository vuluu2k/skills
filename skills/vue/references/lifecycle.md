# Lifecycle Hooks (`<script setup>`)

In Composition API, lifecycle hooks are imported functions that you call inside `setup()`.

## Core Hooks

```vue
<script setup lang="ts">
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('The component is now mounted to the DOM.')
  // E.g., fetch data, initialize third-party libraries, attach global listeners
})

onUpdated(() => {
  console.log('Component updated its DOM because reactive state changed.')
})

onUnmounted(() => {
  console.log('The component is being removed from the DOM.')
  // E.g., cleanup intervals, remove event listeners (if not scoped to the element)
})
</script>
```

## Usage Rules

- Hooks **must be called synchronously** during the `setup()` execution.
- You can call a hook multiple times in the same component, and all callbacks will be executed in the order they were registered.
- Avoid placing heavy initialization tasks directly in the component root; place DOM-dependent logic inside `onMounted`.
