---
name: landing_page-contexts
description: Guide to Context module patterns in landing_page_backend — Ecto queries, dynamic query building, Ecto.Multi, and Outbox messaging.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend
---

# Landing Page — Contexts

> Context module conventions for business logic, queries, and transactions.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Query Building | Ecto.Query, from macros, select fields, dynamic queries | [core-queries](references/core-queries.md) |
| Transactions & Outbox | Ecto.Multi transactions with Outbox messaging | [core-multi-outbox](references/core-multi-outbox.md) |

## Quick Reference

```elixir
defmodule LandingPage.Pages do
  import Ecto.Query, warn: false
  alias LandingPage.{Repo, Tools}
  alias LandingPage.Pages.{Page, PageVersion, PagePublished}
  alias LandingPage.Organizations.{PageRight, TeamPage}
  alias LandingPage.Permissions.PageAccountPermission

  @light_page_fields [
    :id, :status, :html, :css, :head, :settings, :extra_script, :extra_css,
    :inserted_at, :updated_at, :organization_id
  ]

  # --- Simple query ---
  def get_page(page_id) do
    case Repo.get(Page, page_id) do
      nil -> {:error, :not_found}
      page -> {:ok, page}
    end
  end

  # --- Query with preloads ---
  def get_page_detail(%Page{} = page) do
    page_id = Ecto.UUID.cast!(page.id)

    query_shared = from pap in PageAccountPermission, preload: [:account]
    query_pub = from pp in PagePublished, select: [:domain, :path, :status]

    query = from p in Page,
      where: p.id == ^page_id,
      preload: [:owner, shared_accounts: ^query_shared, published: ^query_pub]

    Repo.one(query)
  end

  # --- Optimized select ---
  def get_page_by_custom_domain(host, path) do
    query = from p in Page,
      where: p.custom_domain == ^host and p.custom_path == ^path
             and p.status == ^Enum.PageStatus.value(:active),
      select: ^@light_page_fields

    if res = Repo.one(query), do: {:ok, res}, else: {:error, :not_found}
  end

  # --- Dynamic query ---
  def search_form_data(page_id, filters) do
    dyn = dynamic([f], f.page_id == ^page_id)

    dyn = if phone = filters["phone_number"] do
      dynamic([f], ^dyn and f.phone_number == ^phone)
    else
      dyn
    end

    dyn = if status = filters["status"] do
      dynamic([f], ^dyn and f.status == ^status)
    else
      dyn
    end

    from(f in PageFormData, where: ^dyn, order_by: [desc: :inserted_at])
    |> Repo.all()
  end
end
```
