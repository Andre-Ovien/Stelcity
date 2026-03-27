class RequestCache {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
  }

  generateKey(url, options) {
    return `${url}_${JSON.stringify(options || {})}`
  }

  async fetch(url, options = {}, config = {}) {
    const {
      cacheTime = 30000,    
      staleTime = 5000,     
      retry = 1,
      retryDelay = 1000,
    } = config

    const key = this.generateKey(url, options)
    const now = Date.now()

   
    const cached = this.cache.get(key)
    if (cached) {
      const age = now - cached.timestamp
      if (age < staleTime) return cached.data
      if (age < cacheTime) {
        this.backgroundRefetch(url, options, key, config)
        return cached.data
      }
    }

  
    if (this.pendingRequests.has(key)) return this.pendingRequests.get(key)

    const request = this.makeRequest(url, options, retry, retryDelay)
      .then((data) => {
        this.cache.set(key, { data, timestamp: Date.now() })
        this.pendingRequests.delete(key)
        return data
      })
      .catch((err) => {
        this.pendingRequests.delete(key)
        throw err
      })

    this.pendingRequests.set(key, request)
    return request
  }

  async makeRequest(url, options, retriesLeft, retryDelay) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timeout)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))

        if (res.status >= 400 && res.status < 500) {
          throw new Error(data.detail || data.message || `HTTP ${res.status}`)
        }

        if (retriesLeft > 0) {
          await new Promise((r) => setTimeout(r, retryDelay))
          return this.makeRequest(url, options, retriesLeft - 1, retryDelay * 2)
        }

        throw new Error(data.detail || data.message || `HTTP ${res.status}`)
      }

      return await res.json()
    } catch (err) {
      if (retriesLeft > 0 && (err.name === "TypeError" || err.name === "AbortError")) {
        await new Promise((r) => setTimeout(r, retryDelay))
        return this.makeRequest(url, options, retriesLeft - 1, retryDelay * 2)
      }
      throw err
    }
  }

  backgroundRefetch(url, options, key, config) {
    if (this.pendingRequests.has(key)) return

    const request = this.makeRequest(url, options, config.retry || 0, 1000)
      .then((data) => {
        this.cache.set(key, { data, timestamp: Date.now() })
        this.pendingRequests.delete(key)
      })
      .catch(() => {
        this.pendingRequests.delete(key)
      })

    this.pendingRequests.set(key, request)
  }

  invalidate(pattern) {
    if (!pattern) {
      this.cache.clear()
      return
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) this.cache.delete(key)
    }
  }

  clear() {
    this.cache.clear()
    this.pendingRequests.clear()
  }
}

export const apiCache = new RequestCache()

export async function cachedFetch(url, options = {}, config = {}) {
  return apiCache.fetch(url, options, config)
}

export function invalidateCache(pattern) {
  apiCache.invalidate(pattern)
}