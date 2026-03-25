---
name: builderx_api-controllers
description: Guide to Phoenix Controller structure in builderx_api using FallbackController and standard tuple responses.
metadata:
  author: Vũ Lưu
  version: "2026.03.25"
  source: Source code builderx_api
---

# BuilderX API Controllers

> Conventions for handling HTTP requests and responses at the Web API layer.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| FallbackController | Centralized response handling via tuples | [core-fallback](references/core-fallback.md) |
| Tuple Returns | Standard formats like `{:success, ...}` or `{:failed, ...}` | [core-fallback](references/core-fallback.md) |

## Quick Reference

```elixir
defmodule BuilderxApiWeb.V1.ExampleController do
  use BuilderxApiWeb, :controller
  
  # Required: Declare action_fallback
  action_fallback BuilderxApiWeb.FallbackController

  def show(conn, %{"id" => id}) do
    # Context functions should return tuples compatible with FallbackController instead of standard {:ok, data}
    # Example:
    {:success, :with_data, %{id: id, name: "Sample"}}
  end
  
  def delete(conn, _params) do
    # Return success without data
    {:success, :success_only}
  end

  def create(conn, _params) do
    # Return failure with a custom reason
    {:failed, :with_reason, "Invalid input data"}
    
    # Or return an error from a Changeset validation failure
    # {:error, changeset}
  end
end
```
