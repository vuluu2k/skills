---
name: props-emits
description: Vue Options API props declaration and emits for parent-child communication.
---

# Props & Emits

## props

Declare all props explicitly with types and defaults. Never mutate props directly.

```js
export default {
  props: {
    // Basic type
    title: String,

    // Required prop
    userId: {
      type: Number,
      required: true
    },

    // With default value
    status: {
      type: String,
      default: 'active'
    },

    // Multiple types
    value: {
      type: [String, Number],
      default: ''
    },

    // Object with default (must use factory function)
    config: {
      type: Object,
      default: () => ({ theme: 'light' })
    },

    // Custom validator
    size: {
      type: String,
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  }
}
```

> ❌ Never do `this.propName = value` — mutating props breaks data flow.
> ✅ Instead, emit an event or use a local `data` copy.

## emits

Always declare emitted events explicitly. Improves readability and avoids attribute fallthrough conflicts.

```js
export default {
  // Simple declaration
  emits: ['submit', 'cancel'],

  // With validation
  emits: {
    submit: (payload) => {
      // Return true = valid, false = warning
      return payload && payload.email
    },
    cancel: null // no validation
  },

  methods: {
    handleSubmit() {
      this.$emit('submit', { email: this.email })
    }
  }
}
```

## Two-way binding with v-model

```js
// Child component
export default {
  props: {
    modelValue: String
  },
  emits: ['update:modelValue'],
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
```

```vue
<!-- Parent usage -->
<MyInput v-model="username" />
```

<!--
Source references:
- https://vuejs.org/api/options-state.html#props
- https://vuejs.org/guide/components/events.html
-->
