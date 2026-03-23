# Checking Permissions (`@/composable/employeePermission`)

BuilderX stores permission arrays as a single large Integer (bitwise). To check dynamically, we use helper functions that isolate the bits.

## `hasPermission(permissionBit, permissionString)`

Checks if a user has a single specific permission.
It uses `BigInt` under the hood to prevent precision loss.

```js
import { hasPermission } from '@/composable/employeePermission'

// Evaluates to a non-zero truthy number if allowed, or 0 if denied
if (hasPermission(userBit, 'view_dashboard')) {
  // Allow access
}
```

## `hasPermissions(permissionBit, permissionStrings)`

Checks if a user has **ALL** of the specified permissions in an array.

```js
import { hasPermissions } from '@/composable/employeePermission'

// Evaluates to a truthy value only if they have BOTH permissions
if (hasPermissions(userBit, ['view_builder', 'export_site'])) {
  // Allow
}
```

## `getPermissionsFromBit(permissionBit)`

Converts the integer back into a readable array of permission strings. Primarily useful for debugging or rendering lists.
