---
name: core-api-mixins
description: Axios API call patterns, mixin usage, custom plugins ($wc), and Webpack build configuration
---

# API Calls & Mixins — Landing Page Editor

## 1. Axios API Calls

HTTP client: **axios 0.21.1**. API calls nằm trong store actions, mixins, và component methods.

### Trong Store Actions

```javascript
actions: {
  'refresh-async-products': ({ state }) => {
    axios.get(`/api/pages/${state.data.id}/view/sync_info`)
      .then(res => {
        if (res.status === 200) {
          Vue.set(state, 'sync', res.data.data.sync_info)
        }
      })
  }
}
```

### Trong Component Methods

```javascript
methods: {
  async fetchData() {
    try {
      const res = await axios.get('/api/datasets/entities/all', {
        headers: { 'x-org-id': this.$store.state.organization.id },
        params: { page: 1, limit: 20, type: 'ALL' }
      })

      if (res.status === 200) {
        this.items = res.data.dataset_entities.data
      }
    } catch (e) {
      this.$notification.error({ message: 'Load failed' })
    }
  },

  async save() {
    const res = await axios.put(`/api/pages/${this.pageId}`, {
      name: this.name,
      data: this.pageData
    })

    if (res.data.success) {
      this.$notification.success({ message: 'Saved!' })
    }
  }
}
```

### Headers Convention

```javascript
// Organization ID header — bắt buộc cho org-scoped endpoints
headers: { 'x-org-id': this.$store.state.organization.id }

// Page IDs header — cho multi-page operations
headers: { 'x-page-ids': pageIds.join(',') }
```

### API Response Format

Backend trả về format:
```javascript
{
  success: true,
  data: { /* resource data */ }
  // hoặc
  key_name: { /* named resource */ }
}
```

## 2. Mixins

Mixins nằm trong `editor/main/mixins/`. Dùng để share logic giữa components.

### Sử dụng Mixin

```javascript
import fillSection from '../mixins/fillSection'
import linkDataset from '../mixins/linkDataset'

export default {
  name: 'MyComponent',
  mixins: [fillSection, linkDataset],

  // Component's own options merge với mixin
  data() { return { /* ... */ } },
  computed: { /* ... */ },
  methods: { /* ... */ }
}
```

### Mixin Structure

```javascript
// editor/main/mixins/linkDataset.js
export default {
  data() {
    return {
      datasetId: null,
      datasetEntities: []
    }
  },

  computed: {
    orgId() {
      return this.$store.state.organization.id
    }
  },

  methods: {
    setDatasetById(id, type) {
      axios.get('/api/datasets/entities/all', {
        headers: { 'x-org-id': this.orgId },
        params: { page: 1, limit: 20, type }
      }).then(res => {
        if (res.status === 200) {
          this.datasetEntities = res.data.dataset_entities.data
          const found = this.datasetEntities.find(d => d.id === id)
          if (found) this.datasetId = found.id
        }
      })
    }
  }
}
```

### Key Mixins

| Mixin | Chức năng |
|-------|-----------|
| `fillSection` | Section fill utilities (colors, gradients) |
| `linkDataset` | Dataset binding cho elements |
| `altClone` | Alt+drag clone functionality |
| `joinNewSection` | Section creation logic |
| `textMixins` | Text formatting operations |
| `renderImages` | Image rendering utilities |
| `applyConstraint` | Responsive constraint logic |
| `mxAnimation` | Animation helpers |

## 3. Custom Plugin ($wc)

Plugin `$wc` registered globally — cung cấp loading state và utilities:

```javascript
// editor/plugins/index.js
export default {
  install(Vue, options = {}) {
    Vue.mixin({
      created() {
        if (!this.$wc) {
          this.$wc = Vue.observable(options)
        }
        functions(this)  // Attach utility functions
      }
    })
  }
}

// Usage in components:
this.$wc.loading = true
this.$wc.someUtility()
```

## 4. Element Factory

`editor/factory.js` tạo page elements:

```javascript
// Tạo element mới
import { createElement } from './factory'

const element = createElement('text', {
  content: 'Hello',
  style: { fontSize: '16px', color: '#333' }
})

// Element types: text, image, button, section, video, form, etc.
```

## 5. Common Utilities

`editor/common.js` (36KB) chứa shared functions:

```javascript
// Import utilities
import { deepClone, generateId, debounce, throttle } from './common'

// Deep clone object (dùng immer hoặc lodash)
const cloned = deepClone(originalData)

// Generate unique ID
const id = generateId()

// Debounce for performance
const debouncedSave = debounce(this.save, 300)
```

## 6. Webpack Build

### Builder Config (builder.config.js)
```javascript
// Entry: editor/app.js
// Output: priv/static/js/builder.js
// Loaders: vue-loader, babel-loader, sass-loader
// Plugins: VueLoaderPlugin, MiniCssExtractPlugin
```

### Render Config (render.config.js)
```javascript
// 7 entry points: main, product, audio, dateTime, search, sw, pageStory
// Output: priv/static/js/render_v4/
// DefinePlugin cho API host:
//   Production: https://api.webcake.io
//   Staging: domain-based
//   Local: http://api.localhost:5800
```

### Babel Target
```javascript
// Targets IE11, Safari 7, iOS 7
// preset-env with useBuiltIns: 'entry'
```

## 7. Important Patterns

- **KHÔNG dùng async/await trong store actions** — dùng Promise chains (.then/.catch)
- **Vue.set BẮT BUỘC** khi thêm reactive properties mới
- **Scoped SASS** (KHÔNG SCSS) cho component styles
- **kebab-case** cho mutation names: `'set-data'`, `'toggle-zoom'`
- **`this.$store`** cho direct access thay vì luôn dùng mapState
- **Headers `x-org-id`** bắt buộc cho org-scoped API calls
- **`this.$notification`** từ Ant Design Vue cho toast messages

<!--
Source references:
- assets/editor/app.js
- assets/editor/store/modules/page.js
- assets/editor/main/mixins/linkDataset.js
- assets/editor/plugins/index.js
- assets/editor/common.js
- assets/builder.config.js
- assets/render.config.js
-->
