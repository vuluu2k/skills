---
name: builderx-api
description: Standardized API fetching for BuilderX SPA using useApiget, useApipost, and useApiDelete from @/composable/fetch. Use this skill when making network requests in the builderx_spa project.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on builderx_spa source code
---

# BuilderX API Wrapper

> Always use the built-in HTTP composables instead of using `axios` directly.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Fetching Data | `useApiget`, `useApipost`, `useApiDelete` | [fetch](references/fetch.md) |

## Quick Reference

```javascript
import { useApiget, useApipost } from '@/composable/fetch'

export default {
  methods: {
    async fetchUsers() {
      try {
        const url = `${import.meta.env.VITE_BUILDERX_API_URL}/api/v1/users`
        const res = await useApiget(url, { page: 1 })
        console.log(res.data)
      } catch (error) {
        console.error(error)
      }
    },
    async saveProfile(payload) {
      try {
        const url = `${import.meta.env.VITE_BUILDERX_API_URL}/api/v1/update_account`
        // url, params (query string), body
        const res = await useApipost(url, null, payload)
        if (res.status === 200) {
          // Success
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
```
