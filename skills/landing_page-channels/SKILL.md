---
name: landing_page-channels
description: Phoenix Channel patterns in landing_page_backend — real-time collaboration, WebSocket topics, broadcasting, and channel structure.
metadata:
  author: Vũ Lưu
  version: "2026.03.30"
  source: Source code landing_page_backend
---

# Landing Page — Phoenix Channels

> WebSocket channel patterns for real-time features (page editing, form notifications, collaborator presence).

## 1. Channel Structure

```elixir
defmodule LandingPageWeb.PageChannel do
  use Phoenix.Channel

  alias LandingPage.FormData.PageFormData
  alias LandingPageWeb.Endpoint
  alias LandingPage.FormData

  # Join với topic pattern matching
  def join("page:" <> _page_id, _message, socket) do
    {:ok, socket}
  end

  # Handle incoming events từ client
  def handle_in("update_page", %{"data" => data}, socket) do
    "page:" <> page_id = socket.topic

    # Process update...

    # Broadcast tới tất cả subscribers trừ sender
    broadcast!(socket, "page_updated", %{data: data})

    {:noreply, socket}
  end

  # Module function cho server-side broadcasting
  def update_forms_data(page_id, form_id) do
    case FormData.get_form_data(form_id, preload_page: true) do
      {:ok, form_data} ->
        data = %{form_data: PageFormData.json(form_data)}

        # Broadcast tới specific page channel
        Endpoint.broadcast("page:" <> page_id, "submit_form_success", data)

        # Broadcast tới global form data channel
        Endpoint.broadcast("page:form_data", "submit_form_success_all", data)
      _ ->
        nil
    end
  end
end
```

## 2. Topic Naming Convention

| Topic Pattern | Mô tả |
|---------------|--------|
| `"page:" <> page_id` | Channel cho 1 page cụ thể |
| `"page:form_data"` | Global form data notifications |
| `"collaborator:" <> page_id` | Collaborator presence cho page |
| `"user:" <> account_id` | User-specific notifications |
| `"render:" <> page_id` | Real-time page rendering updates |

## 3. Broadcasting Patterns

### Từ trong Channel (broadcast tới tất cả subscribers)
```elixir
# Broadcast tới tất cả clients NGOẠI TRỪ sender
broadcast!(socket, "event_name", payload)

# Broadcast tới tất cả clients KỂ CẢ sender
broadcast(socket, "event_name", payload)
```

### Từ bên ngoài Channel (server-side push)
```elixir
# Dùng Endpoint.broadcast — không cần socket
LandingPageWeb.Endpoint.broadcast("page:" <> page_id, "event_name", payload)
```

### Từ Controller/Context
```elixir
# Sau khi form data được tạo, notify page channel
def create_form_data(conn, params) do
  case FormData.create(params) do
    {:ok, form_data} ->
      # Push real-time update
      LandingPageWeb.PageChannel.update_forms_data(page_id, form_data.id)

      {:success, :with_data, "form_data", PageFormData.json(form_data)}
    {:error, changeset} ->
      {:error, changeset}
  end
end
```

## 4. Collaborator Channel

Quản lý real-time collaboration khi nhiều người cùng edit 1 page:

```elixir
defmodule LandingPageWeb.CollaboratorChannel do
  use Phoenix.Channel

  def join("collaborator:" <> page_id, _params, socket) do
    # Track user presence
    send(self(), :after_join)
    {:ok, assign(socket, :page_id, page_id)}
  end

  def handle_info(:after_join, socket) do
    # Notify others about new collaborator
    broadcast!(socket, "user_joined", %{
      user_id: socket.assigns.user_id,
      page_id: socket.assigns.page_id
    })
    {:noreply, socket}
  end

  def handle_in("cursor_move", %{"x" => x, "y" => y}, socket) do
    broadcast!(socket, "cursor_moved", %{
      user_id: socket.assigns.user_id,
      x: x, y: y
    })
    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    broadcast!(socket, "user_left", %{user_id: socket.assigns.user_id})
    :ok
  end
end
```

## 5. Socket Configuration

```elixir
# endpoint.ex
socket "/socket", LandingPageWeb.UserSocket,
  websocket: true,
  longpoll: false

# user_socket.ex
defmodule LandingPageWeb.UserSocket do
  use Phoenix.Socket

  channel "page:*", LandingPageWeb.PageChannel
  channel "collaborator:*", LandingPageWeb.CollaboratorChannel
  channel "user:*", LandingPageWeb.UserChannel
  channel "render:*", LandingPageWeb.RenderChannel

  def connect(%{"token" => token}, socket, _connect_info) do
    case verify_token(token) do
      {:ok, account_id} ->
        {:ok, assign(socket, :user_id, account_id)}
      _ ->
        :error
    end
  end

  def id(socket), do: "users_socket:#{socket.assigns.user_id}"
end
```

<!--
Source references:
- lib/landing_page_web/channels/page_channel.ex
- lib/landing_page_web/channels/collaborator_channel.ex
- lib/landing_page_web/channels/user_channel.ex
- lib/landing_page_web/endpoint.ex
-->
