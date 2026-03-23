# API Fetching (`@/composable/fetch`)

BuilderX SPA wraps `axios` calls to automatically attach the JWT token (`Authorization: Bearer <jwt>`) and the session ID (`x-session-id`). It also uses an in-flight pool mechanism (`flightPool`) to prevent duplicate concurrent identical requests.

## Methods

```js
import { useApiget, useApipost, useApiDelete } from '@/composable/fetch'
```

### 1. `useApiget(url, params = null, headers = {})`

Used for `GET` requests.

- `url`: Full endpoint URL (usually prefixed with `import.meta.env.VITE_BUILDERX_API_URL`).
- `params`: Object converted to query parameters.
- `headers`: Additional headers.

### 2. `useApipost(url, params, body, headers = {})`

Used for `POST` requests.

- `params`: Query parameters.
- `body`: The JSON payload sent in the request body.

### 3. `useApiDelete(url, params, body, headers = {})`

Used for `DELETE` requests. Notice that it accepts a `body` just like `useApipost`.

## Rules

- **DO NOT** import `axios` directly in components or Vuex/Pinia stores.
- **DO NOT** manually construct `Authorization` headers. The wrappers handle this via cookies automatically.
- Always handle errors with `try...catch` or `.catch()` since these return Promises.
