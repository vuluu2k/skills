---
name: core-multi-outbox
description: Ecto.Multi transaction patterns and Outbox event messaging for async processing
---

# Transactions & Outbox — Landing Page Backend

## 1. Ecto.Multi

Dùng `Ecto.Multi` khi cần thực hiện nhiều DB operations trong 1 transaction:

```elixir
alias Ecto.Multi

multi = Multi.new()
  |> Multi.run(:page, fn _, _ ->
    Pages.create_page(%{name: name, owner_id: account_id})
  end)
  |> Multi.run(:version, fn _, %{page: page} ->
    Pages.create_version(%{page_id: page.id, data: data})
  end)
  |> Multi.run(:permission, fn _, %{page: page} ->
    Organizations.grant_page_right(page.id, account_id, :owner)
  end)

case Repo.transaction(multi) do
  {:ok, %{page: page, version: version}} ->
    {:success, :with_data, "page", Page.json(page)}
  {:error, :page, changeset, _} ->
    {:error, changeset}
  {:error, step, reason, _changes} ->
    {:failed, :with_reason, "Failed at #{step}"}
end
```

### Rules

- Mỗi step trả `{:ok, value}` → tiếp tục. Trả `{:error, reason}` → rollback.
- Step name = atom mô tả resource (`:page`, `:version`, `:permission`)
- Steps sau access kết quả steps trước qua map destructuring: `%{page: page}`
- Dùng `Multi.run/3` cho logic phức tạp, `Multi.insert/3` cho simple inserts

### Multi.insert vs Multi.run

```elixir
# Simple insert
Multi.new()
  |> Multi.insert(:page, Page.changeset(%Page{}, attrs))

# Complex logic
Multi.new()
  |> Multi.run(:page, fn _, _ ->
    # Custom logic here
    Pages.create_page(attrs)
  end)
```

## 2. Outbox Pattern

Project dùng Outbox pattern cho reliable async messaging. Outbox messages được tạo trong transaction cùng với business data:

```elixir
multi = Multi.new()
  |> Multi.run(:resource, fn _, _ ->
    Resources.create(attrs)
  end)
  |> Multi.run(:outbox, fn _, %{resource: resource} ->
    Outbox.new(%{
      queue: "sync_form_data",
      args: %{
        page_id: resource.page_id,
        order_id: resource.id,
        account_id: account_id
      }
    })
  end)
```

### Outbox Worker

Outbox Worker xử lý messages với distributed locking qua Redis:

```elixir
defmodule LandingPage.Outbox.Worker do
  @lock_timeout 10

  def assign(job) do
    case lock(job) do
      {:ok, "OK"} ->
        res = perform(job)
        release_lock(job)
        res
      _ ->
        :nothing  # Đã có worker khác đang xử lý
    end
  end

  # Pattern match trên queue name
  defp lock(%{queue: "affiliate_form", args: args}) do
    key = "outbox.lock.affiliate_form.#{args["order_id"]}"
    Redis.PubSub.command(["SET", key, 1, "NX", "EX", @lock_timeout])
  end

  defp lock(%{args: args}) do
    key = "outbox.lock.#{args["order_id"]}"
    Redis.PubSub.command(["SET", key, 1, "NX", "EX", @lock_timeout])
  end

  # Dispatch by queue name
  defp perform(%{queue: "sync_form_data", args: args}) do
    FormDataWorker.sync(args)
  end

  defp perform(%{queue: "update_affiliate_form_status", args: args}) do
    FormDataWorker.update_affiliate_form_status(args)
  end
end
```

### Redis Distributed Lock

Dùng Redis `SET NX EX` để đảm bảo chỉ 1 worker xử lý 1 job:

```elixir
# SET key value NX (only if not exists) EX timeout_seconds
Redis.PubSub.command(["SET", lock_key, 1, "NX", "EX", @lock_timeout])
# {:ok, "OK"} nếu lock thành công
# {:ok, nil} nếu đã bị lock bởi worker khác
```

## 3. Tools Module

Module `LandingPage.Tools` cung cấp utility functions:

- `Tools.randomizer(length)` — random string
- `Tools.shift_from_day_to_day(datetime, days)` — date arithmetic
- `Tools.to_integer(value)` — safe integer conversion

<!--
Source references:
- lib/landing_page/outbox/worker.ex
- lib/landing_page_web/controllers/v1/organizations/organization_controller.ex
- lib/landing_page/services/page_service.ex
-->
