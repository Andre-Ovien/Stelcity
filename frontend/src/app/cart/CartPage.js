"use client"

import { useCallback, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import Header from "../components/Header"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import { startCheckoutSession } from "../lib/tiktok"

const getServerMediaSnapshot = () => false

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", callback)
    return () => media.removeEventListener("change", callback)
  }, [query])

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function formatNaira(value) {
  const amount = Number(value)
  return `₦${(Number.isFinite(amount) ? amount : 0).toLocaleString()}`
}

function CartImage({ item }) {
  const [imageError, setImageError] = useState(false)

  if (!item.image || imageError) {
    return (
      <div className="grid h-full w-full place-items-center bg-[#ebe8e1]">
        <ShoppingBag className="h-6 w-6 text-[#817a72]" aria-hidden="true" />
      </div>
    )
  }

  return (
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="88px"
      onError={() => setImageError(true)}
      className="object-cover"
    />
  )
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex h-10 items-center rounded-full border border-[#cbc6bd] bg-white p-0.5">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-[#17130f] transition hover:bg-[#f0eee9]"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="w-8 text-center text-sm font-black tabular-nums text-[#17130f]" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-[#17130f] transition hover:bg-[#f0eee9]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

function ItemDetails({ item, onRemove, showRemove }) {
  return (
    <div className="flex min-w-0 items-start gap-4">
      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[18px] bg-[#f0eee9] sm:h-[84px] sm:w-[84px]">
        <CartImage item={item} />
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-[15px] font-black leading-[1.2] tracking-[-0.015em] text-[#17130f] sm:text-base">
              {item.name}
            </h2>
            {item.variant && (
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a837a]">
                {item.variant}
              </p>
            )}
            <p className="mt-2 text-xs text-[#746e66]">{formatNaira(item.price)} each</p>
          </div>
          {showRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${item.name} from bag`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#dedbd4] text-[#746e66] transition hover:border-[#17130f] hover:text-[#17130f]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CartItem({ item, isDesktop, onRemove, onUpdateQuantity }) {
  const lineTotal = Number(item.price) * item.quantity
  const onDecrease = () => {
    if (item.quantity <= 1) onRemove()
    else onUpdateQuantity(item.quantity - 1)
  }

  if (!isDesktop) {
    return (
      <article className="border-b border-[#dedbd4] px-4 py-5 last:border-b-0 sm:px-5">
        <ItemDetails item={item} onRemove={onRemove} showRemove />
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#edeae4] pt-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Quantity</p>
            <div className="mt-2">
              <QuantityControl
                quantity={item.quantity}
                onDecrease={onDecrease}
                onIncrease={() => onUpdateQuantity(item.quantity + 1)}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Item total</p>
            <p className="mt-2 text-lg font-black tracking-[-0.03em] text-[#17130f]">{formatNaira(lineTotal)}</p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className="items-center gap-5 border-b border-[#dedbd4] px-6 py-5 last:border-b-0 xl:px-7"
      style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) 148px 116px 42px" }}
    >
      <ItemDetails item={item} onRemove={onRemove} />
      <QuantityControl
        quantity={item.quantity}
        onDecrease={onDecrease}
        onIncrease={() => onUpdateQuantity(item.quantity + 1)}
      />
      <p className="text-base font-black tracking-[-0.03em] text-[#17130f]">{formatNaira(lineTotal)}</p>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name} from bag`}
        className="grid h-10 w-10 place-items-center rounded-full text-[#746e66] transition hover:bg-[#f0eee9] hover:text-[#17130f]"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </article>
  )
}

function OrderSummary({ isDesktop, itemCount, subtotal, onCheckout }) {
  return (
    <aside
      className="rounded-[26px] border border-[#dedbd4] bg-white p-5 sm:p-6"
      style={isDesktop ? { position: "sticky", top: "6.75rem" } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8a837a]">Order summary</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#17130f]">Your total</h2>
        </div>
        <span className="grid h-8 min-w-8 place-items-center rounded-full bg-[#eaff51] px-2 text-[10px] font-black text-[#17130f]">
          {itemCount}
        </span>
      </div>

      <div className="mt-7 space-y-3 border-y border-[#dedbd4] py-5 text-sm">
        <div className="flex items-center justify-between gap-4 text-[#746e66]">
          <span>Subtotal</span>
          <span className="font-bold text-[#17130f]">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[#17130f]">
          <span className="text-base font-black">Total</span>
          <span className="text-xl font-black tracking-[-0.03em]">{formatNaira(subtotal)}</span>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-[#746e66]">Delivery options are selected at checkout.</p>

      {isDesktop && (
        <button
          type="button"
          onClick={onCheckout}
          className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#17130f] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#322c26]"
        >
          Checkout
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#17130f] transition hover:text-[#ba5f58]">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Continue shopping
      </Link>
    </aside>
  )
}

function EmptyCart() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <Header />
      <main className="px-4 pb-24 pt-12 sm:px-7 lg:px-10">
        <section className="mx-auto grid min-h-[58vh] max-w-[1480px] place-items-center border-y border-[#dedbd4] text-center">
          <div className="max-w-md px-6">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eaff51] text-[#17130f]">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-7 text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">Your bag</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#17130f] sm:text-5xl">Your bag is waiting for something good.</h1>
            <p className="mt-4 text-sm leading-6 text-[#746e66]">Browse the collection and add what feels right for your routine.</p>
            <Link href="/products" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17130f] px-6 py-3.5 text-xs font-black text-white transition hover:bg-[#322c26]">
              Browse skincare
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const isAuth = useAuthStore((state) => state.isAuth)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    startCheckoutSession()

    if (!isAuth) {
      toast.error("Please sign in to proceed to checkout", { duration: 2000 })
      setTimeout(() => {
        sessionStorage.setItem("redirectAfter", "/checkout")
        router.push("/auth?mode=login")
      }, 1500)
      return
    }

    router.push("/checkout")
  }

  if (items.length === 0) return <EmptyCart />

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <Header />

      <main className="px-4 pb-32 pt-8 sm:px-7 sm:pt-12 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-col gap-5 border-b border-[#dedbd4] pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-10">
            <div>
              <h1 className="text-[42px] font-black leading-[0.9] tracking-[-0.055em] text-[#17130f] sm:text-[58px]">Your bag.</h1>
              <p className="mt-4 text-sm leading-6 text-[#746e66]">{itemCount} {itemCount === 1 ? "item" : "items"} selected for your routine.</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-xs font-black text-[#17130f] transition hover:text-[#ba5f58]">
              Continue shopping
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div
            className="mt-8 gap-7 lg:mt-10 lg:gap-10 xl:gap-14"
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "minmax(0, 1fr) 360px" : "minmax(0, 1fr)",
            }}
          >
            <section className="overflow-hidden rounded-[26px] border border-[#dedbd4] bg-white">
              {isDesktop && (
                <div
                  className="gap-5 border-b border-[#dedbd4] bg-[#f7f5ef] px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#817a72] xl:px-7"
                  style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) 148px 116px 42px" }}
                >
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span className="sr-only">Remove</span>
                </div>
              )}

              <div>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isDesktop={isDesktop}
                    onRemove={() => removeItem(item.id)}
                    onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                  />
                ))}
              </div>
            </section>

            <OrderSummary
              isDesktop={isDesktop}
              itemCount={itemCount}
              subtotal={subtotal}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>

      {!isDesktop && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dedbd4] bg-[#faf9f6]/96 px-4 py-3 backdrop-blur-lg">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a837a]">Total</p>
              <p className="mt-1 text-lg font-black tracking-[-0.03em] text-[#17130f]">{formatNaira(subtotal)}</p>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#17130f] px-5 text-xs font-black text-white"
            >
              Checkout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
