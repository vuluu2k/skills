---
name: features-layout-navigation
description: Layout and data display components from @/components/design
---

# Layout & Navigation

## 1. Modals & Drawers

`Modal.vue` and `Drawer.vue` provide consistent overlays with standard confirm/cancel footers.
**Props:** `title`, `visible` (v-model), `confirmLoading`, `okText`, `cancelText`, `hiddenOk`, `hiddenCancel`.
**Events:** `@ok`, `@cancel`

```vue
<template>
  <button @click="showModal = true">Open Modal</button>

  <Modal
    v-model:visible="showModal"
    title="Create Item"
    :confirmLoading="isSaving"
    okText="Save Changes"
    cancelText="Discard"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <!-- Content goes here -->
    <div class="p-4">My Form Items</div>
    
    <!-- Optional: Override the footer entirely -->
    <!-- <template #footer>Custom Buttons</template> -->
  </Modal>
</template>
<script setup>
import { Modal, Button } from '@/components/design'
import { ref } from 'vue'

const showModal = ref(false)
const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  // ... do save
  isSaving.value = false
  showModal.value = false
}
const handleClose = () => { /* reset */ }
</script>
```

*(Swap `<Modal>` with `<Drawer>` for a side-sheet behavior with identical API).*

## 2. Table Component

`Table.vue` wraps AntD `<a-table>` but adds unified `height`/`minHeight` styling, a centralized `<Pagination>` slot at the bottom, and an empty state.

**Props:**
- `columns`: standard AntD format.
- `height` / `minHeight` / `bodyHeight`.
- `loading`: shows `<LogoSpinning>` internally.
- `pagination`: automatically mounts the internal Pagination component if provided.

**Slots:** `#bodyCell`, `#headerCell`, `#expandedRowRender`, `#table-bottom-left`, `#table-bottom-right`.

```vue
<template>
  <Table
    :columns="columns"
    :dataSource="data"
    :loading="isLoading"
    :pagination="paginationData"
    height="calc(100vh - 200px)"
    @change="onTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <Button size="sm" type="secondary" @click="edit(record)">Edit</Button>
      </template>
    </template>
    
    <template #table-bottom-left>
      <span class="text-design-body-neutral">Selected {{ selectedRowKeys.length }} items</span>
    </template>
  </Table>
</template>
<script setup>
import { Table, Button } from '@/components/design'
</script>
```

## 3. Tabs Component

`Tabs.vue` wraps `<a-tabs>`. Use it alongside `Tab.vue`.
**Props:** `options` (array of items with `sKey`, `sValue`), `size`, `bordered`. Provide icons via the `icon` field mapping to Phosphor icons.

```vue
<template>
  <Tabs
    v-model:activeKey="activeTab"
    :options="tabOptions"
    sKey="id"
    sValue="name"
    size="md"
  >
    <template #tabPane="{ option }">
      <div v-if="option.id === 'general'">General Settings</div>
      <div v-if="option.id === 'advanced'">Advanced Config</div>
    </template>
  </Tabs>
</template>
<script setup>
import { Tabs } from '@/components/design'
import { ref } from 'vue'

const activeTab = ref('general')
const tabOptions = [
  { id: 'general', name: 'General', icon: 'PhGear' },
  { id: 'advanced', name: 'Advanced', icon: 'PhWrench' } // Phosphor icon keys
]
</script>
```
