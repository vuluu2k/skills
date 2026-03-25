---
name: builderx_api-schemas
description: Guidelines for creating Ecto Schemas in builderx_api, including composite primary keys, custom json function and Ecto.Changeset.
metadata:
  author: Vũ Lưu
  version: "2026.03.25"
  source: Source code builderx_api
---

# BuilderX API Schemas

> Conventions and structures for defining Ecto Schemas in the builderx_api project.

## Core

| Topic | Description | Reference |
|-------|-------------|-----------|
| Schema Definition | Primary keys, site_id attribute, timestamps | [core-schema](references/core-schema.md) |
| JSON Serialization | Custom `json/1` and `json/2` implementation in Ecto Schema | [core-schema](references/core-schema.md) |

## Quick Reference

```elixir
defmodule BuilderxApi.Products.Product do
  use Ecto.Schema
  import Ecto.Changeset

  alias BuilderxApi.Sites.Site

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  @non_required_fields [:id, :inserted_at, :updated_at]

  schema "products" do
    belongs_to(:site, Site, type: Ecto.UUID, primary_key: true)
    
    field :name, :string
    
    timestamps(type: :utc_datetime_usec)
  end

  def changeset(%__MODULE__{} = product, attrs \\ %{}) do
    fields = __schema__(:fields) -- @non_required_fields

    product
    |> cast(attrs, fields)
    |> validate_required([:site_id, :name])
  end

  # Custom serializer instead of using Phoenix Views
  def json(%__MODULE__{} = product) do
    fields = __schema__(:fields)
    data = Map.take(product, fields)

    data =
      case Map.fetch(product, :site) do
        {:ok, %Ecto.Association.NotLoaded{}} ->
          data

        {:ok, value} ->
          Map.put(data, :site, Site.json(value))

        _ ->
          data
      end

    data
  end

  def json(products) when is_list(products) do
    Enum.map(products, &json(&1))
  end

  def json(_), do: nil
end
```
