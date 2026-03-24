---
name: features-feedback-actions
description: Buttons, feedback states, and alerts from @/components/design
---

# Actions & Feedback

## 1. Button

The standard button uses custom CSS classes instead of wrapping `<a-button>` completely; it adds loading spinners and Phosphor icons explicitly.

**Core Props:**
- `type`: `'primary'` (green) | `'secondary'` (outline) | `'info'` (blue) | `'warning'` (orange) | `'danger'` or `'error'` (red) | `'gray'` | `'black'` | `'neutral'`
- `size`: `'xs'` (24px) | `'sm'` (28px) | `'md'` (32px, default) | `'lg'` (36px)
- `label`: String (Can also be placed in default slot)
- `loading`: Boolean (replaces icon with spinner, adds opacity)
- `ghost`: Boolean (inverts background/border for transparent usage)
- `danger`: Boolean (forces negative colors)

**Slots:** `#icon` (left), `#suffix` (right).

```vue
<template>
  <div class="flex gap-4">
    <!-- Primary action -->
    <Button 
      type="primary" 
      size="md" 
      label="Save Configuration" 
      :loading="isSaving" 
      @click="save" 
    />

    <!-- Ghost / Secondary -->
    <Button type="secondary" ghost>Cancel</Button>

    <!-- Danger with icon -->
    <Button type="danger">
      <template #icon><PhTrash /></template>
      Delete Record
    </Button>

    <!-- Icon-only button (automatically becomes a square) -->
    <Button type="warning">
      <template #icon><PhWarningCircle /></template>
    </Button>
  </div>
</template>
<script setup>
import { Button } from '@/components/design'
import { PhTrash, PhWarningCircle } from '@phosphor-icons/vue'
</script>
```

## 2. Empty States
Always use `<Empty>` instead of `<a-empty>` for consistency in "No Data" screens. Ensure the parent has relative positioning if using inside absolute layouts.

```vue
<template>
  <Empty 
    label="No orders found matching your criteria" 
    description="Try adjusting your filters"
  >
    <!-- Slot below text automatically inserts action buttons -->
    <Button type="primary" size="sm" @click="reset">Reset Filters</Button>
  </Empty>
</template>
<script setup>
import { Empty, Button } from '@/components/design'
</script>
```

## 3. Alerts and Notifications
For inline contextual alerts, use standard `<Alert>` components or the specific `<MessageAlert>` if present. Look at `Alert.vue` for details.

For simple Toast-style popups, inspect if the project uses global toast methods, e.g., via `app.config.globalProperties.$toast` or a `toast.js` utility rather than inline components.
