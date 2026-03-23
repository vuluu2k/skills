---
name: using-in-options-api
description: Cách dùng Pinia store trong Options API component bằng mapState, mapWritableState, mapActions.
---

# Dùng Pinia trong Options API Components

Pinia cung cấp 3 helper để kết nối store với Options API component:

| Helper | Mục đích |
|--------|----------|
| `mapState` | Map state/getters → computed (readonly) |
| `mapWritableState` | Map state → computed (có thể gán = writable) |
| `mapActions` | Map actions → methods |

## Ví dụ đầy đủ

```js
// components/UserList.vue
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  computed: {
    // Readonly: truy cập state và getters
    ...mapState(useUserStore, ['users', 'loading', 'userCount']),

    // Writable: có thể dùng v-model hoặc gán trực tiếp
    ...mapWritableState(useUserStore, ['currentUser']),

    // Đặt tên alias nếu muốn
    ...mapState(useUserStore, {
      allUsers: 'users',         // alias cho state
      count: 'userCount',        // alias cho getter
    })
  },

  methods: {
    ...mapActions(useUserStore, ['fetchUsers', 'fetchUserById']),

    // Alias cho actions
    ...mapActions(useUserStore, {
      loadUsers: 'fetchUsers'
    }),

    async handleEdit(userId) {
      await this.fetchUserById(userId) // action đã được map
      this.$router.push('/edit')
    }
  },

  async created() {
    await this.fetchUsers()
  }
}
```

## Dùng với v-model

```vue
<template>
  <!-- currentUser đã dùng mapWritableState nên có thể v-model -->
  <input v-model="currentUser.name" />
</template>
```

> ❌ Không dùng `mapState` với `v-model` — nó là readonly, Vue sẽ cảnh báo.
> ✅ Dùng `mapWritableState` cho các field cần chỉnh sửa trực tiếp.

## Truy cập store trực tiếp (không dùng map helpers)

Khi cần linh hoạt hơn, truy cập store trực tiếp qua `setup()`:

```js
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const store = useUserStore()
    return { store }
  },
  computed: {
    userCount() {
      return this.store.userCount
    }
  },
  methods: {
    async load() {
      await this.store.fetchUsers()
    }
  }
}
```

## Lưu ý quan trọng

- Không khai báo `useStore()` ở module scope (ngoài function) — phải gọi bên trong `setup()`, `computed`, hoặc `methods`.
- `mapActions` trả về các function đã được bind — có thể destructure mà không mất `this`.
- `mapState` map cả **state** lẫn **getters** — không cần phân biệt.

<!--
Source references:
- https://pinia.vuejs.org/core-concepts/
- https://pinia.vuejs.org/cookbook/options-api.html
-->
