---
name: builderx_spa-design
description: Standardized design system for BuilderX SPA. Covers Typography (text_design.scss), Forms (Input, Select, Checkbox), Layout (Table, Drawer, Modal), and Feedback (Button, Alert). Use this skill to build UI consistently using pre-built components instead of raw HTML/Tailwind.
metadata:
  author: Vũ Lưu
  version: "2026.3.24"
  source: Hand-written based on @/components/design and text_design.scss
---

# BuilderX SPA Design System

> ⚠️ **CRITICAL RULE:** Do NOT create custom CSS/SCSS for basic UI elements (text, buttons, inputs, modals). ALWAYS use the components and utility classes documented here.

## Core Concepts

| Topic | Description | Reference |
|-------|-------------|-----------|
| Typography | Headers, Body text, Colors, utility classes | [core-text-design](references/core-text-design.md) |

## UI Components

We use Ant Design Vue wrapped in custom components to enforce our design language. 
**Cheat Sheet:** If you need a standard UI element, it likely exists in `@/components/design/[Name].vue` with standard AntD props + our custom props (like `label`, `message` for forms).

| Category | Available Components | Reference |
|----------|-----------------------|-----------|
| **Forms & Inputs** | `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `DatePicker`, `RangePicker` | [features-forms](references/features-forms.md) |
| **Layout & Data** | `Table`, `Tabs`, `Drawer`, `Modal`, `Sidebar`, `Pagination` | [features-layout-navigation](references/features-layout-navigation.md) |
| **Actions & Feedback** | `Button`, `Alert`, `Toastify`, `Badge`, `Empty`, `Tooltip` | [features-feedback-actions](references/features-feedback-actions.md) |

## General Usage Rule
```vue
<script setup>
// ALWAYS import from @/components/design, NOT generic antdv
import { Button, Input, Table } from '@/components/design'
</script>
```

## Tailwind CSS Integration

Absolutely **DO NOT** use custom CSS (custom classes in `<style>`) for layout and positioning. Combine the Design Component with **Tailwind CSS** to handle layout, spacing, sizing, and positioning.

**Usage Rules:**
1. **Design System Components:** Handle the functional logic and core UI/UX attributes (Example: `<Button>` controls color, hover effect, loading state).
2. **Tailwind CSS:** Handles layout via utility classes (e.g. `flex`, `gap-4`, `p-6`, `col-span-2`), spacing, sizing, and positioning.

### Example Integration:

```vue
<template>
  <!-- Use Tailwind classes 'flex', 'gap-4', 'p-6', 'items-center' to design layout -->
  <div class="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
    
    <div class="flex items-center justify-between">
      <h2 class="text-design-h3-bold">User Information</h2>
      <Button type="primary" label="Save Profile" @click="save" />
    </div>

    <!-- 2-column Grid Layout using Tailwind -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Input component scales to its parents grid item -->
      <Input v-model:value="user.firstName" label="First Name" />
      <Input v-model:value="user.lastName" label="Last Name" />
      
      <!-- Force column spanning -->
      <Input 
        class="col-span-2" 
        v-model:value="user.bio" 
        label="Biography" 
        isTextArea 
      />
    </div>

  </div>
</template>
```

> 💡 **Override Note:** Avoid overwriting internal styles of a Design Component. Before overriding UI, check for available props (such as size, type, or ghost). If you absolutely must override:
> 1. For small tweaks: Create a custom class and put it in your `<style scoped>` block.
> 2. For heavy customizations: Create a separate `[name]_custom_design.scss` file and import it, keeping the Vue file clean.
> **DO NOT** use `/deep/` or `::v-deep` directly on the component tag to brute-force styles.

