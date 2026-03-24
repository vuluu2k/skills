# Vue Style Rules

## Component Naming
- Use PascalCase for component names: `MyComponent.vue`
- Use kebab-case in templates: `<my-component />`
- Prefix base/generic components with `Base`: `BaseButton`, `BaseInput`

## Script Setup
- Always use `<script setup lang="ts">` for Vue 3 components
- Use `defineProps` and `defineEmits` with TypeScript generics
- Define props interface separately for reusability

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  change: [value: number]
  submit: []
}>()
</script>
```

## Template
- Use `v-bind` shorthand `:` and `v-on` shorthand `@`
- Prefer `v-show` for frequent toggles, `v-if` for conditional rendering
- Always provide `key` when using `v-for`

## Composables
- Prefix with `use`: `useAuth`, `useCart`
- Always return reactive refs explicitly
- Keep side effects inside `onMounted` / `watchEffect`
