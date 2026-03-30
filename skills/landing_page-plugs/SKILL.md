---
name: landing_page-plugs
description: Custom Plug middleware patterns in landing_page_backend — authentication (JWT/Passport), authorization, permission checking, and rate limiting.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend
---

# Landing Page — Plugs

> Custom Plug middleware architecture for authentication, authorization, and permission control.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Authentication Plugs | JWT validation, Passport auth, Account lookup | [core-auth](references/core-auth.md) |
| Permission Plugs | Role-based access control, page/org/team checks | [core-permissions](references/core-permissions.md) |

## Quick Reference

### Authentication Pipeline

```elixir
# Router pipeline — plugs chạy tuần tự
pipeline :passport do
  plug LandingPageWeb.Plug.PassportPlug     # 1. Validate token → assigns :token_claims
end

pipeline :account do
  plug LandingPageWeb.Plug.AccountPlug      # 2. Lookup account → assigns :account
end

pipeline :organization do
  plug LandingPageWeb.Plug.OrganizationPlug  # 3. Lookup org → assigns :organization
end

# Scope sử dụng pipelines
scope "/api/v1", LandingPageWeb.V1 do
  pipe_through [:api, :passport, :account, :organization]

  resources "/pages", PageController
end
```

### Writing a Custom Plug

```elixir
defmodule LandingPageWeb.Plug.MyCustomPlug do
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts) do
    # 1. Lấy data từ conn (headers, assigns, params)
    account = conn.assigns.account

    # 2. Validate/process
    case validate(account) do
      :ok ->
        # 3a. Success → assign data và pass conn tiếp
        conn |> assign(:validated, true)
      :error ->
        # 3b. Fail → halt pipeline
        conn |> send_resp(403, "Forbidden") |> halt()
    end
  end
end
```

### Permission Check Plug

```elixir
# Trong controller — chỉ áp dụng cho specific actions
plug LandingPageWeb.Plug.PermissionCheck,
     [role: :owner, type: :page]
     when action in [:delete]

plug LandingPageWeb.Plug.PermissionCheck,
     [role: :manager, type: :page]
     when action in [:page_detail, :update_right]

plug LandingPageWeb.Plug.PermissionCheck,
     [role: :organization_admin, type: :organization]
     when action in [:bulk_update_rights]
```
