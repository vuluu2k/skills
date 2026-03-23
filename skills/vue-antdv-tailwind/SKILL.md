---
name: vue-antdv-tailwind
description: Best practices for mixing Ant Design Vue components with Tailwind CSS utility classes. Use this skill to keep styling consistent without custom CSS files.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on builderx_spa conventions
---

# Ant Design Vue + Tailwind CSS

> BuilderX SPA mixes Ant Design Vue's robust component library with Tailwind CSS's utility engine.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Styling Rules | How to properly mix AntD and Tailwind | [styling-rules](references/styling-rules.md) |

## Quick Reference

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-white rounded shadow">
    <h3 class="text-lg font-bold text-gray-800">Settings</h3>
    
    <!-- Override/extend AntD with Tailwind -->
    <a-button type="primary" class="bg-blue-600 hover:bg-blue-700">
      Save
    </a-button>
  </div>
</template>
```
