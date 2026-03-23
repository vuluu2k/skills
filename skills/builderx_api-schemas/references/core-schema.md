---
name: core-schema
description: Mandatory configurations when creating Ecto Schemas in builderx_api.
---

# Core Schema

Standard conventions for declaring a Schema in builderx_api.

## 1. Composite Primary Key

In `builderx_api`, most tables use a composite primary key consisting of `id` and `site_id`. This helps isolate data by site (sharding).

```elixir
@primary_key {:id, :binary_id, autogenerate: true}

schema "table_name" do
  belongs_to(:site, Site, type: Ecto.UUID, primary_key: true)
  # ... other columns
end
```

## 2. Timestamps

Use the timestamp type with microseconds precision (`utc_datetime_usec`):

```elixir
timestamps(type: :utc_datetime_usec)
```

## 3. JSON Serialization

The project **does not use** Phoenix's `views` directory to render JSON API responses for entities. Instead, each Ecto Schema implements its own `json/1` or `json/2` function to serialize the Ecto struct into a map.

```elixir
def json(%__MODULE__{} = product) do
  # Get all declared schema fields
  fields = __schema__(:fields)
  data = Map.take(product, fields)
  
  # Serialize associations safely if they are loaded
  data =
    case Map.fetch(product, :categories) do
      {:ok, %Ecto.Association.NotLoaded{}} ->
        data

      {:ok, value} ->
        Map.put(data, :categories, Category.json(value))

      _ ->
        data
    end
    
  data
end

def json(products) when is_list(products) do
  Enum.map(products, &json(&1))
end

def json(_), do: nil
```

## 4. Changeset and Cast Fields

To avoid listing all fields manually when calling `cast/3` in the `changeset`, the project defines a module attribute `@non_required_fields` and subtracts these fields from `__schema__(:fields)`.

```elixir
@non_required_fields [:id, :inserted_at, :updated_at]

def changeset(%__MODULE__{} = model, attrs \\ %{}) do
  fields = __schema__(:fields) -- @non_required_fields

  model
  |> cast(attrs, fields)
  |> validate_required([:site_id, :name]) # Validate required fields
end
```
