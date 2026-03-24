---
name: features-forms
description: Standard form elements (Input, Select, Checkbox, etc.) from @/components/design
---

# Form Elements

Use the wrapper components from `@/components/design` instead of raw AntD (`a-input`, `a-select`). Our wrappers add consistent styling, built-in labels, and error messages.

## Common Props Across Form Components
- `size`: `'xs'` | `'sm'` | `'md'` (default) | `'lg'`
- `disabled`: `Boolean`

## 1. Input Variants

`Input.vue` supports standard text, numbers, and textareas.
**Props:** `value` (v-model:value), `label`, `message` (sub-text or error text), `isError` (Boolean), `require` (Boolean - adds asterisk), `allowClear`.
**Variants built inside Input.vue:** Use `isTextArea="true"` for textarea, `isNumber="true"` for number formatting.

```vue
<template>
  <!-- Standard Input with label and error state -->
  <Input
    v-model:value="form.email"
    label="Email Address"
    require
    :isError="hasError"
    message="Please enter a valid email"
    placeholder="Enter email"
    size="lg"
  />

  <!-- Number Input with min/max -->
  <Input
    v-model:value="form.qty"
    isNumber
    :minNumber="1"
    :maxNumber="99"
  />

  <!-- Text Area -->
  <Input
    v-model:value="form.notes"
    isTextArea
    :rows="4"
  />
</template>
<script setup>
import { Input } from '@/components/design'
</script>
```

*(Note: The codebase also has specific `InputMoney.vue`, `InputTelephone.vue` if you need highly specialized formatting).*

## 2. Select

`Select.vue` wraps `a-select`.
**Props:** `value` (v-model:value), `options` (Array of objects or strings), `title` (acts as label), `mode` ('single' | 'multiple' | 'tags').
**Mapping:** Use `sKey` and `sValue` props to tell the component which fields in your objects map to the select's key and label (defaults to 'key' and 'value').

```vue
<template>
  <Select
    v-model:value="form.role"
    title="User Role"
    :options="roleOptions"
    sKey="id"
    sValue="name"
    :useNone="true" 
  />
  <!-- useNone=true automatically prepends a "None" option -->
</template>
```

## 3. Checkbox & Radio

`Checkbox.vue` and `Radio.vue` work individually or within their Group components (if you use AntD groups).

```vue
<template>
  <Checkbox
    v-model:checked="agreement"
    label="I agree to terms"
    subLabel="Read the full document below"
    size="md"
  />
</template>
<script setup>
import { Checkbox } from '@/components/design'
</script>
```
