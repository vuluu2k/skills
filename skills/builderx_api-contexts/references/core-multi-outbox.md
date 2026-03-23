---
name: core-multi-outbox
description: Standard usage of Ecto.Multi and Outbox Pattern in builderx_api Contexts.
---

# Core Contexts - Multi and Outbox

Context objects in `builderx_api` are often very large and contain complex logic requiring multiple steps within a shared transaction.

## 1. Using Ecto.Multi

For any complex create/update action that modifies logs or synchronize data with other systems, we use `Ecto.Multi`. Always separate the logic that creates the `Changeset` into an independent step.

```elixir
Multi.new()
|> Multi.run(:changeset, fn _, _ ->
  {:ok, Product.changeset(%Product{}, attrs)}
end)
|> Multi.run(:product, fn _, %{changeset: changeset} ->
  Repo.insert(changeset, returning: true)
end)
```

## 2. Writing Outbox Messages

The project uses `Outbox.new/1` to save messages to PostgreSQL (implementing the Outbox pattern). A background worker will then scan this table to execute the messages.

```elixir
|> Multi.run(:changelog, fn _, %{changeset: changeset, product: product} ->
  %{
    queue: "sync_to_questdb",
    args: %{
      action: "products_changelog",
      data: %{
        id: Ecto.UUID.generate(),
        action: "CREATE", # or "UPDATE"
        changes: changeset.changes,
        record_id: product.id,
        site_id: product.site_id,
        account_id: Process.get(:account_id),
        stacktrace: BuilderxApi.Tools.get_stacktrace(),
        inserted_at: product.updated_at
      }
    }
  }
  |> Outbox.new()
end)
```

**Note:** Always pass `account_id` if available (via `Process.get(:account_id)`) and the stacktrace (via `Tools.get_stacktrace()`).
Use configuration flags like `allow_quest_db` or conditionally build the Outbox struct if the business logic requires it.

## 3. Tools Module

For handling input data, contexts frequently leverage the `Tools` module:
- `Tools.is_empty?(list_or_map_or_string)`: Check if a data structure is empty.
- `Tools.to_atom_keys_map(attrs)`: Ensure parameter keys are converted to atoms.
