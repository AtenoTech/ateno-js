export class AtenoClient {
  constructor(apiKeyOrConfig, options = {}) {
    let apiKey
    let resolvedOptions = options

    if (typeof apiKeyOrConfig === "string") {
      apiKey = apiKeyOrConfig
    } else if (apiKeyOrConfig && typeof apiKeyOrConfig === "object") {
      apiKey = apiKeyOrConfig.apiKey
      resolvedOptions = apiKeyOrConfig
    }

    if (!apiKey) {
      throw new Error("API key required")
    }

    this.apiKey = apiKey
    this.baseURL = resolvedOptions.baseURL || "https://api.ateno.tech"
  }

  async request(path, options = {}) {
    const response = await fetch(this.baseURL + path, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "API request failed")
    }

    return data
  }
}

export default AtenoClient