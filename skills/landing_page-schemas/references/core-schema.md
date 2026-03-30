---
name: core-schema
description: Ecto Schema patterns — primary key, fields, virtual fields, associations, changesets, json serialization
---

# Ecto Schema Patterns — Landing Page Backend

## 1. Primary Key

Tất cả schema đều dùng **binary UUID autogenerate**:

```elixir
@primary_key {:id, :binary_id, autogenerate: true}
```

Foreign key references cũng dùng `type: Ecto.UUID`:

```elixir
belongs_to(:owner, Account, type: Ecto.UUID)
belongs_to(:page, Page, type: Ecto.UUID)
```

## 2. Status Field Convention

Mọi entity dùng `status` integer để quản lý trạng thái:

| Giá trị | Ý nghĩa |
|---------|----------|
| `> 0` | Active (hoạt động) |
| `== 0` | Deleted (đã xóa — soft delete) |
| `< 0` | Banned (bị khóa) |

```elixir
field(:status, :integer, default: 1)
```

## 3. Virtual Fields

Dùng `virtual: true` cho computed data không lưu trong DB:

```elixir
field(:conversion_rate, :float, virtual: true)
field(:member_type_id, :integer, virtual: true)
field(:permissions, {:array, :integer}, virtual: true)
```

Virtual fields thường được gán trong context module sau khi query.

## 4. Map/JSON Fields

Dùng `:map` type cho PostgreSQL JSONB columns:

```elixir
field(:data, :map, default: %{})
field(:settings, :map, default: %{})
```

## 5. Timestamps

Dùng `timestamps()` mặc định của Ecto (`:naive_datetime`):

```elixir
timestamps()
# Tạo: inserted_at, updated_at
```

## 6. Changeset Variants

### Standard Changeset
Cast các fields cần thiết, validate required, thêm constraints:

```elixir
def changeset(%__MODULE__{} = record, attrs) do
  record
  |> cast(attrs, [:name, :status, :owner_id, :settings])
  |> validate_required([:owner_id])
  |> unique_constraint(:email, name: :accounts_email_index)
end
```

### Passive Changeset
Cast TẤT CẢ schema fields — dùng cho sync/replication từ region khác:

```elixir
def passive_changeset(%__MODULE__{} = record, attrs) do
  fields = __schema__(:fields)
  record
  |> cast(attrs, fields)
  |> validate_required([:status])
end
```

### Changeset with Computed Fields
Xử lý logic trước khi cast:

```elixir
def changeset(%Account{} = account, attrs) do
  attrs = if tz = attrs[:timezone] do
    Map.put(attrs, :utc_offset, LandingPage.TimeUtil.get_offset(tz))
  else
    attrs
  end

  account
  |> cast(attrs, [:first_name, :last_name, :email, :timezone, :utc_offset])
end
```

## 7. JSON Serialization

Mỗi schema có `json/1` function để serialize thành map. **PHẢI kiểm tra association trước khi dùng**:

```elixir
def json(%__MODULE__{} = record) do
  res = Map.take(record, [:id, :name, :status, :inserted_at])

  # Pattern: kiểm tra association đã preload chưa
  res = case Map.fetch(record, :owner) do
    {:ok, %Ecto.Association.NotLoaded{}} -> res    # Chưa preload → bỏ qua
    {:ok, nil} -> res                                # Không có owner
    {:ok, owner} -> Map.put(res, :owner, Account.json(owner))
    _ -> res
  end

  res
end

# Polymorphic variants
def json(nil), do: nil
def json(list) when is_list(list), do: Enum.map(list, &json/1)
```

## 8. Enum Constants

Project dùng custom Enum module cho status/permission values:

```elixir
Enum.PageStatus.value(:active)           # Integer status
Enum.PagePermission.value(:owner)        # Role level
Enum.OrganizationPermission.value(:organization_owner)
Enum.FormDataStatus.value(:new)
Enum.SyncPosStatus.value(:synced)
```

Luôn dùng Enum thay vì hardcode integer values.

<!--
Source references:
- lib/landing_page/pages/page.ex
- lib/landing_page/accounts/account.ex
- lib/landing_page/organizations/organization.ex
- lib/landing_page/organizations/page_right.ex
- lib/landing_page/organizations/team.ex
-->
