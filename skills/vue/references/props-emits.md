# Props and Emits (`<script setup>`)

## `defineProps` (No Reactive Destructure!)

**Rule:** Discourage using Reactive Props Destructure. Destructuring `props` removes primitive reactivity, leading to bugs. Always use the `props.` object prefix instead.

```vue
<script setup lang="ts">
// ❌ BAD: Destructuring the props object breaks reactivity!
// const { title } = defineProps<{ title: string }>()

// ✅ GOOD: Keep the `props` reference intact.
const props = defineProps<{
  title: string
  items: string[]
}>()

console.log(props.title) // Safe
</script>

<template>
  <h1>{{ props.title }}</h1>
</template>
```

### With Default Values (`withDefaults`)

```vue
<script setup lang="ts">
interface MenuProps {
  id: number
  isActive?: boolean
  label?: string
}

// ✅ Provide default values safely without destructuring
const props = withDefaults(defineProps<MenuProps>(), {
  isActive: false,
  label: 'Unknown Item'
})
</script>
```

## `defineEmits`

Use TypeScript syntax to strictly type the events your component can emit.

```vue
<script setup lang="ts">
// Best Practice: Type-based declaration
const emit = defineEmits<{
  // eventName: [payloadType1, payloadType2]
  open: [id: number]
  update: [value: string, timestamp: Date]
  close: []
}>()

function triggerUpdate() {
  emit('update', 'Success!', new Date())
}
</script>
```
