---
name: core-vuex
description: Vuex 3 namespaced store architecture — 26 modules, mutations, actions, state management patterns
---

# Vuex Store — Landing Page Editor

## 1. Store Architecture

Store gồm **26 namespaced modules**:

```javascript
// editor/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    page,           // Page data, products, sync info, domains
    account,        // User account
    ui,             // Selected elements, display mode, history
    picker,         // Color/asset picker states
    sidebar,        // Sidebar panel state
    topbar,         // Top menu state
    trait,          // Right panel properties
    colorPicker,    // Color selection
    emotePicker,    // Emoji selection
    modalImage,     // Image modal
    modalAsset,     // Asset library
    event,          // Event tracking
    settings,       // App settings
    history,        // Undo/redo history
    persona,        // User personas
    organization,   // Organization data
    // ... modal modules
  }
})
```

## 2. Module Structure

Mỗi module có `namespaced: true`:

```javascript
// editor/store/modules/page.js
const state = {
  data: {},           // Page data object
  sync: null,         // Sync info
  tags: [],           // Product tags
  products: [],       // Products
  domains: []         // Custom domains
}

const getters = {
  currentPage: (state) => state.data,
  pageId: (state) => state.data?.id,
  isPublished: (state) => state.data?.status === 1
}

const mutations = {
  'set-data': (state, data) => {
    state.data = data
  },
  'set-name': (state, name) => {
    state.data.name = name
  },
  'set-status': (state, status) => {
    state.data.status = status
  },
  'set-sync': (state, sync) => {
    Vue.set(state, 'sync', sync)
  }
}

const actions = {
  'refresh-async-products': ({ state }) => {
    axios.get(`/api/pages/${state.data.id}/view/sync_info`)
      .then(res => {
        if (res.status === 200) {
          Vue.set(state, 'sync', res.data.data.sync_info)
        }
      })
  },
  'fetch-tags': ({ commit, state }) => {
    axios.get(`/api/pages/${state.data.id}/view/tags`, {
      params: { shop_id: state.sync?.shop_id }
    })
      .then(res => {
        Vue.set(state, 'tags', res.data.data)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

## 3. Accessing Store from Components

```javascript
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    // Map state — cần specify module name
    ...mapState('page', ['data', 'sync', 'products']),
    ...mapState('ui', ['selectedElements', 'displayMode']),
    ...mapState('organization', ['id']),

    // Map getters
    ...mapGetters('page', ['currentPage', 'isPublished']),

    // Direct access
    pageId() {
      return this.$store.state.page.data?.id
    }
  },

  methods: {
    // Map actions
    ...mapActions('page', ['refresh-async-products', 'fetch-tags']),

    // Direct commit/dispatch
    updateName(name) {
      this.$store.commit('page/set-name', name)
    },

    fetchData() {
      this.$store.dispatch('page/refresh-async-products')
    }
  }
}
```

## 4. Mutation Naming Convention

Dùng **kebab-case** strings:

```javascript
// ✅ Đúng convention
'set-data'
'set-name'
'set-status'
'set-state'
'set-width'
'set-position'
'set-view'
'toggle-zoom'
'show'

// Commit
this.$store.commit('module/set-data', payload)
this.$store.commit('trait/set-width', 300)
```

## 5. Vue.set trong Store

**BẮT BUỘC** dùng `Vue.set()` khi thêm/thay thế property trong state:

```javascript
import Vue from 'vue'

const mutations = {
  // ✅ Reactive — dùng Vue.set
  'set-sync': (state, sync) => {
    Vue.set(state, 'sync', sync)
  },

  // ❌ KHÔNG reactive nếu property chưa tồn tại
  'set-sync-wrong': (state, sync) => {
    state.sync = sync  // Chỉ reactive nếu 'sync' đã có trong initial state
  }
}
```

## 6. Key Modules

### ui module
Quản lý editor UI state:
```javascript
state: {
  selectedElements: [],    // Mảng elements đang được chọn
  displayMode: 'desktop',  // 'desktop' | 'mobile'
  zoom: 1,                 // Zoom level
  showGrid: false,         // Grid visibility
  history: [],             // Undo stack
  historyIndex: -1         // Current history position
}
```

### trait module
Quản lý right panel (property inspector):
```javascript
state: {
  position: 'right',       // Panel position
  view: 'style',           // Current tab
  zoom: false,             // Zoom state
  width: 300,              // Panel width
  visible: true,           // Panel visibility
  shownTrait: null,        // Active trait component
  ref_botcake_partner_services: [] // Partner services
}
```

### history module
Undo/redo functionality:
```javascript
mutations: {
  'push': (state, snapshot) => { /* push to history stack */ },
  'undo': (state) => { /* go back */ },
  'redo': (state) => { /* go forward */ }
}
```

<!--
Source references:
- assets/editor/store/index.js
- assets/editor/store/modules/page.js
- assets/editor/store/modules/trait.js
- assets/editor/store/modules/ui.js
-->
