---
name: landing_page-controllers
description: Guide to Phoenix Controller structure in landing_page_backend using FallbackController, tuple responses, and permission plugs.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend
---

# Landing Page — Controllers

> Phoenix Controller conventions for Landing Page Backend.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| FallbackController | Centralized response handling via tuples | [core-fallback](references/core-fallback.md) |
| Permission Plugs | Action-level permission guards | [core-fallback](references/core-fallback.md) |
| Ecto.Multi in Controllers | Transactional operations across multiple steps | [core-fallback](references/core-fallback.md) |

## Quick Reference

```elixir
defmodule LandingPageWeb.V1.OrganizationController do
  use LandingPageWeb, :controller

  alias Ecto.Multi
  alias LandingPage.{Tools, Organizations, Repo}
  alias LandingPage.Organizations.{Organization, OrganizationMember}

  # Permission plugs — chỉ áp dụng cho specific actions
  plug LandingPageWeb.Plug.PermissionCheck,
       [role: :organization_admin, type: :organization]
       when action in [:bulk_update_rights, :update_invite_code]

  plug LandingPageWeb.Plug.SubscriptionPlug
       when action in [:create_organization]

  action_fallback LandingPageWeb.FallbackController

  def create_organization(conn, %{"name" => name}) do
    account = conn.assigns.account
    invite_code = Tools.randomizer(3) <> "-" <> Tools.randomizer(1) <> "-" <> Tools.randomizer(2)

    multi = Multi.new()
      |> Multi.run(:organization, fn _, _ ->
        Organizations.create_organization(%{
          name: name, owner_id: account.id,
          settings: %{sync: %{sync_draft_to_pos: true}},
          invite_code: invite_code
        })
      end)
      |> Multi.run(:organization_members, fn _, %{organization: org} ->
        Organizations.create_organization_members(org.id, account.id,
          Enum.OrganizationPermission.value(:organization_owner))
      end)

    case Repo.transaction(multi) do
      {:ok, result} ->
        org = Repo.preload(result.organization, :owner)
        {:success, :with_data, "organization", Organization.json(org)}
      _ ->
        {:failed, :with_reason, "Create Organization Failed! ERROR CODE: CO0001"}
    end
  end

  def list_organizations(conn, params) do
    account = conn.assigns.account
    case Organizations.get_organizations(account.id, params) do
      {:ok, orgs} ->
        {:success, :with_data, "organizations", Enum.map(orgs, &Organization.json/1)}
      _ ->
        {:failed, :with_reason, "Failed to get organizations"}
    end
  end
end
```
