export class AtenoClient {
  constructor(config = {}) {
    if (!config.apiKey && !config.secretKey) {
      throw new Error('[AtenoSDK] Initialization failed: You must provide either an apiKey or a secretKey.');
    }
    
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.baseURL = config.baseURL || 'https://us-central1-oyola-ai.cloudfunctions.net/api';
    this.requestCount = 0; 
  }

  async post(endpoint, payload) {
    this.requestCount++; 

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.secretKey) {
      headers['Authorization'] = `Bearer ${this.secretKey}`;
    } else if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('[AtenoSDK Auth Error] Invalid or inactive API key.');
    }
    if (response.status === 402) {
      throw new Error('[AtenoSDK Billing Error] Insufficient credits.');
    }
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`[AtenoSDK Quota Error] Rate limit reached. Try again ${retryAfter ? `in ${retryAfter}s` : 'later'}.`);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.status === 'error' || data.success === false) {
      const errorMsg = data.error || data.message || `HTTP Error ${response.status}`;
      throw new Error(`[AtenoSDK Error] ${errorMsg}`);
    }

    return data;
  }

  getTotalRequests() {
    return this.requestCount;
  }
}