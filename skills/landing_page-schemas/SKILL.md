---
name: landing_page-schemas
description: Guidelines for creating Ecto Schemas in landing_page_backend, including binary UUID primary keys, virtual fields, custom json/1 function, and multiple changeset patterns.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend
---

# Landing Page — Ecto Schemas

> Ecto Schema conventions for the Landing Page Backend (Phoenix 1.5 + PostgreSQL).

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Schema Definition | Binary UUID primary key, fields, virtual fields, associations | [core-schema](references/core-schema.md) |
| JSON Serialization | Custom `json/1` and `json/2` with association safety | [core-schema](references/core-schema.md) |
| Changesets | Multiple changeset variants: normal, strict, passive | [core-schema](references/core-schema.md) |

## Quick Reference

```elixir
defmodule LandingPage.Pages.Page do
  use Ecto.Schema
  import Ecto.Changeset

  alias LandingPage.Pages.{PageVersion, PagePublished}
  alias LandingPage.Accounts.Account
  alias LandingPage.Organizations.Organization
  alias LandingPage.Permissions.PageAccountPermission

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "pages" do
    field(:name, :string)
    field(:data, :map, default: %{})
    field(:settings, :map, default: %{})
    field(:status, :integer, default: 1)        # >0 active, <0 banned, ==0 deleted
    field(:custom_domain, :string)
    field(:custom_path, :string)

    # Virtual fields — computed, NOT stored in DB
    field(:conversion_rate, :float, virtual: true)
    field(:total_submissions, :integer, virtual: true)

    belongs_to(:owner, Account, type: Ecto.UUID)
    belongs_to(:organization, Organization)
    has_many(:versions, PageVersion)
    has_one(:published, PagePublished, foreign_key: :page_id)
    has_many(:shared_accounts, PageAccountPermission)

    timestamps()
  end

  # --- Standard changeset ---
  def changeset(%__MODULE__{} = page, attrs) do
    page
    |> cast(attrs, [:name, :data, :settings, :status, :owner_id, :organization_id,
                     :custom_domain, :custom_path])
    |> validate_required([:status])
    |> unique_constraint(:domain_custom,
      name: "pages_custom_domain_custom_path_index",
      message: "Tên miền với đường dẫn này đã tồn tại"
    )
  end

  # --- Passive changeset — casts ALL schema fields (dùng cho sync/replication) ---
  def passive_changeset(%__MODULE__{} = page, attrs) do
    fields = __schema__(:fields)
    page
    |> cast(attrs, fields)
    |> validate_required([:status])
  end

  # --- JSON serialization ---
  def json(%__MODULE__{} = page) do
    res = Map.take(page, [:id, :name, :data, :settings, :status, :custom_domain, :custom_path,
                           :inserted_at, :updated_at])

    # Safely handle associations (chỉ include khi đã preload)
    res = case Map.fetch(page, :shared_accounts) do
      {:ok, %Ecto.Association.NotLoaded{}} -> res
      {:ok, perms} ->
        accounts = Enum.map(perms, fn el ->
          Map.put(Account.json(el.account) || %{}, :permission, el.permission)
        end)
        Map.put(res, :shared_with, accounts)
      _ -> res
    end

    res = case Map.fetch(page, :owner) do
      {:ok, %Ecto.Association.NotLoaded{}} -> res
      {:ok, owner} -> Map.put(res, :owner, Account.json(owner))
      _ -> res
    end

    res
  end

  def json(nil), do: nil
  def json(list) when is_list(list), do: Enum.map(list, &json/1)
end
```
