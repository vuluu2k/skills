---
name: core-auth
description: Authentication plugs — JWT validation with JOSE, Passport token, Account lookup and status checking
---

# Authentication Plugs — Landing Page Backend

## 1. AuthorizationPlug (JWT)

Validate JWT token từ `Authorization: Bearer <token>` header. Dùng cho Public API routes.

```elixir
defmodule LandingPageWeb.Plug.AuthorizationPlug do
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts) do
    authorization = for({"authorization", token} <- conn.req_headers, do: token) |> List.first()
    key = System.get_env("JWT_KEY")
    jwk = %{"kty" => "oct", "k" => key}

    case authorization do
      "Bearer " <> jwt ->
        case JOSE.JWT.verify(jwk, jwt) do
          {true, %JOSE.JWT{fields: fields}, _} ->
            %{"iat" => iat, "exp" => exp} = fields
            now = DateTime.utc_now() |> DateTime.to_unix()

            if now >= iat && now <= exp do
              conn |> assign(:token_claims, fields)
            else
              send_unauthorized(conn)
            end
          _ -> send_unauthorized(conn)
        end
      _ -> send_unauthorized(conn)
    end
  end

  defp send_unauthorized(conn) do
    conn |> send_resp(401, "Unauthorized") |> halt()
  end
end
```

### Key Points
- Dùng **JOSE** library cho JWT (HMAC-SHA256)
- Secret key từ env var `JWT_KEY`
- Kiểm tra cả `iat` (issued at) và `exp` (expiration)
- Assigns `:token_claims` map chứa toàn bộ JWT fields

## 2. AccountPlug

Lookup account từ `token_claims` (chạy SAU AuthorizationPlug hoặc PassportPlug):

```elixir
defmodule LandingPageWeb.Plug.AccountPlug do
  import Plug.Conn
  alias LandingPage.Accounts

  def init(opts), do: opts

  def call(conn, _) do
    token_claims = conn.assigns.token_claims

    with {:ok, account} <- Accounts.get_account_by_id(token_claims["account_id"]) do
      cond do
        account.status > 0 ->
          assign(conn, :account, account)     # Active → pass through
        account.status < 0 ->
          send_resp(conn, 403, "Banned for bad behaviors!") |> halt()
        true ->
          send_resp(conn, 404, "Deleted!") |> halt()
      end
    else
      _ ->
        send_resp(conn, 403, "Forbidden!") |> halt()
    end
  end
end
```

### Key Points
- Dùng `with` expression để chain lookups
- Status convention: `> 0` active, `< 0` banned, `== 0` deleted
- Assigns `:account` — Account struct

## 3. PassportPlug

Authentication middleware cho builder routes. Validate token từ Pancake ID service:

```elixir
# Chạy trong pipeline :passport
pipeline :passport do
  plug LandingPageWeb.Plug.PassportPlug
end
```

Assigns `:token_claims` tương tự AuthorizationPlug.

## 4. Plug Execution Order

Plugs chạy tuần tự theo thứ tự khai báo trong pipeline:

```
Request
  → PassportPlug → assigns :token_claims
  → AccountPlug → assigns :account (dùng :token_claims)
  → OrganizationPlug → assigns :organization (dùng :account)
  → TeamPlug → assigns :team (dùng :organization)
  → PermissionCheck → validates permissions
  → Controller action
```

Nếu bất kỳ plug nào gọi `halt()`, pipeline dừng ngay — controller action KHÔNG được gọi.

## 5. Custom Header Extraction Pattern

Project dùng header list comprehension thay vì `get_req_header`:

```elixir
# Pattern dùng trong project
value = for({"x-custom-header", v} <- conn.req_headers, do: v) |> List.first()

# Tương đương nhưng ít dùng trong project
value = get_req_header(conn, "x-custom-header") |> List.first()
```

<!--
Source references:
- lib/landing_page_web/plugs/authorization_plug.ex
- lib/landing_page_web/plugs/account_plug.ex
- lib/landing_page_web/plugs/passport_plug.ex
- lib/landing_page_web/router.ex
-->
