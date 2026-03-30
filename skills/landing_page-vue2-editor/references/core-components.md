---
name: core-components
description: Vue 2 Options API component patterns — computed getters/setters, Ant Design Vue usage, scoped SASS, lifecycle hooks
---

# Component Patterns — Landing Page Editor

## 1. Component Structure

Mọi component dùng **Options API** (KHÔNG dùng Composition API hay `<script setup>`):

```vue
<template>
  <!-- Template here -->
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ComponentName',
  components: { /* local imports */ },
  mixins: [ /* mixins */ ],
  props: { /* typed props */ },
  data() { return { /* reactive state */ } },
  computed: { /* computed + mapState/mapGetters */ },
  watch: { /* watchers */ },
  methods: { /* methods + mapActions */ },
  created() { /* lifecycle */ },
  mounted() { /* lifecycle */ },
  beforeDestroy() { /* cleanup */ }
}
</script>

<style scoped lang="sass">
// Scoped SASS styles
</style>
```

## 2. Computed Getters/Setters

Pattern chính để bind UI controls tới Vuex store. **v-model trên computed property**:

```javascript
computed: {
  // Two-way binding: đọc từ store, ghi lại store khi thay đổi
  autoPlay: {
    get() {
      const el = this.$store.state.ui.selectedElements[0]
      return el?.dataset?.autoPlay ?? false
    },
    set(value) {
      this.$store.commit('ui/update-element-dataset', {
        key: 'autoPlay',
        value: value
      })
    }
  },

  // Read-only computed
  isMultiSelected() {
    return this.$store.state.ui.selectedElements.length > 1
  },

  // Merged styles từ multiple selected elements
  borderColor() {
    const elements = this.$store.state.ui.selectedElements
    const colors = elements.map(el => el.style?.borderColor)
    // Nếu tất cả giống nhau → return giá trị, ngược lại → return null
    return colors.every(c => c === colors[0]) ? colors[0] : null
  }
}
```

## 3. Ant Design Vue Components

UI dùng **Ant Design Vue 1.6.5**. Các components đã registered globally:

```vue
<template>
  <!-- Input -->
  <a-input v-model="name" placeholder="Name" />
  <a-textarea v-model="description" :rows="4" />
  <a-input-number v-model="count" :min="0" :max="100" />

  <!-- Select -->
  <a-select v-model="type" style="width: 100%">
    <a-select-option value="text">Text</a-select-option>
    <a-select-option value="image">Image</a-select-option>
  </a-select>

  <!-- Checkbox / Switch -->
  <a-checkbox v-model="enabled">Enable</a-checkbox>
  <a-switch v-model="visible" />

  <!-- Button -->
  <a-button type="primary" :loading="saving" @click="save">Save</a-button>
  <a-button type="danger" @click="remove">Delete</a-button>

  <!-- Dropdown Menu -->
  <a-dropdown :trigger="['click']">
    <a-button>Actions <a-icon type="down" /></a-button>
    <a-menu slot="overlay" @click="onMenuClick">
      <a-menu-item key="edit">Edit</a-menu-item>
      <a-menu-item key="delete">Delete</a-menu-item>
    </a-menu>
  </a-dropdown>

  <!-- Modal -->
  <a-modal v-model="showModal" title="Settings" @ok="handleOk">
    <p>Modal content</p>
  </a-modal>

  <!-- Table -->
  <a-table :columns="columns" :data-source="items" :pagination="pagination" />

  <!-- Notification (programmatic) -->
  <!-- this.$notification.success({ message: 'Done!' }) -->
  <!-- this.$notification.error({ message: 'Error!' }) -->

  <!-- Tabs -->
  <a-tabs v-model="activeTab">
    <a-tab-pane key="1" tab="General">Content 1</a-tab-pane>
    <a-tab-pane key="2" tab="Advanced">Content 2</a-tab-pane>
  </a-tabs>

  <!-- Tooltip -->
  <a-tooltip title="Hint text">
    <a-button>Hover me</a-button>
  </a-tooltip>
</template>
```

### Globally Registered Components
`a-button`, `a-icon`, `a-input`, `a-input-number`, `a-textarea`, `a-select`, `a-select-option`, `a-checkbox`, `a-switch`, `a-dropdown`, `a-menu`, `a-menu-item`, `a-modal`, `a-table`, `a-tabs`, `a-tab-pane`, `a-tooltip`, `a-popover`, `a-radio`, `a-radio-group`, `a-slider`, `a-upload`, `a-spin`, `a-collapse`, `a-collapse-panel`, `a-divider`, `a-row`, `a-col`, `a-form`, `a-form-item`

## 4. I18n

Dùng **vue-i18n 8.x**. Translation files nằm trong `editor/locales/`:

```vue
<template>
  <span>{{ $t('ui.general') }}</span>
  <a-input :placeholder="$t('ui.placeholder.name')" />
</template>
```

Locale mặc định: `en`, fallback: `vi`.

## 5. Custom Directives

```vue
<!-- Click outside detection -->
<div v-click-outside="closeMenu">
  <!-- menu content -->
</div>

<!-- Click outside within pageview -->
<div v-click-outside-pageview="deselectElement">
  <!-- element content -->
</div>
```

## 6. Event Patterns

```javascript
methods: {
  // Emit event lên parent
  handleChange(value) {
    this.$emit('change', value)
    this.$emit('update:modelValue', value)  // .sync modifier
  },

  // Global event bus (dùng $root)
  broadcastEvent() {
    this.$root.$emit('element-selected', this.elementId)
  }
},

created() {
  // Listen global events
  this.$root.$on('element-selected', this.onElementSelected)
},

beforeDestroy() {
  // Cleanup listeners
  this.$root.$off('element-selected', this.onElementSelected)
}
```

## 7. Style Convention

Dùng **scoped SASS** (KHÔNG phải SCSS):

```sass
<style scoped lang="sass">
.trait-panel
  padding: 12px
  border-bottom: 1px solid #e8e8e8

  .trait-label
    font-size: 12px
    color: #666
    margin-bottom: 4px

  .trait-row
    display: flex
    align-items: center
    gap: 8px
    margin-bottom: 8px

  .ant-input
    font-size: 12px
</style>
```

## 8. Vue.set for Reactivity

Vue 2 cần `Vue.set()` khi thêm property mới vào reactive object:

```javascript
import Vue from 'vue'

// Thêm property mới vào object
Vue.set(state, 'newProperty', value)

// Thay vì (KHÔNG reactive):
// state.newProperty = value

// Trong component
this.$set(this.data, 'key', value)
```

<!--
Source references:
- assets/editor/App.vue
- assets/editor/main/traits/VideoTrait.vue
- assets/editor/main/traits/Border.vue
- assets/editor/app.js
- assets/editor/i18n.js
-->
