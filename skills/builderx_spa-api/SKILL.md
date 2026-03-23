---
name: builderx_spa-api
description: Standardized API fetching for BuilderX SPA using useApiget, useApipost, useApiDelete, and useApiProgress from @/composable/fetch. Covers GET/POST requests, file uploads, and progress tracking. Use this skill when making network requests in the builderx_spa project.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on builderx_spa source code
---

# BuilderX SPA API Wrapper

> Always use the built-in HTTP composables instead of using `axios` directly.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Fetching Data | `useApiget`, `useApipost`, `useApiDelete`, `useApiProgress` | [fetch](references/fetch.md) |
| Class-based API | `BaseApi` class, extending REST controllers in `@/api` | [base-api](references/base-api.md) |

## Quick Reference

### 1. The Class-based API approach (Preferred for CRUD)
Used when interacting with standard REST resources. Classes exist inside `src/api/` (Core API) and `src/api/landing/` (Landing Page API).

```javascript
import productApi from '@/api/productApi'
import landingPageApi from '@/api/landing/pageApi'

// List resources (calls base implementation)
const res = await productApi.list({ site_id: 123, limit: 10 })
const landingRes = await landingPageApi.list({ limit: 10 })


// Call custom endpoints defined in the child class
const customRes = await productApi.getProductsBuild({ search: 'shirt' })
```

### 2. The Composable approach (For one-off requests)
```javascript
import { useApiget, useApipost } from '@/composable/fetch'

export default {
  methods: {
    async fetchUsers() {
      const url = `${import.meta.env.VITE_BUILDERX_API_URL}/api/v1/users`
      // Returns a resolved axios response. Data is usually inside res.data.data
      const res = await useApiget(url, { page: 1 })
      console.log(res.data.data)
    },
    async saveProfile(payload) {
      const url = `${import.meta.env.VITE_BUILDERX_API_URL}/api/v1/update_account`
      // Signature: url, params (query string), body
      await useApipost(url, null, payload)
    }
  }
}
```

### File Uploads (No Progress Bar)
```javascript
const formData = new FormData()
formData.append('file', fileObject)

// Provide headers as the 4th argument
await useApipost(url, null, formData, { 'Content-Type': 'multipart/form-data' })
```
