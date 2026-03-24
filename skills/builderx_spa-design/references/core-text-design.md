---
name: core-text-design
description: Typography and color system using text_design.scss
---

# Typography & Colors

Always use the `.text-design-{level}-{weight}` utility classes or the `<Typography>` component. NEVER write custom `font-size`, `font-weight`, or `color` unless it's a completely unique case.

## 1. Utility Classes (Preferred)

Format: `text-design-[level]-[weight]`

**Levels (from text_design.scss):**
- `h0` (48px) → `h1` (38px) → `h2` (30px) → `h3` (24px) → `h4` (20px) → `h5` (16px)
- `body` (14px) → `body-sm` (13px)
- `footnote` (12px) → `footnote-sm` (10px)

**Weights:**
- `light` (300), `regular` (400), `medium` (500), `semibold` (600), `bold` (700)

```html
<!-- Example Usage -->
<h1 class="text-design-h3-bold text-center">Page Title</h1>
<p class="text-design-body-regular">Standard paragraph text.</p>
<span class="text-design-footnote-medium">Small note</span>
```

## 2. Common Shorthands
`text_design.scss` provides several hardcoded shorthands with built-in colors:

- `.text-design-body-regular-light` (Muted/818789)
- `.text-design-link` / `.text-design-link-medium` / `.text-design-link-bold` (Brand color)
- `.text-design-link-open-medium` (Brand color, underlines on hover)
- `.text-design-body-neutral` / `.text-design-body-neutral-medium`
- `.text-design-neutral-strong` (Dark/404946)
- `.text-design-primary-600-14` (Brand green)
- `.text-design-white-medium` (White inverse)

## 3. SCSS Mixins
If you must write SCSS, use the mixins:

```scss
.my-card-title {
  @include text-design(h4, bold);
  color: var(--color-content-brand);
}

.my-subtitle {
  @include text-design-body-medium; // Using shorthand mixin
}
```

## 4. Typography Component
```vue
<script setup>
import { Typography } from '@/components/design'
</script>
<template>
  <Typography variant="h3" weight="bold" component="span">
    Hello World
  </Typography>
</template>
```
