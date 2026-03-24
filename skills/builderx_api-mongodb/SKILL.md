---
description: Patterns for using MongoDB driver and dynamic collections in BuilderX API
---

# BuilderX API MongoDB Skill

The `builderx_api` project integrates MongoDB via the `mongodb_driver` alongside its primary Postgres (Citus) database. This is used extensively for the *Dynamic Database Collections* feature in `BuilderxApi.DBCollections.DBCollections` (`lib/builderx_api/db_collections/db_collections.ex`).

In this pattern, metadata about the data models (schema) is stored in Postgres (`DBCollection`), but the actual records are physically stored in MongoDB (`MongoRepo`) using a single `records` table separated by `table_name` and `site_id`.

## 1. Interacting with MongoDB Collections

You should generally not interact with `MongoRepo` directly unless you are inside the `builderx_api/db_collections/...` scope. 

Instead, use `DBCollections`:

### Checking if a record exists
```elixir
filters = %{"slug" => "my-record"}

# conn must have assigns for customer, account, or is_check_record_creator as required
DBCollections.exists_record(table_name, filters, db_collection_struct, conn)
# => {:ok, true | false}
```

### Querying records
Retrieves customized results based on dynamic schemas.

```elixir
select = %{"id" => 1, "name" => 1}
filters = %{"status" => "active"}
limit = 10
skip = 0
sort = %{"inserted_at" => -1} # Use 1 for ASC, -1 for DESC
populate = [] # Populate relations if any references are configured
params = %{"site_id" => "site_uuid"}

DBCollections.query_record(
  table_name,
  select,
  filters,
  sort,
  limit,
  skip,
  populate,
  params,
  conn
)
# => List of normalized maps
```

### Inserting records
```elixir
# attrs is a list of map: [%{"field_name" => "name", "field_value" => "Record 1"}]
# Note that we use a custom key format for dynamic mapping.

{:ok, inserted_record} = DBCollections.insert_record(table_name, attrs, params, conn)
```

## 2. Using `MongoRepo` directly

The `BuilderxApi.MongoRepo` is an abstraction over `:mongo` (the `mongodb_driver` pool). 
For some administrative actions, it is called directly:

```elixir
alias BuilderxApi.MongoRepo

table = "records"

# Find
records = MongoRepo.find(table, %{"site_id" => site_id, "table_name" => "users"})

# Find one
record = MongoRepo.find_one(table, %{"_id" => id})

# Update Many
MongoRepo.update_many(
  table,
  %{"site_id" => site_id, "table_name" => "users"},
  %{"$unset" => %{"webcmscol_removed_field" => ""}}
)

# Insert Many
MongoRepo.insert_many(table, list_of_maps)

# Delete Many
MongoRepo.delete_many(table, %{"site_id" => site_id, "table_name" => "users"})
```

### Important Patterns
- `webcmscol_`: The system prepends `webcmscol_` to column names stored in MongoDB to prevent clashes with system variables like `_id`, `site_id`, `table_name`. You will see operations map/unmap this prefix (`DBUtils.sanitize_column_name/1`).
- **Caching Counts**: Because counting documents in Mongo can slowly become a bottleneck, the total document count per site collection is cached in Redis: `db_collection_records::{site_id}`.
- All MongoDB records share the `records` collection but are differentiated by standard root fields: `"site_id"` and `"table_name"`.
