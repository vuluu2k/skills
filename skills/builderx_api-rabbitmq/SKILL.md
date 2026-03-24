---
description: Patterns for using RabbitMQ (AMQP), creating consumers/workers, and publishing messages in BuilderX API
---

# BuilderX API RabbitMQ Skill

The `builderx_api` project uses the `amqp` package for interacting with RabbitMQ. All RabbitMQ operations orbit around the central `Rabbit` (`lib/rabbit/rabbit.ex`) module, which handles connection pooling, establishing connection channels automatically, and distributing work to supervisors. 

## 1. Creating a New Consumer (Worker)

When you need to create a new background worker to consume events from RabbitMQ, you should structure it following the existing consumer patterns (e.g., `OrderConsumer`, `IndexingConsumer`). This includes subscribing to a queue, setting prefetch count, configuring dead letter queues for errors, and optionally configuring wait queues for retry logic.

### Example Structure (`lib/rabbit/my_new_consumer.ex`):

```elixir
defmodule Rabbit.MyNewConsumer do
  require Logger
  use GenServer
  use AMQP

  alias BuilderxApi.Tools
  alias Rabbit
  alias Worker.MainWorker

  @queue_base   "my_new_queue_name"
  @storecake_v2_exchange "storecake_v2_ex"
  @storecake_v2_exchange_deadletter "storecake_v2_ex_deadletter"
  @sync_queue_error "my_new_queue_error"
  @prefetch_count 20

  # Client API
  def start_link() do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def child_spec(_args) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, []}
    }
  end

  def channel_available(chan) do
    GenServer.cast(__MODULE__, {:channel_available, chan})
  end

  def consumer_tag() do
    {:ok, hostname} = :inet.gethostname()
    "#{hostname}-my-new-consumer"
  end

  # Server Callbacks
  def init(:ok) do
    # Request a channel once the gen server is initialized
    Rabbit.request_channel(__MODULE__)
    {:ok, nil}
  end

  def publish(payload) do
    GenServer.cast(__MODULE__, {:publish, payload})
  end

  def handle_cast({:publish, payload}, channel) do
    # When publishing directly through this consumer's channel
    message = Jason.decode!(payload)
    queue = get_queue(message)

    AMQP.Basic.publish(channel, @storecake_v2_exchange, queue, payload, persistent: true)

    {:noreply, channel}
  end

  def handle_cast({:channel_available, channel}, _state) do
    Logger.info("CHANNEL_AVAILABLE FOR MY NEW CONSUMER")

    Basic.qos(channel, prefetch_count: @prefetch_count)

    Queue.declare(channel, @queue_base,
      durable: true,
      arguments: [
        {"x-dead-letter-exchange", :longstr, @storecake_v2_exchange_deadletter},
        {"x-dead-letter-routing-key", :longstr, @sync_queue_error}
      ]
    )

    # Note: If implementing retries with delayed messages, declare wait queues here 
    # and bind them as in OrderConsumer.ex.
    
    Queue.bind(channel, @queue_base, @storecake_v2_exchange, routing_key: @queue_base)
    Queue.bind(channel, @sync_queue_error, @storecake_v2_exchange, routing_key: @sync_queue_error)

    {:ok, _consumer_tag} = Basic.consume(channel, @queue_base, self(), consumer_tag: consumer_tag())

    {:noreply, channel}
  end

  # Basic AMQP handlers...
  def handle_info({:basic_consume_ok, %{consumer_tag: _consumer_tag}}, chan), do: {:noreply, chan}
  def handle_info({:basic_cancel, %{consumer_tag: _consumer_tag}}, chan), do: {:stop, :normal, chan}
  def handle_info({:basic_cancel_ok, %{consumer_tag: _consumer_tag}}, chan), do: {:noreply, chan}

  def handle_info({:basic_deliver, payload, %{delivery_tag: tag, redelivered: redelivered}}, chan) do
    spawn(fn -> consume(chan, tag, redelivered, payload) end)
    {:noreply, chan}
  end

  def consume(chan, tag, _redelivered, payload) do
    try do
      # Pass data to your worker implementation
      MainWorker.assign(Jason.decode!(payload))
    rescue
      e -> on_error(payload, e, __STACKTRACE__)
    after
      AMQP.Basic.ack(chan, tag)
    end
  end

  def on_error(message, exception, stacktrace \\ []) do
    Logger.error("Error consuming message: #{inspect(exception)}")
    # Trigger retry logic if applicable using RabbitMq delayed messages
  end

  def get_queue(_payload) do
     @queue_base
  end
end
```

## 2. Registering the Worker

After creating the worker, **you MUST register it in the `Rabbit` supervisor** (`lib/rabbit/rabbit.ex`), otherwise it will not start and not consume any queues.

Open `lib/rabbit/rabbit.ex` and:

1. Alias your new consumer at the top:
   ```elixir
   alias Rabbit.{
     ProductConsumer,
     OrderConsumer,
     # ...
     MyNewConsumer
   }
   ```
2. In the `init(:ok)` function, append it to the `children` list for the specific worker hostnames (e.g., `store-worker-01`, `store-worker-02`). 

   ```elixir
     "store-worker-01" ->
       [
         {ProductConsumer, []},
         {OrderConsumer, []},
         # ... existing consumers ...
         {MyNewConsumer, []}  # <------ Add here
       ]
   ```

## 3. Publishing Messages

To publish a message from any location in the application without needing a specific consumer channel or `handle_cast` call, use the general `Rabbit.publish_message/2` helper provided in `Rabbit`:

```elixir
message_payload = %WorkerMessage{
  action: "sync_something_new", 
  turn: 0, 
  data: %{id: 123, status: "pending"}
}

# The queue name should match a binding routing key in your consumer setup
Rabbit.publish_message(message_payload, "my_new_queue_name")
```
