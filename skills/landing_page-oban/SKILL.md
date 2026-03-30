---
name: landing_page-oban
description: Patterns for creating Oban background workers in landing_page_backend — queue configuration, job arguments, retry strategies, and dynamic query processing.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend
---

# Landing Page — Oban Workers

> Oban v2.10 background job patterns for async processing.

## 1. Creating a New Worker

```elixir
defmodule LandingPage.Oban.SyncPosWorker do
  use Oban.Worker,
    queue: :sync_pos,         # Queue name (atom)
    priority: 0,              # 0 = highest priority
    max_attempts: 1000,       # Retry count
    tags: ["sync_pos"]        # Tags for monitoring

  import Ecto.Query, warn: false

  alias LandingPage.{Repo, FormData, Tools}
  alias LandingPage.Services.PosService
  alias LandingPage.Syncs.SyncInfo
  alias LandingPage.FormData.PageFormData

  @impl Oban.Worker
  def perform(%{args: args} = _job) do
    %{"page_id" => page_id, "order_id" => order_id} = args

    # 1. Fetch required data
    sync_info = SyncInfo
      |> where([s], s.page_id == ^page_id and not s.is_deleted)
      |> Repo.one()

    order = case FormData.get_form_data(order_id) do
      {:ok, v} -> v
      _ -> nil
    end

    # 2. Process
    cond do
      sync_info && order ->
        sync_info = PosService.get_sync_info_stable(sync_info)
        settings = sync_info.settings

        # 3. Check for duplicates with dynamic query
        pending = if order.phone_number && settings["allow_merge_duplicate_form_data"] do
          back_day = NaiveDateTime.utc_now() |> Tools.shift_from_day_to_day(-7)

          dyn_query = dynamic([pfd],
            pfd.inserted_at > ^back_day and
            pfd.phone_number == ^order.phone_number and
            pfd.sync_pos_status != ^Enum.SyncPosStatus.value(:synced)
          )

          count = PageFormData
            |> where([pfd], ^dyn_query)
            |> select([pfd], count("*"))
            |> Repo.one()

          count > 0
        else
          false
        end

        # 4. Execute or defer
        if !pending do
          case PosService.update_pos_form_data(page_id, order_id) do
            :ok -> {:ok, :success}
            {:ok, _} -> {:ok, :success}
            e -> {:error, e}
          end
        else
          {:error, :pending}
        end

      true ->
        :ok  # Nothing to process
    end
  end
end
```

## 2. Enqueueing Jobs

```elixir
# Basic enqueue
%{page_id: page_id, order_id: order_id}
|> LandingPage.Oban.SyncPosWorker.new()
|> Oban.insert()

# With schedule (delay)
%{page_id: page_id, order_id: order_id}
|> LandingPage.Oban.SyncPosWorker.new(schedule_in: 60)  # 60 seconds
|> Oban.insert()

# With priority override
%{page_id: page_id}
|> LandingPage.Oban.SyncPosWorker.new(priority: 3)
|> Oban.insert()

# Inside Ecto.Multi (transactional)
Multi.new()
  |> Multi.run(:resource, fn _, _ -> create_resource(attrs) end)
  |> Multi.run(:oban_job, fn _, %{resource: resource} ->
    %{resource_id: resource.id}
    |> MyWorker.new()
    |> Oban.insert()
  end)
  |> Repo.transaction()
```

## 3. Worker Return Values

| Return | Behavior |
|--------|----------|
| `:ok` | Job completed successfully |
| `{:ok, value}` | Job completed successfully |
| `{:error, reason}` | Job failed — sẽ retry theo `max_attempts` |
| `{:cancel, reason}` | Job cancelled — KHÔNG retry |
| `{:snooze, seconds}` | Delay rồi retry sau `seconds` giây |

## 4. Existing Queues

| Queue | Purpose |
|-------|---------|
| `:sync_pos` | Sync form data to POS systems |
| `:sync_sheet` | Sync to Google Sheets |
| `:sync_crm` | Sync to CRM services |
| `:email` | Send emails |
| `:image_processing` | Image optimization/background removal |
| `:page_publish` | Page publishing pipeline |

## 5. Important Patterns

- **Args phải serializable**: Chỉ dùng strings, numbers, maps, lists trong args. KHÔNG dùng structs hay atoms.
- **Idempotent**: Worker phải handle được việc chạy lại (duplicate-safe).
- **Dynamic queries trong worker**: Dùng `dynamic()` macro cho conditional filtering (xem ví dụ trên).
- **Hostname-based distribution**: Một số workers chỉ chạy trên specific servers dựa vào hostname.

```elixir
# Trong application.ex — conditional worker start
{:ok, host} = :inet.gethostname()
strhost = :erlang.iolist_to_binary(host)

children = if strhost == "lp-backend-01" do
  children ++ [LandingPage.Scheduler]
else
  children
end
```

<!--
Source references:
- lib/oban/sync_pos_worker.ex
- lib/oban/ (các worker files khác)
- lib/landing_page/application.ex
-->
