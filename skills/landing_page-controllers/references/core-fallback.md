---
name: core-fallback
description: FallbackController tuple responses, permission plug patterns, and Ecto.Multi transaction pattern in controllers
---

# Controller Patterns — Landing Page Backend

## 1. FallbackController

Mọi controller PHẢI khai báo:

```elixir
action_fallback LandingPageWeb.FallbackController
```

FallbackController nhận tuples từ controller actions và convert thành JSON response.

### Valid Tuple Returns

| Tuple | HTTP Status | Response |
|-------|-------------|----------|
| `{:success, :with_data, data}` | 200 | `%{success: true, data: data}` |
| `{:success, :with_data, "key", data}` | 200 | `%{success: true, key: data}` |
| `{:success, :success_only}` | 200 | `%{success: true}` |
| `{:failed, :with_reason, "message"}` | 400 | `%{success: false, message: "message"}` |
| `{:failed, :with_code, "CODE"}` | 400 | `%{success: false, code: "CODE"}` |
| `{:error, changeset}` | 422 | `%{success: false, errors: changeset_errors}` |
| `{:bad_request, :with_reason, "msg"}` | 400 | `%{success: false, message: "msg"}` |

### Error Code Convention

Dùng mã lỗi ngắn gọn: `ERROR CODE: {PREFIX}{NUMBER}`

```elixir
{:failed, :with_reason, "Create Organization Failed! ERROR CODE: CO0001"}
{:failed, :with_reason, "Page not found! ERROR CODE: PG0001"}
```

## 2. Permission Plugs

Khai báo permission plug **trước** `action_fallback`, chỉ áp dụng cho specific actions:

```elixir
# Check quyền page owner
plug LandingPageWeb.Plug.PermissionCheck,
     [role: :owner, type: :page]
     when action in [:delete]

# Check quyền page manager
plug LandingPageWeb.Plug.PermissionCheck,
     [role: :manager, type: :page]
     when action in [:page_detail, :update_right, :change_active_status]

# Check quyền org admin
plug LandingPageWeb.Plug.PermissionCheck,
     [role: :organization_admin, type: :organization]
     when action in [:bulk_update_rights]

# Check subscription limits
plug LandingPageWeb.Plug.SubscriptionPlug
     when action in [:create_organization]

# Campaign context
plug LandingPageWeb.Plug.CampaignPlug, "check_campaign"
     when action in [:render_page_by_id]
```

## 3. Truy cập conn.assigns

Sau khi đi qua pipeline plugs, `conn.assigns` chứa:

```elixir
conn.assigns.account        # Account struct (từ AccountPlug)
conn.assigns.organization   # Organization struct (từ OrganizationPlug)
conn.assigns.team           # Team struct (từ TeamPlug)
conn.assigns.token_claims   # JWT claims (từ PassportPlug)
conn.assigns.page           # Page struct (nếu có PagePlug)
conn.assigns[:subscription] # Subscription (optional, dùng [] thay vì .)
```

**Lưu ý**: Dùng `conn.assigns[:key]` cho optional assigns, `conn.assigns.key` cho required:

```elixir
# Optional — trả về nil nếu không có
organization = conn.assigns[:organization]

# Hoặc pattern match an toàn
organization = case Map.fetch(conn.assigns, :organization) do
  {:ok, o} -> o
  _ -> nil
end
```

## 4. Ecto.Multi trong Controllers

Dùng `Ecto.Multi` khi action cần thực hiện nhiều database operations atomic:

```elixir
def create_resource(conn, params) do
  account = conn.assigns.account

  multi = Multi.new()
    |> Multi.run(:resource, fn _, _ ->
      Resources.create(params)
    end)
    |> Multi.run(:permission, fn _, %{resource: resource} ->
      Permissions.grant(resource.id, account.id, :owner)
    end)
    |> Multi.run(:changelog, fn _, %{resource: resource} ->
      Outbox.new(%{
        queue: "resource_created",
        args: %{resource_id: resource.id, account_id: account.id}
      })
    end)

  case Repo.transaction(multi) do
    {:ok, %{resource: resource}} ->
      resource = Repo.preload(resource, :owner)
      {:success, :with_data, "resource", Resource.json(resource)}
    {:error, step, reason, _changes} ->
      {:failed, :with_reason, "Failed at #{step}: #{inspect(reason)}"}
  end
end
```

### Multi.run Naming Convention

- Step name = atom mô tả resource: `:organization`, `:page`, `:permission`
- Các step sau có thể access kết quả step trước qua `%{step_name: value}`
- Nếu bất kỳ step nào fail, toàn bộ transaction rollback

## 5. Module Constants

Dùng module attributes cho configuration:

```elixir
@domain_list ["demo.webcake.io"]
@preview_domain "https://www.webcake.me"
@seo_setting ["thumbnail", "favicon", "title", "description", "keywords"]
@pixel_setting ["fb_tracking_code", "tiktok_script", "gg_tracking_code"]
```

<!--
Source references:
- lib/landing_page_web/controllers/v1/pages/page_controller.ex
- lib/landing_page_web/controllers/v1/organizations/organization_controller.ex
- lib/landing_page_web/controllers/fallback_controller.ex
-->
