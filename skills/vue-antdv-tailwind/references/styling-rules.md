# Styling Rules (AntD + Tailwind)

## 1. Respect Component Responsibilities

- **Ant Design Vue (`<a-...>`)**: Use for functional structure (Drawers, Modals, Forms, Buttons, Selects, Tables).
- **Tailwind CSS (`class="..."`)**: Use for layout (`flex`, `grid`, `absolute`), spacing (`m-4`, `p-2`), typography (`text-center`, `text-lg`), and colors.

## 2. Avoid Custom `<style>` Blocks

Whenever possible, avoid writing custom `.scss` or `.css`. Instead of:

```vue
<!-- ❌ BAD: Writing custom CSS classes for layout -->
<template>
  <div class="header-container">
    <a-button>Click Me</a-button>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background-color: #f8f9fa;
}
</style>
```

Do this:

```vue
<!-- ✅ GOOD: Use Tailwind directly -->
<template>
  <div class="flex justify-end p-4 bg-gray-50">
    <a-button>Click Me</a-button>
  </div>
</template>
```

## 3. Styling Ant Design Internals

Sometimes AntD wraps elements deeply and you need to style inner parts. Use Tailwind's arbitrary selectors or general cascading, rather than `::v-deep`.

However, for simple spacing, you can always apply Tailwind directly to the Ant component.

```vue
<!-- Adds margin right to the AntD button -->
<a-button class="mr-2">Cancel</a-button>
```

## 4. Theme Integration

If modifying AntD primary colors globally, do so in Vue/Vite configuration configuration. If you need dynamic or context-specific color overrides in a template, Tailwind arbitrary values are highly reliable:

```vue
<a-button class="!bg-[#FF5722] !border-none !text-white">
  Danger Actions
</a-button>
```
*(Notice the `!` to force `!important` so it overrides AntD's core rules)*
