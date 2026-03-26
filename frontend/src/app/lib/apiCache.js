
const pendingRequests = new Map()
const dataCache = new Map()

export async function cachedFetch(url, options = {}, cacheTime = 60000) {
  const cacheKey = `${url}_${JSON.stringify(options)}`
  
  
  const cached = dataCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data
  }
  
  
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }
  

  const request = fetch(url, options)
    .then(async (res) => {
      const data = await res.json()
      
    
      if (res.ok) {
        dataCache.set(cacheKey, { data, timestamp: Date.now() })
      }
      
      
      pendingRequests.delete(cacheKey)
      
      if (!res.ok) {
        throw new Error(data.detail || data.message || `HTTP ${res.status}`)
      }
      
      return data
    })
    .catch((err) => {
      pendingRequests.delete(cacheKey)
      throw err
    })
  
  pendingRequests.set(cacheKey, request)
  return request
}


export function clearCache(pattern) {
  if (!pattern) {
    dataCache.clear()
    return
  }
  
  for (const key of dataCache.keys()) {
    if (key.includes(pattern)) {
      dataCache.delete(key)
    }
  }
}