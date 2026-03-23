---
name: core-option-stores
description: Định nghĩa Option Stores trong Pinia — state, getters, actions, $patch, $reset, subscriptions.
---

# Option Stores

Option Stores có cú pháp tương tự Vue Options API:
- `state` ↔ `data`
- `getters` ↔ `computed`
- `actions` ↔ `methods`

## Định nghĩa store cơ bản

```ts
// stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

interface State {
  users: User[]
  currentUser: User | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: [],
    currentUser: null,
    loading: false
  }),

  getters: {
    // Nhận state làm tham số — có cache
    userCount: (state) => state.users.length,

    // Dùng this để truy cập getter khác (cần khai báo kiểu trả về)
    hasUsers(): boolean {
      return this.userCount > 0
    },

    // Getter trả về function (mất cache — dùng khi cần tham số)
    getUserById: (state) => {
      return (id: number) => state.users.find(u => u.id === id) ?? null
    }
  },

  actions: {
    // Sync action
    setCurrentUser(user: User) {
      this.currentUser = user
    },

    // Async action
    async fetchUsers() {
      this.loading = true
      try {
        this.users = await api.getUsers()
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
      const user = await api.getUser(id)
      this.currentUser = user
      return user
    },

    // Truy cập store khác bên trong action
    async fetchCurrentUserOrders() {
      const orderStore = useOrderStore() // gọi trong function, không ở module scope
      if (this.currentUser) {
        await orderStore.fetchByUserId(this.currentUser.id)
      }
    }
  }
})
```

## $patch — Cập nhật nhiều state cùng lúc

```ts
// Object syntax
store.$patch({
  loading: false,
  currentUser: { id: 1, name: 'Alice', email: 'alice@example.com' }
})

// Function syntax (dùng khi cần logic phức tạp như push, splice)
store.$patch((state) => {
  state.users.push(newUser)
  state.loading = false
})
```

## $reset — Khôi phục state về giá trị ban đầu

Option Stores có sẵn `$reset()` tự động — không cần viết thêm:

```ts
const store = useUserStore()
store.$reset() // state quay về giá trị khởi tạo trong state()
```

## $subscribe — Theo dõi thay đổi state

```ts
store.$subscribe((mutation, state) => {
  // mutation.type: 'direct' | 'patch object' | 'patch function'
  // mutation.storeId: 'user'
  localStorage.setItem('user', JSON.stringify(state))
})

// Giữ subscription sau khi component unmount
store.$subscribe(callback, { detached: true })
```

## $onAction — Theo dõi actions

```ts
const unsubscribe = store.$onAction(({ name, args, after, onError }) => {
  console.log(`Action "${name}" called with`, args)

  after((result) => {
    console.log(`Action "${name}" finished`)
  })

  onError((error) => {
    console.error(`Action "${name}" failed:`, error)
  })
})

// Cleanup
unsubscribe()
```

<!--
Source references:
- https://pinia.vuejs.org/core-concepts/
- https://pinia.vuejs.org/core-concepts/state.html
- https://pinia.vuejs.org/core-concepts/getters.html
- https://pinia.vuejs.org/core-concepts/actions.html
-->
