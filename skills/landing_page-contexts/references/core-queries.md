---
name: core-queries
description: Ecto query patterns — from macros, dynamic queries, preloads, optimized selects, pagination
---

# Query Patterns — Landing Page Backend

## 1. Basic Queries

```elixir
import Ecto.Query, warn: false

# Lấy 1 record by ID
Repo.get(Page, page_id)

# Lấy 1 record by field
Repo.get_by(Page, custom_domain: host, status: 1)

# Lấy nhiều records
query = from p in Page,
  where: p.owner_id == ^account_id and p.status > 0,
  order_by: [desc: :inserted_at],
  limit: ^limit,
  offset: ^offset

Repo.all(query)
```

## 2. Optimized Select

Dùng module attribute cho danh sách fields thường dùng:

```elixir
@light_page_fields [
  :id, :status, :html, :css, :head, :settings,
  :inserted_at, :updated_at, :organization_id
]

query = from p in Page,
  where: p.custom_domain == ^host,
  select: ^@light_page_fields
```

**Lưu ý**: `select: ^@light_page_fields` chỉ select các fields cần thiết, giảm data transfer.

## 3. Dynamic Query Building

Dùng `dynamic()` macro để build query conditions có điều kiện:

```elixir
def search(page_id, filters) do
  # Base condition
  dyn = dynamic([f], f.page_id == ^page_id)

  # Conditional: phone number
  dyn = if phone = filters["phone_number"] do
    dynamic([f], ^dyn and f.phone_number == ^phone)
  else
    dyn
  end

  # Conditional: date range
  dyn = if date_from = filters["from"] do
    dynamic([f], ^dyn and f.inserted_at >= ^date_from)
  else
    dyn
  end

  # Conditional: international phone
  dyn = if intl_phone = filters["international_phone_number"] do
    dynamic([f], ^dyn and
      (f.international_phone_number == ^intl_phone or f.phone_number == ^phone))
  else
    dyn
  end

  from(f in PageFormData, where: ^dyn, order_by: [desc: :inserted_at])
  |> Repo.all()
end
```

## 4. Preload Patterns

### Static Preload
```elixir
query = from p in Page,
  preload: [:owner, :published]

Repo.all(query)
```

### Preload with Custom Query
```elixir
query_shared = from pap in PageAccountPermission, preload: [:account]
query_pub = from pp in PagePublished, select: [:domain, :path, :status]

query = from p in Page,
  where: p.id == ^page_id,
  preload: [:owner, shared_accounts: ^query_shared, published: ^query_pub]

Repo.one(query)
```

### Conditional Preload
```elixir
def preload_page(%Page{} = page, opts) do
  page = if Keyword.get(opts, :is_preload_published) do
    preload_pub = from pp in PagePublished,
      where: pp.page_id == ^page.id,
      select: [:domain, :path, :status]
    Repo.preload(page, published: preload_pub)
  else
    page
  end

  page
end
```

## 5. Aggregate Queries

```elixir
# Count
count = from(f in PageFormData,
  where: f.page_id == ^page_id,
  select: count("*")
) |> Repo.one()

# Count with dynamic query
count = PageFormData
  |> where([pfd], ^dyn_query)
  |> select([pfd], count("*"))
  |> Repo.one()
```

## 6. UUID Handling

Luôn cast UUID trước khi dùng trong query:

```elixir
page_id = Ecto.UUID.cast!(page.id)

query = from p in Page, where: p.id == ^page_id
```

## 7. Return Value Convention

```elixir
# Tìm thấy
{:ok, resource}

# Không tìm thấy
{:error, :not_found}
{:error, :entity_not_exist}

# Lỗi
{:error, changeset}
{:error, reason_string}
```

<!--
Source references:
- lib/landing_page/pages.ex (Pages context)
- lib/landing_page/form_data.ex (FormData context)
- lib/landing_page/organizations.ex (Organizations context)
-->
