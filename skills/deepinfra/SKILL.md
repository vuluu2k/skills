---
name: deepinfra
description: Integration guidelines for DeepInfra API. Directs the agent to adapt DeepInfra REST API calls to the target repository's standard HTTP client.
metadata:
  author: AI Assistant
  version: "1.0.1"
  source: Generated from sources/deepinfra
---

# DeepInfra API

> This skill focuses on integrating DeepInfra's REST API into any project. **Do not use language-specific SDKs** (like the `openai` NodeJS package or LangChain) unless the project already heavily depends on them.

## Key Integration Rules

- **Use the Repository's Native HTTP Client**: Before writing code to call the DeepInfra API, **you must analyze the current repository** to identify how external HTTP requests are typically made (e.g., a custom `useFetch` wrapper, an Axios instance, Elixir `Req`, or standard `fetch`).
- **Adapt to Existing Patterns**: Send the DeepInfra request using the exact fetching mechanism discovered in the project. Do not introduce raw `fetch` commands or new libraries if a standard API wrapper already exists.
- **Endpoint**: The base URL for most AI inference tasks (chat completions) is `POST https://api.deepinfra.com/v1/openai/chat/completions`.
- **Authentication**: You must set the `Authorization: Bearer <API_KEY>` header. Always read the API key from environment variables (e.g., `process.env.DEEPINFRA_API_KEY` or `System.get_env("DEEPINFRA_API_KEY")`) rather than hardcoding.
- **Headers**: Always include `Content-Type: application/json`.

## Quick Reference 

### Standard JSON Payload

Adapt this payload to the project's standard API caller:

```json
{
  "model": "meta-llama/Meta-Llama-3-70B-Instruct",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}
```

### Example Response Structure

DeepInfra yields an OpenAI-compatible JSON structure. Handle the response parsing according to the repository's typical data-transformation layers:

```json
{
  "id": "chatcmpl-guMTxWgpFf",
  "object": "chat.completion",
  "created": 1694623155,
  "model": "meta-llama/Meta-Llama-3-70B-Instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! It's nice to meet you."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 16,
    "total_tokens": 31
  }
}
```

### Supported Models

Always use the exact model ID from the DeepInfra catalog, such as:
- `deepseek-ai/DeepSeek-V3`
- `meta-llama/Meta-Llama-3-70B-Instruct`
