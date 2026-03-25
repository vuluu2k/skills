- Always prefer using standard REST API requests to ensure compatibility across different languages and frameworks (e.g., Elixir, JavaScript, Python).
- For text generation and chat completions, use the OpenAI-compatible endpoint: `POST https://api.deepinfra.com/v1/openai/chat/completions`.
- Always include the following headers in your requests:
  - `Content-Type: application/json`
  - `Authorization: Bearer <API_KEY>` (Retrieve the value from the `DEEPINFRA_API_KEY` environment variable).
- The JSON request payload must include at least the `model` identifier and the `messages` array. Example:
  ```http
  POST https://api.deepinfra.com/v1/openai/chat/completions
  Content-Type: application/json
  Authorization: Bearer $DEEPINFRA_API_KEY

  {
    "model": "meta-llama/Meta-Llama-3-70B-Instruct",
    "messages": [
      { "role": "user", "content": "Hello!" }
    ]
  }
  ```
- Use the exact model ID as specified in the DeepInfra documentation (e.g., `meta-llama/Meta-Llama-3-70B-Instruct`).
- Avoid relying on language-specific SDKs (such as the `openai` Node package or LangChain) unless explicitly requested. Relying on basic HTTP clients like `Req` (in Elixir) or `fetch` (in JavaScript) is preferred to maximize portability.
- Ensure API keys are stored securely using environment variables and are never hardcoded in the source code.
