---
name: builderx-permission
description: Rule-based permission checking in BuilderX SPA using bitwise operations from @/composable/employeePermission. Use this skill when hiding/showing UI or checking user access.
metadata:
  author: Vũ Lưu
  version: "2026.3.23"
  source: Hand-written based on builderx_spa source code
---

# BuilderX Permissions

> Always use `hasPermission` and `hasPermissions` to check user roles logically against the bitwise structure.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Checking Access | How to pass the permission bit and the specific permission string | [has-permission](references/has-permission.md) |

## Quick Reference

```javascript
import { hasPermission } from '@/composable/employeePermission'
import { useSiteStore } from '@/stores/site'

export default {
  computed: {
    canEditProduct() {
      const siteStore = useSiteStore()
      const permissionsBit = siteStore.site?.site_permission?.permissions
      if (!permissionsBit) return false
      
      // Checking a specific string action
      return hasPermission(permissionsBit, 'update_product')
    }
  }
}
```
