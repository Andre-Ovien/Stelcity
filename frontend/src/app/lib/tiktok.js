const TIKTOK_CURRENCY = "NGN"
const EVENT_QUEUE_KEY = "__stelcityTikTokEventQueue"
const TRACKED_EVENT_PREFIX = "stelcity:tiktok:tracked:"
const PENDING_PURCHASE_PREFIX = "stelcity:tiktok:pending-purchase:"
const CHECKOUT_SESSION_KEY = "stelcity:tiktok:checkout-session"

function isBrowser() {
  return typeof window !== "undefined"
}

function toAmount(value) {
  if (value === null || value === undefined || value === "") return null

  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

function toSafeString(value) {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

function getSessionStorage() {
  if (!isBrowser()) return null

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function getTrackingStorage() {
  if (!isBrowser()) return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function getContentId(item) {
  const explicitId = item?.productId ?? item?.product_id
  if (explicitId !== null && explicitId !== undefined) {
    return toSafeString(explicitId)
  }

  const itemId = toSafeString(item?.id)
  if (item?.variantId && itemId.includes("-")) {
    return itemId.split("-")[0]
  }

  return itemId || toSafeString(item?.slug)
}

function getContentCategory(item) {
  if (
    item?.type === "raw" ||
    item?.category === "raw_material" ||
    item?.variantId
  ) {
    return "raw_material"
  }

  return "skincare"
}

function createEventId(prefix) {
  if (!isBrowser()) return null

  const randomId = window.crypto?.randomUUID?.()
  if (randomId) return `${prefix}:${randomId}`

  return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2)}`
}

function wasTracked(onceKey) {
  if (!onceKey) return false
  return getTrackingStorage()?.getItem(`${TRACKED_EVENT_PREFIX}${onceKey}`) === "1"
}

function markTracked(onceKey) {
  if (!onceKey) return

  try {
    getTrackingStorage()?.setItem(`${TRACKED_EVENT_PREFIX}${onceKey}`, "1")
  } catch {
    // Analytics must never interrupt the customer journey.
  }
}

function queueEvent(event) {
  if (!isBrowser()) return false

  const queue = Array.isArray(window[EVENT_QUEUE_KEY])
    ? window[EVENT_QUEUE_KEY]
    : []

  const duplicateQueuedEvent = queue.some((queuedEvent) =>
    (event.onceKey && queuedEvent.onceKey === event.onceKey) ||
    (event.eventId && queuedEvent.eventId === event.eventId)
  )

  if (duplicateQueuedEvent) return false

  queue.push(event)
  window[EVENT_QUEUE_KEY] = queue
  return true
}

export function buildTikTokContents(items = []) {
  if (!Array.isArray(items)) return []

  return items.flatMap((item) => {
    const contentId = getContentId(item)
    const contentName = toSafeString(item?.name)
    const price = toAmount(item?.price)
    const requestedQuantity = Number(item?.quantity ?? 1)
    const quantity = Number.isFinite(requestedQuantity) && requestedQuantity > 0
      ? Math.floor(requestedQuantity)
      : 1

    if (!contentId || !contentName) return []

    const content = {
      content_id: contentId,
      content_type: "product",
      content_name: contentName,
      content_category: getContentCategory(item),
      quantity,
    }

    if (price !== null) content.price = price
    return [content]
  })
}

export function buildTikTokCommercePayload(items = [], explicitValue = null) {
  const contents = buildTikTokContents(items)
  const contentIds = contents.map((item) => item.content_id)
  const requestedValue = toAmount(explicitValue)
  const calculatedValue = contents.reduce(
    (total, item) => total + (item.price ?? 0) * item.quantity,
    0
  )
  const value = requestedValue ?? calculatedValue

  return {
    contents,
    content_ids: contentIds,
    value,
    currency: TIKTOK_CURRENCY,
  }
}

export function flushPendingTikTokEvents() {
  if (!isBrowser() || typeof window.ttq?.track !== "function") return 0

  const queue = Array.isArray(window[EVENT_QUEUE_KEY])
    ? window[EVENT_QUEUE_KEY]
    : []

  window[EVENT_QUEUE_KEY] = []
  let trackedCount = 0

  queue.forEach(({ eventName, payload, eventId, onceKey }) => {
    try {
      if (eventId) {
        window.ttq.track(eventName, payload, { event_id: eventId })
      } else {
        window.ttq.track(eventName, payload)
      }
      markTracked(onceKey)
      trackedCount += 1
    } catch {
      queueEvent({ eventName, payload, eventId, onceKey })
    }
  })

  return trackedCount
}

export function trackTikTokEvent(
  eventName,
  payload = {},
  { eventId = null, onceKey = null } = {}
) {
  if (!isBrowser() || !eventName || wasTracked(onceKey)) return false

  if (typeof window.ttq?.track !== "function") {
    return queueEvent({ eventName, payload, eventId, onceKey })
  }

  try {
    if (eventId) {
      window.ttq.track(eventName, payload, { event_id: eventId })
    } else {
      window.ttq.track(eventName, payload)
    }
    markTracked(onceKey)
    return true
  } catch {
    return queueEvent({ eventName, payload, eventId, onceKey })
  }
}

export function trackViewContent(item) {
  const payload = buildTikTokCommercePayload([item], item?.price)
  if (payload.contents.length === 0) return false

  return trackTikTokEvent("ViewContent", payload, {
    eventId: createEventId("view-content"),
  })
}

export function trackAddToWishlist(item) {
  const payload = buildTikTokCommercePayload([item], item?.price)
  if (payload.contents.length === 0) return false

  return trackTikTokEvent("AddToWishlist", payload, {
    eventId: createEventId("add-to-wishlist"),
  })
}

export function trackSearch(searchString) {
  const query = toSafeString(searchString)
  if (query.length < 2) return false

  return trackTikTokEvent("Search", { search_string: query }, {
    eventId: createEventId("search"),
  })
}

export function trackAddToCart(item) {
  const payload = buildTikTokCommercePayload([item])
  if (payload.contents.length === 0) return false

  return trackTikTokEvent("AddToCart", payload, {
    eventId: createEventId("add-to-cart"),
  })
}

export function trackInitiateCheckout(items) {
  const payload = buildTikTokCommercePayload(items)
  if (payload.contents.length === 0) return false

  const storage = getSessionStorage()
  let checkoutSessionId = storage?.getItem(CHECKOUT_SESSION_KEY)
  if (!checkoutSessionId) {
    checkoutSessionId = createEventId("checkout")
    if (checkoutSessionId) {
      try {
        storage?.setItem(CHECKOUT_SESSION_KEY, checkoutSessionId)
      } catch {
        // A missing checkout session only reduces refresh deduplication.
      }
    }
  }

  return trackTikTokEvent("InitiateCheckout", payload, {
    eventId: checkoutSessionId || createEventId("initiate-checkout"),
    onceKey: checkoutSessionId ? `initiate-checkout:${checkoutSessionId}` : null,
  })
}

export function startCheckoutSession() {
  const storage = getSessionStorage()
  const checkoutSessionId = createEventId("checkout")
  if (!storage || !checkoutSessionId) return null

  try {
    storage.setItem(CHECKOUT_SESSION_KEY, checkoutSessionId)
    return checkoutSessionId
  } catch {
    return null
  }
}

export function clearCheckoutSession() {
  try {
    getSessionStorage()?.removeItem(CHECKOUT_SESSION_KEY)
  } catch {
    // Analytics cleanup must never interrupt the payment result page.
  }
}

export function trackCompleteRegistration() {
  return trackTikTokEvent("CompleteRegistration", {}, {
    eventId: createEventId("complete-registration"),
  })
}

export function rememberPendingPurchase({ reference, orderId, amount, items }) {
  const storage = getSessionStorage()
  const safeReference = toSafeString(reference)
  if (!storage || !safeReference) return false

  const safeItems = Array.isArray(items)
    ? items.map((item) => ({
        id: item?.id,
        productId: item?.productId,
        slug: item?.slug,
        name: item?.name,
        price: item?.price,
        quantity: item?.quantity,
        type: item?.type,
        variantId: item?.variantId,
      }))
    : []

  try {
    storage.setItem(
      `${PENDING_PURCHASE_PREFIX}${safeReference}`,
      JSON.stringify({
        orderId: toSafeString(orderId),
        amount: toAmount(amount),
        items: safeItems,
      })
    )
    return true
  } catch {
    return false
  }
}

export function getPendingPurchase(reference) {
  const storage = getSessionStorage()
  const safeReference = toSafeString(reference)
  if (!storage || !safeReference) return null

  try {
    const value = storage.getItem(`${PENDING_PURCHASE_PREFIX}${safeReference}`)
    if (!value) return null

    const parsed = JSON.parse(value)
    return parsed && typeof parsed === "object" ? parsed : null
  } catch {
    return null
  }
}

export function forgetPendingPurchase(reference) {
  const storage = getSessionStorage()
  const safeReference = toSafeString(reference)
  if (!storage || !safeReference) return

  try {
    storage.removeItem(`${PENDING_PURCHASE_PREFIX}${safeReference}`)
  } catch {
    // Analytics cleanup must never interrupt the payment result page.
  }
}

export function trackPurchase({ orderId, reference, amount, items }) {
  const uniqueOrderId = toSafeString(orderId) || toSafeString(reference)
  if (!uniqueOrderId) return false

  const payload = buildTikTokCommercePayload(items, amount)
  if (payload.contents.length === 0) return false

  const eventId = `purchase:${uniqueOrderId}`
  return trackTikTokEvent(
    "Purchase",
    payload,
    { eventId, onceKey: eventId }
  )
}
