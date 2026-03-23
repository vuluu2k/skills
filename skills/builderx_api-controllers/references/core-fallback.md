---
name: core-fallback
description: Standard usage of Action Fallback in Phoenix Controllers of builderx_api.
---

# Action Fallback in Controllers

Controllers usually do not handle rendering JSON directly. They delegate this responsibility to `BuilderxApiWeb.FallbackController`.

## Mandatory Pattern

Always include the following line at the top of every API controller:

```elixir
action_fallback BuilderxApiWeb.FallbackController
```

## Valid Tuple Responses

Every action in an API controller must return one of the following tuples:

1. **Success with data:**
```elixir
{:success, :with_data, data}
# Fallback returns JSON: %{success: true, data: data, fallback: "with_data"}
```

2. **Success with data wrapped in a custom key:**
```elixir
{:success, :with_data, :user_info, data}
# Fallback returns JSON: %{success: true, fallback: "with_data", user_info: data}
```

3. **Success without data (only a 200 OK status):**
```elixir
{:success, :success_only}
# Fallback returns JSON: %{success: true, success_only: true}
```

4. **Failure with a reason:**
```elixir
{:failed, :with_reason, "Error description"}
# Fallback returns JSON (HTTP 422): %{success: false, reason: "Error description", fallback: "with_reason"}
```

5. **Failure with an error code:**
```elixir
{:failed, :with_code, "ERR_7009"}
# Fallback returns JSON (HTTP 422): %{success: false, code: "ERR_7009", fallback: "with_code"}
```

6. **Form / Ecto Validation Error:**
```elixir
{:error, changeset}
# Fallback will use ChangesetView to output the corresponding error array (HTTP 422).
```

7. **Bad Request Error:**
```elixir
{:bad_request, :with_reason, "Missing required parameters"}
# Fallback returns JSON (HTTP 400).
```
