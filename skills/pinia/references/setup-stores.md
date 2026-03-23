# Setup Stores

Setup Stores use a function (like `setup()`) to define state, getters, and actions — giving full TypeScript support and Composition API flexibility.

## Anatomy

```ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 🔵 state — reactive refs
  const id = ref<number | null>(null)
  const name = ref('')
  const isAdmin = ref(false)

  // 🟢 getters — computed
  const displayName = computed(() =>
    name.value ? name.value : 'Guest'
  )

  // 🟡 actions — plain functions (can be async)
  function setUser(userData: { id: number; name: string; isAdmin: boolean }) {
    id.value = userData.id
    name.value = userData.name
    isAdmin.value = userData.isAdmin
  }

  function reset() {
    id.value = null
    name.value = ''
    isAdmin.value = false
  }

  return { id, name, isAdmin, displayName, setUser, reset }
})
```

## Rules

| Concept | How to define |
|---------|--------------|
| State | `ref()` or `reactive()` |
| Getters | `computed()` |
| Actions | Plain functions (sync or `async`) |

- Everything returned from the setup function is **exposed** as store properties.
- Use `ref` (not `reactive`) for primitives for simpler TypeScript inference.
- Prefer multiple small stores (one per domain) over a single large one.

## TypeScript Typing

```ts
// Explicit typing for complex state
interface CartItem {
  id: number
  name: string
  quantity: number
  price: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function addItem(item: CartItem) {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push(item)
    }
  }

  function removeItem(id: number) {
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, total, addItem, removeItem }
})
```

## Store Composition (using another store)

```ts
export const useOrderStore = defineStore('order', () => {
  // ✅ Call other stores inside setup function — not at module level
  const cart = useCartStore()
  const user = useUserStore()

  const orders = ref<Order[]>([])

  async function placeOrder() {
    if (!user.id) return
    // compose from other stores
    const payload = { userId: user.id, items: cart.items }
    // ... submit payload
  }

  return { orders, placeOrder }
})
```
