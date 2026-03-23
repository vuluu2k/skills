# Provide / Inject (`<script setup>`)

Provide and Inject are used for **dependency injection** to pass data deep into the component tree without prop drilling.

## Usage

### 1. In the Ancestor Component (`provide`)

```vue
<!-- App.vue -->
<script setup lang="ts">
import { provide, shallowRef } from 'vue'

const theme = shallowRef('dark')

// Provide the value (it remains reactive if passed directly)
provide('theme-context', theme)

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>
```

### 2. In the Descendant Component (`inject`)

```vue
<!-- DeepChild.vue -->
<script setup lang="ts">
import { inject, Ref } from 'vue'

// Inject the value, providing a fallback default
const theme = inject<Ref<string>>('theme-context', shallowRef('light'))
</script>

<template>
  <div :class="`theme-${theme}`">
    Current theme is {{ theme }}
  </div>
</template>
```

## Best Practices

- Always type your injected properties clearly or specify defaults.
- Ideally, **keep mutations in the provider** to preserve the one-way data flow. If the descendant needs to change the data, provide an update function alongside the state.
- Use `Symbol` keys for enterprise scale apps to avoid naming collisions.
