---
name: landing_page-vue2-editor
description: Vue 2 Options API patterns for the Landing Page editor — Vuex namespaced stores, Ant Design Vue components, mixins, computed getters/setters, and axios API calls.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend/assets/editor
---

# Landing Page — Vue 2 Editor

> Vue 2.6 + Vuex 3 + Ant Design Vue 1.6 — Page builder editor application.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Component Pattern | Options API, computed getters/setters, mapState/mapGetters | [core-components](references/core-components.md) |
| Vuex Store | Namespaced modules, mutations, actions, Vuex architecture | [core-vuex](references/core-vuex.md) |
| API & Mixins | Axios calls, mixin patterns, custom plugins | [core-api-mixins](references/core-api-mixins.md) |

## Quick Reference

```vue
<template>
  <div class="my-trait">
    <a-input
      v-model="title"
      :placeholder="$t('ui.placeholder.title')"
      @change="onTitleChange"
    />

    <a-select v-model="status" style="width: 100%">
      <a-select-option :value="1">{{ $t('ui.active') }}</a-select-option>
      <a-select-option :value="0">{{ $t('ui.inactive') }}</a-select-option>
    </a-select>

    <a-checkbox v-model="autoPlay">Auto Play</a-checkbox>

    <a-button type="primary" @click="save">
      {{ $t('ui.save') }}
    </a-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'MyTrait',

  props: {
    elementId: { type: String, required: true }
  },

  data() {
    return {
      loading: false,
      localData: null
    }
  },

  computed: {
    ...mapState('page', ['data', 'sync']),
    ...mapState('ui', ['selectedElements']),
    ...mapGetters('page', ['currentPage']),

    // Two-way computed — đọc từ store, ghi lại store
    title: {
      get() {
        return this.$store.state.page.data.name
      },
      set(value) {
        this.$store.commit('page/set-name', value)
      }
    },

    status: {
      get() {
        return this.$store.state.page.data.status
      },
      set(value) {
        this.$store.commit('page/set-status', value)
      }
    }
  },

  methods: {
    ...mapActions('page', ['refresh-async-products']),

    onTitleChange() {
      // Debounce hoặc xử lý thêm
    },

    async save() {
      this.loading = true
      try {
        const res = await axios.put(`/api/pages/${this.data.id}`, {
          name: this.title,
          status: this.status
        }, {
          headers: { 'x-org-id': this.$store.state.organization.id }
        })

        if (res.status === 200) {
          this.$notification.success({ message: 'Saved!' })
        }
      } catch (e) {
        this.$notification.error({ message: 'Save failed' })
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    this['refresh-async-products']()
  }
}
</script>

<style scoped lang="sass">
.my-trait
  padding: 12px

  .ant-input
    margin-bottom: 8px
</style>
```
