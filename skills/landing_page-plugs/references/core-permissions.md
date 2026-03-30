---
name: core-permissions
description: Permission plugs — role-based access control for pages, organizations, and teams
---

# Permission Plugs — Landing Page Backend

## 1. PermissionCheck Plug

Plug đa năng cho permission checking, pattern match trên `role` và `type`:

```elixir
defmodule LandingPageWeb.Plug.PermissionCheck do
  import Plug.Conn

  def init(opts), do: opts || []

  # --- Page Owner Check ---
  def call(conn, role: :owner, type: :page) do
    account_id = conn.assigns.account.id
    organization_role = Map.get(conn.assigns, :organization_role)

    page_ids = extract_page_ids(conn)

    cond do
      !page_ids || page_ids == [] ->
        reject(conn)

      # Org owner → có quyền owner tất cả pages trong org
      organization_role == Enum.OrganizationPermission.value(:organization_owner) ->
        conn

      true ->
        # Kiểm tra từng page
        errors = Enum.reduce(page_ids, [], fn page_id, acc ->
          with {:ok, pr} <- Organizations.get_page_right(account_id, page_id),
               true <- pr.role_id == Enum.PagePermission.value(:owner) do
            acc
          else
            _ -> acc ++ [:not_allowed]
          end
        end)

        if errors == [], do: conn, else: reject(conn)
    end
  end

  # --- Page Manager Check ---
  def call(conn, role: :manager, type: :page) do
    # Tương tự owner nhưng accept cả :manager role
  end

  # --- Organization Admin Check ---
  def call(conn, role: :organization_admin, type: :organization) do
    organization_role = Map.get(conn.assigns, :organization_role)

    if organization_role in [
      Enum.OrganizationPermission.value(:organization_owner),
      Enum.OrganizationPermission.value(:organization_admin)
    ] do
      conn
    else
      reject(conn)
    end
  end

  # --- Extract page IDs from header or assigns ---
  defp extract_page_ids(conn) do
    if page = Map.get(conn.assigns, :page) do
      [page.id]
    else
      for({"x-page-ids", value} <- conn.req_headers, do: value)
      |> List.first()
      |> case do
        nil -> []
        ids -> ids |> String.split(",") |> Enum.map(&String.trim/1) |> Enum.filter(& &1)
      end
    end
  end

  defp reject(conn) do
    conn |> send_resp(403, "Permission Denied!") |> halt()
  end
end
```

## 2. Permission Hierarchy

```
Organization Owner
  └── Có TẤT CẢ quyền trong org (bypass page-level checks)

Organization Admin
  └── Quản lý members, teams, settings
  └── KHÔNG tự động có quyền page owner

Page Owner
  └── Delete, transfer, manage collaborators

Page Manager
  └── Edit, view, manage form data

Page Viewer
  └── View only
```

### Enum Values

```elixir
# Organization level
Enum.OrganizationPermission.value(:organization_owner)  # owner toàn org
Enum.OrganizationPermission.value(:organization_admin)   # admin

# Page level
Enum.PagePermission.value(:owner)    # page owner
Enum.PagePermission.value(:manager)  # page manager
Enum.PagePermission.value(:viewer)   # page viewer
```

## 3. Organization & Team Plugs

### OrganizationPlug
```elixir
# Lấy organization từ header "x-organization-id"
# Assigns: :organization, :organization_role
```

### TeamPlug
```elixir
# Lấy team từ header hoặc params
# Assigns: :team
```

### OrgCheck / TeamCheck
```elixir
# Validate membership — reject nếu account không thuộc org/team
```

## 4. Page Right Model

Bảng `page_rights` lưu quyền truy cập page:

```elixir
schema "page_rights" do
  field(:status, :integer)
  field(:role_id, :integer)       # Enum.PagePermission value
  field(:temp_right, :boolean)    # Quyền tạm thời

  belongs_to(:page, Page, type: Ecto.UUID)
  belongs_to(:account, Account, type: Ecto.UUID)
end
```

## 5. Rate Limiting

```elixir
# Áp dụng trên form submission endpoints
plug LandingPageWeb.Plug.RateLimitPlug
     when action in [:create_form_data, :create_temp_form]
```

## 6. SuperAdminPlug

```elixir
# Kiểm tra account có quyền super admin
pipeline :super_admin do
  plug LandingPageWeb.Plug.SuperAdminPlug
end
```

Chỉ cho phép access admin routes (template management, system logs, analytics).

<!--
Source references:
- lib/landing_page_web/plugs/permission_check.ex
- lib/landing_page_web/plugs/organization_plug.ex
- lib/landing_page_web/plugs/team_plug.ex
- lib/landing_page/organizations/page_right.ex
-->
