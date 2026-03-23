# State & Reactivity (`<script setup>`)

The Composition API allows you to declare reactive state flexibly. 

## `shallowRef` vs `ref` (Rule: Prefer `shallowRef` if possible)

By default, `ref` will make the entire structure deeply reactive, which can have an unintended performance cost for large datasets that only get replaced entirely.

```ts
import { ref, shallowRef } from 'vue'

// ✅ PREFERRED: Using shallowRef when deep reactivity isn't needed
// Use this if you only intend to overwrite the .value property and don't mutate its inner contents.
const rawDataList = shallowRef<Item[]>([])

// Updating shallowRef (must reassign .value)
rawDataList.value = [...newData]

// ⚠️ Use `ref` only when you specifically need to mutate inner nested object properties
const user = ref({ name: 'Alice', age: 30 })
user.value.age++ // Deeply reactive, triggers updates
```

## `computed` (Derived State)

Computed properties automatically update when their reactive dependencies change.

```ts
import { shallowRef, computed } from 'vue'

const count = shallowRef(1)
const doubled = computed(() => count.value * 2)
```

## `watch` & `watchEffect` (Side Effects)

Use `watch` to run side effects in response to reactive state changes.

```ts
import { shallowRef, watch, watchEffect } from 'vue'

const question = shallowRef('')
const answer = shallowRef('Thinking...')

// watch (explicit target, old/new values)
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    answer.value = 'Fetching answer!'
    // call an API...
  }
})

// watch a getter for specific property access
const state = shallowRef({ id: 1, name: 'bob' })

watch(
  () => state.value.id,
  (newId) => { console.log('ID triggered watch:', newId) }
)

// watchEffect (auto-track dependencies used synchronously inside the callback)
watchEffect(() => {
  console.log(`Current answer is: ${answer.value}`)
})
```
