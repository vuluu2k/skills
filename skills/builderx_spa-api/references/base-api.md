# Class-based API (`@/api/baseApi.js`)

In `builderx_spa`, while `useApiget` and `useApipost` are convenient, the core CRUD operations and structured resources have dedicated service classes located in the `src/api/` folder.

These classes inherit from `BaseApi`, which automatically manages object URLs, `site_id`, `dashboard` prefixes, and standard REST HTTP calls using a customized `axiosClient`.

## 1. Creating an API Service

When creating a new API service for a resource, extend `BaseApi`. Set the `controller` name to match the backend resource.

```javascript
// src/api/customerApi.js
import { BaseApi } from "./baseApi"

class CustomerApi extends BaseApi {
  constructor() {
    super({
      controller: 'customer',
      v1: true,         // Adds /api/v1/ suffix
      dashboard: false  // If true, adds /dashboard/ suffix
    })
  }

  // You can define custom endpoints bypassing or extending getUrl()
  getCustomReport(params = {}) {
    // getUrl options: not_controller, is_dashboard, path
    const url = this.getUrl(params, { path: '/custom_report' })
    return this.axios.get(url, { params })
  }
}

// Always export a singleton instance
export default new CustomerApi()
```

## 2. Dynamic URL Generation

The `getUrl(params)` function inside `BaseApi` automatically analyzes the `params` you pass to construct proper hierarchical URLs:

- If `params.site_id` exists: Injects `/site/:site_id`
- If `params.page_id` exists: Injects `/:page_id`
- Appends `/:controller` automatically (unless `not_controller: true` is passed).

## 3. Standard CRUD Methods

`BaseApi` comes with 5 out-of-the-box methods:

```javascript
import customerApi from '@/api/customerApi'

// 1. list(params) => GET /api/v1[/site/:id]/customer?search=hello
await customerApi.list({ site_id: 1, search: 'hello' })

// 2. getById(params) => GET /api/v1[/site/:id]/customer/:id
await customerApi.getById({ id: 123, site_id: 1 })

// 3. create(data) => POST /api/v1[/site/:id]/customer
await customerApi.create({ site_id: 1, name: 'John Doe' })

// 4. update(data) => PATCH /api/v1[/site/:id]/customer/:id
await customerApi.update({ id: 123, site_id: 1, name: 'Jane Doe' })

// 5. delete(params) => DELETE /api/v1[/site/:id]/customer/:id
await customerApi.delete({ id: 123, site_id: 1 })
```

> **Note:** Just like `useApiget`, all `BaseApi` methods return a Promise resolving to a mapped response: `{ success: true, status: 200, data: {...} }`. The `data` property holds the body payload.

## 4. Landing Page API Variant (`@/api/landing/baseApi.js`)

For the Landing Page module, there is a separate instance of `BaseApi` located inside `src/api/landing/`.

While it shares the same CRUD function names (`list`, `create`, etc.), it operates differently under the hood using `axiosLanding.js`:

1. **Different Base URL**: Uses `import.meta.env.VITE_LANDING_PAGE_API_URL`
2. **Different Cookies/Auth**: 
   - Token: `ljwt` instead of `jwt`
   - Session ID: `lwsid` instead of `wsid`
   - Extra Headers: `x-team-id` (from `teamset`), `x-org-id` (from `orgset`)
3. **Simpler URL Routing**: Its `getUrl()` method does NOT attempt to inject `/site/:site_id` or `/dashboard`. It simply appends the `controller` path to its `prefix` (default: `/api/v1/`).
4. **Subscription Interceptor**: Automatically catches `error_code == 3001` and triggers the `useLandingCheckStore`'s `setRequireSubscription(true)` to prompt the user to upgrade.

```javascript
// Example: src/api/landing/folderApi.js
import BaseApi from "./baseApi"

class FolderApi extends BaseApi {
  constructor() {
    super({
      controller: 'folder'
      // default prefix is '/api/v1/'
    })
  }
}

export default new FolderApi()
```
