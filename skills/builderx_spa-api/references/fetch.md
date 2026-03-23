# API Fetching (`@/composable/fetch`)

BuilderX SPA wraps `axios` calls to automatically attach the JWT token (`Authorization: Bearer <jwt>`) and the session ID (`x-session-id`). It also uses an in-flight pool mechanism (`flightPool`) to prevent duplicate concurrent requests.

## Text / JSON Data

```js
import { useApiget, useApipost, useApiDelete } from '@/composable/fetch'
```

### 1. `useApiget(url, params = null, headers = {})`

Used for `GET` requests.
- `url`: Full endpoint URL (usually prefixed with `import.meta.env.VITE_BUILDERX_API_URL`).
- `params`: Object converted to query parameters in the URL (`?key=value`).

### 2. `useApipost(url, params, body, headers = {})`

Used for `POST` requests.
- `params`: Query parameters (pass `null` if none).
- `body`: The JSON payload sent in the request body.

### 3. `useApiDelete(url, params, body, headers = {})`

Used for `DELETE` requests. Notice that it accepts a `body` just like `useApipost`.

---

## File Uploads & Progress Tracking

### 1. Standard Upload (No Progress Tracking)

You can use `useApipost` to upload `FormData`. Just make sure to pass `null` for `params` and override the content type headers.

```javascript
const formData = new FormData()
formData.append('file', this.selectedFile)
formData.append('type', 'image')

await useApipost(url, null, formData, { 'Content-Type': 'multipart/form-data' })
```

### 2. Upload with Progress Bar (`useApiProgress`)

If you need a progress bar, use `useApiProgress`. This function uses raw `XMLHttpRequest` under the hood.

```javascript
import { useApiProgress } from '@/composable/fetch'

const formData = {
  file: this.selectedFile,
  type: 'video'
}

await useApiProgress(
  'POST',              // method
  url,                // url
  formData,           // payload (automatically grouped into FormData if opts.formData is true)
  (progressEvent) => { // onProgress callback
    console.log(`Uploaded ${progressEvent.percent}%`)
  },
  { formData: true }  // opts - If false, it gzip compresses JSON instead.
)
```

## Rules

- **DO NOT** import `axios` directly in your components or Pinia stores.
- **DO NOT** manually construct `Authorization` headers. The wrappers handle this via cookies automatically.
- Always handle errors with `try...catch` or `.catch()` since these return Promises.
