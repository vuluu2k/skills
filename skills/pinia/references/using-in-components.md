# Using Stores in Components (`<script setup>`)

## `storeToRefs` — Keep Reactivity When Destructuring

When you destructure from a Pinia store, **state and getters lose reactivity** unless you use `storeToRefs`.

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const store = useUserStore()

// ✅ Reactive refs for state & getters
const { name, isAdmin, displayName } = storeToRefs(store)

// ✅ Actions are plain functions — destructure directly
const { setUser, reset } = store
</script>
```

### Why NOT just `toRefs`?

`toRefs` from Vue only works on plain reactive objects. `storeToRefs` is Pinia-aware: it skips actions and only wraps state/getters as refs.

```ts
// ❌ Don't use toRefs on a Pinia store
const { name } = toRefs(store) // actions would also become refs — wrong

// ✅ Use storeToRefs
const { name } = storeToRefs(store)
```

## Full Component Example

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useCartApi } from '@/composables/useCartApi'

const cartStore = useCartStore()
const { items, total } = storeToRefs(cartStore)
const { removeItem } = cartStore

const { fetchCart } = useCartApi()

onMounted(() => {
  fetchCart()
})
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }} — {{ item.quantity }} × {{ item.price }}
      <button @click="removeItem(item.id)">Remove</button>
    </li>
  </ul>
  <p>Total: {{ total }}</p>
</template>
```

## Accessing the Full Store (without destructuring)

When you need the whole store object (e.g. in a watcher), keep the reference:

```vue
<script setup lang="ts">
import { watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Watch a specific piece of state via storeToRefs
const { name } = storeToRefs(userStore)
watch(name, (newName) => {
  console.log('Name changed to', newName)
})
</script>
```

## Rules Summary

| Task | How |
|------|-----|
| Get reactive state/getters | `storeToRefs(store)` |
| Call actions | Destructure directly from store, or call `store.action()` |
| Watch store state | Use `storeToRefs` + Vue `watch` |
| Never do | Call `useStore()` at module top-level |
