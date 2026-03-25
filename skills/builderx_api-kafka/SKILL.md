---
name: builderx_api-kafka
description: Patterns for using Kafka (:brod), creating producers, consumers, and offset management in BuilderX API
metadata:
  author: Vũ Lưu
  version: "2026.03.25"
  source: Source code builderx_api
---

# BuilderX API Kafka Skill

The `builderx_api` project uses the `:brod` Erlang package for interacting with Kafka. The central coordination module is `Kafka` (`lib/kafka/kafka.ex`), which starts the `:brod` client and registers producers and consumers under its supervisor.

## 1. Creating a New Consumer

When you need to consume data from a new Kafka topic, follow the pattern established in `Kafka.QuestConsumer`. You need a GenServer that subscribes to `:brod` and relies on Redis to manage consumer offsets.

### Example Structure (`lib/kafka/my_new_consumer.ex`):

```elixir
defmodule Kafka.MyNewConsumer do
  use GenServer
  import Record, only: [defrecord: 2, extract: 2]

  alias BuilderxApi.{Tools}

  @topic "my.new.kafka.topic"
  @prefetch_count 5

  defmodule State do
    @enforce_keys [:consumer_pid, :partition]
    defstruct consumer_pid: nil, partition: nil
  end

  defmodule KafkaMessage do
    @enforce_keys [:offset, :key, :value, :ts]
    defstruct offset: nil, key: nil, value: nil, ts: nil
  end

  defrecord :kafka_message, extract(:kafka_message, from_lib: "brod/include/brod.hrl")
  defrecord :kafka_message_set, extract(:kafka_message_set, from_lib: "brod/include/brod.hrl")
  defrecord :kafka_fetch_error, extract(:kafka_fetch_error, from_lib: "brod/include/brod.hrl")

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts)
  end

  def init({client_id, partition}) do
    consumer_config = [
      prefetch_count: @prefetch_count,
      max_bytes: @prefetch_count * 1024, # 1KB
      max_wait_time: 0
    ]

    :ok = :brod.start_consumer(client_id, @topic, consumer_config)

    {:ok, consumer_pid} = :brod.subscribe(client_id, self(), @topic, partition, consumer_config)

    # Trigger the first fetch manually from Redis offset 
    Process.send(self(), {:fetch_message}, [])

    {:ok, %State{consumer_pid: consumer_pid, partition: partition}}
  end

  # Receive fetched messages
  def handle_info(
    {consumer_pid, kafka_message_set(messages: msgs)},
    %State{consumer_pid: consumer_pid, partition: partition} = state
  ) do
    msgs = Enum.map(msgs, &kafka_message_to_struct(&1))

    Enum.each(msgs, fn msg -> 
      # Decode and process your message here
      try do
        parsed = Jason.decode!(msg.value)
        # process parsed data...
      rescue _ -> nil
      end
    end)

    # Acknowledge messages and update Redis offset
    for msg <- msgs do
      key = "kafka_topic:#{@topic}:#{partition}"
      Redis.PubSub.set(key, msg.offset)
      :brod.consume_ack(consumer_pid, msg.offset)
    end

    {:noreply, state}
  end

  # Handle fetch errors
  def handle_info({_pid, kafka_fetch_error()} = error, state) do
    Logger.error("KAFKA: my_consumer fetch error #{inspect(error)}")
    {:noreply, state}
  end

  # Fetch initially using the offset saved in Redis
  def handle_info({:fetch_message}, %State{partition: partition} = state) do
    host = System.get_env("KAFKA1_HOST")
    port = System.get_env("KAFKA1_PORT") |> String.to_integer()
    bootstrapEndpoints = [{host, port}]

    key = "kafka_topic:#{@topic}:#{partition}"
    {:ok, offset} = Redis.PubSub.get(key)
    offset = Tools.to_int(offset)

    with {:ok, batch} <- :brod.fetch(bootstrapEndpoints, @topic, partition, offset, %{}) do
      {latest_offset, msgs} = batch

      Enum.each(msgs, fn msg ->
        msg = kafka_message_to_struct(msg)
        # Often we just resend the message, or process it immediately.
        # This behaves as a synchronization mechanism on start.
      end)

      Redis.PubSub.set(key, latest_offset)
    end

    {:noreply, state}
  end

  defp kafka_message_to_struct(kafka_message(offset: offset, key: key, value: value, ts: ts)) do
    %KafkaMessage{
      offset: offset,
      key: key,
      value: value,
      ts: DateTime.from_unix!(ts, :millisecond)
    }
  end
end
```

## 2. Registering the Consumer

Consumer registration is done in `lib/kafka/kafka.ex` based on the hostname, to support distinct consumer groups and parallel partition processing.

1. Ensure the `:brod` client has the client_id `:kafka_client`.
2. Find the correct worker hostname conditions (e.g., `publish-consumer-01`, `publish-consumer-02`). 
3. Note how the *second argument* often denotes the Kafka **partition** index. For `publish-consumer-01`, it's usually `0`; for `publish-consumer-02`, it's `1`, etc.
   
```elixir
      "publish-consumer-01" ->
        [
          {KafkaProducer, {:kafka_client}},
          {Kafka.QuestConsumer, {:kafka_client, 0}},
          {Kafka.MyNewConsumer, {:kafka_client, 0}}  # <--- Add your consumer for partition 0
        ]

      "publish-consumer-02" ->
        [
          {KafkaProducer, {:kafka_client}},
          {Kafka.QuestConsumer, {:kafka_client, 1}},
          {Kafka.MyNewConsumer, {:kafka_client, 1}}  # <--- Add your consumer for partition 1
        ]
```

## 3. Publishing Messages

All topics you wish to publish to must be registered in `@topics` in `lib/kafka/kafka_producer.ex`.

In `lib/kafka/kafka_producer.ex`:
```elixir
  @topics [
    "store.cache.agg_products",
    "store.queuing.questdb",
    "my.new.kafka.topic"  # <--- Register new topic
  ]
```

To publish a message, use `KafkaProducer.publish/4`:

```elixir
topic = "my.new.kafka.topic"
partition = 0  # Generally, you need to manage partition distribution (e.g., hash the key)
key = "your_message_key"
message = Jason.encode!(%{hello: "world"})

# Send synchronously
:ok = KafkaProducer.publish(topic, partition, key, message)
```
