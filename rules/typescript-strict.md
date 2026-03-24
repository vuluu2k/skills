# TypeScript Strict Rules

## Strict Mode
- Always enable `"strict": true` in `tsconfig.json`
- No implicit `any` — always type function parameters
- Use `unknown` instead of `any` when type is uncertain

## Types vs Interfaces
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and computed types

```ts
// Good: interface for extendable shapes
interface User {
  id: string
  name: string
}

// Good: type for unions
type Status = 'active' | 'inactive' | 'pending'
```

## Null Handling
- Use optional chaining `?.` and nullish coalescing `??`
- Avoid non-null assertion `!` — handle null explicitly
- Prefer explicit return types on exported functions

## Generics
- Name generics descriptively: `TItem`, `TKey`, `TResponse`
- Constrain generics when possible: `<T extends object>`
