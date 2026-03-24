---
description: Patterns for using Redis caching, PubSub, and Poolboy in BuilderX API
---

# BuilderX API Redis Skill

The `builderx_api` project uses the `redix` library combined with Erlang's `:poolboy` for connection pooling. Standard usages revolve entirely around the `Redis.PubSub` module (`lib/redis/redis_pubsub.ex`).

## 1. General Redis Commands

The `Redis.PubSub` module exposes wrapper functions for common Redis operations. Under the hood, they use `Redix.command/2` within a `:poolboy.transaction/2` call targeting the `:redis_poolex` pool.

### Keys and Strings
```elixir
# GET a key
{:ok, value} = Redis.PubSub.get("my_key")

# SET a key
{:ok, "OK"} = Redis.PubSub.set("my_key", "value")

# SET a key with expiration (in seconds)
{:ok, "OK"} = Redis.PubSub.set("my_key", "value", 3600)

# Delete keys
{:ok, deleted_count} = Redis.PubSub.del("my_key")
{:ok, deleted_count} = Redis.PubSub.del(["key1", "key2"])

# Expire an existing key
{:ok, 1} = Redis.PubSub.expire("my_key", 60)
```

### Counters
```elixir
# Increment by 1
{:ok, new_val} = Redis.PubSub.incr("visits")

# Increment by N
{:ok, new_val} = Redis.PubSub.incr("visits", 5)
```

### Hash Maps
```elixir
# Increment a field inside a hash
{:ok, new_val} = Redis.PubSub.hincrby("user:123", "login_count", 1)

# Get a field from a hash
{:ok, value} = Redis.PubSub.hget("user:123", "name")

# Get entire hash
{:ok, list_of_pairs} = Redis.PubSub.hgetall("user:123")
```

### Sets
```elixir
# Add to Set
{:ok, added_count} = Redis.PubSub.sadd("my_set", "item1")
{:ok, added_count} = Redis.PubSub.sadd("my_set", ["item2", "item3"])

# Remove from Set
{:ok, removed_count} = Redis.PubSub.srem("my_set", "item1")
{:ok, removed_count} = Redis.PubSub.srem("my_set", ["item2", "item3"])

# Get all members
{:ok, members} = Redis.PubSub.smembers("my_set")
```

## 2. Transactions

You can execute Redis commands transactionally via `MULTI` and `EXEC` using the wrappers:

```elixir
Redis.PubSub.transaction() # Sends MULTI
Redis.PubSub.set("key1", "val1")
Redis.PubSub.set("key2", "val2")
Redis.PubSub.commit() # Sends EXEC
```

*Note: Since these execute under standard HTTP pools without locking the connection strictly contextually in the Redix API wrappers mapped here, be cautious when using Redis transactions via standard global pool dispatch; ensure your pipeline design handles concurrency correctly.*

## 3. PubSub Features

Through `:redis_pubsub` pool, builderx_api can support pub-sub channels.

```elixir
# To subscribe the current process to a channel
Redis.PubSub.subscribe("chat_room_1", self())

# To unsubscribe
Redis.PubSub.unsubscribe("chat_room_1", self())

# To publish to a channel
{:ok, subscribers_received} = Redis.PubSub.publish("chat_room_1", "Hello World!")
```
