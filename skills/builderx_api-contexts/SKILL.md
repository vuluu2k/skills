---
name: builderx_api-contexts
description: Guide to Context logic structure in builderx_api.
metadata:
  author: Vũ Lưu
  version: "2026.03.25"
  source: Source code builderx_api
---

# BuilderX API Contexts

> Conventions and structure for Ecto Contexts in the builderx_api project.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Transactions and Outbox | Using Ecto.Multi for complex logic and logging Outbox messages | [core-multi-outbox](references/core-multi-outbox.md) |

## Quick Reference

```elixir
defmodule BuilderxApi.SomeContext do
  alias BuilderxApi.Citus, as: Repo
  alias BuilderxApi.{Tools, Outbox}
  alias Ecto.Multi

  def create_something(attrs \\ %{}) do
    multi =
      Multi.new()
      |> Multi.run(:changeset, fn _, _ ->
        # Generate changeset
        {:ok, Something.changeset(%Something{}, attrs)}
      end)
      |> Multi.run(:insert, fn _, %{changeset: changeset} ->
        # Handle insert
        Repo.insert(changeset, returning: true)
      end)
      |> Multi.run(:changelog, fn _, %{changeset: changeset, insert: insert_res} ->
        # Write outbox log
        %{
          queue: "sync_to_questdb",
          args: %{
            action: "something_changelog",
            data: %{
              id: Ecto.UUID.generate(),
              action: "CREATE",
              changes: changeset.changes,
              record_id: insert_res.id,
              site_id: insert_res.site_id,
            }
          }
        }
        |> Outbox.new()
      end)

    case Repo.transaction(multi) do
      {:ok, res} -> {:ok, res.insert}
      err -> {:error, err}
    end
  end
end
```
