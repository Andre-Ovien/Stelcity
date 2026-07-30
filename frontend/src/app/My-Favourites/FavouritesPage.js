"use client"

import { useCallback, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Heart, ShoppingBag } from "lucide-react"
import toast from "react-hot-toast"
import { useFavStore } from "../store/favStore"
import { useCartStore } from "../store/cartStore"

const getServerMediaSnapshot = () => false

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", callback)
    return () => media.removeEventListener("change", callback)
  }, [query])

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function productHref(product) {
  if (product.type === "service") return `/our-services/${product.slug}`
  if (product.type === "raw") return `/raw-materials/${product.slug}`
  return `/products/${product.slug}`
}

function itemKind(product) {
  if (product.type === "service") return "Beauty service"
  if (product.type === "raw") return "Raw material"
  return "Skincare product"
}

function cartItem(product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
    variant: null,
    variantId: null,
  }
}

function WishlistRow({ product, isDesktop }) {
  const toggleFav = useFavStore((state) => state.toggleFav)
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()
  const isService = product.type === "service"
  const isRawMaterial = product.type === "raw"
  const canAddDirectly = !isService && !isRawMaterial

  const handleAddToBag = () => {
    if (isService || isRawMaterial) {
      router.push(productHref(product))
      return
    }

    addItem(cartItem(product))
    toast.success("Added to bag!")
  }

  const handleRemove = () => {
    toggleFav(product)
    toast.success("Removed from wishlist")
  }

  const actionLabel = isService ? "View service" : isRawMaterial ? "Select option" : "Add to bag"

  return (
    <article className="border-t py-5 sm:py-8" style={{ borderColor: "#d9ddd6" }}>
      <div
        className={`wishlist-row-grid ${
          isDesktop ? "items-center gap-6" : "items-start gap-4"
        }`}
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "minmax(0, 1fr) 150px"
            : "96px minmax(0, 1fr)",
        }}
      >
        <div className="min-w-0">
          <Link href={productHref(product)} className="block w-fit transition hover:text-[#b54e47]">
            <h2 className="text-[19px] font-black leading-[1.08] tracking-[-0.035em] text-[#1d241e] sm:text-[25px]">
              {product.name}
            </h2>
          </Link>
          <p className="mt-1.5 text-sm font-semibold text-[#52604f] sm:mt-2 sm:text-[15px]">
            {product.priceLabel || `₦${Number(product.price || 0).toLocaleString()}`}
          </p>
          <p className="mt-0.5 text-[11px] text-[#7d877a] sm:mt-1 sm:text-xs">{itemKind(product)}</p>

          <button
            type="button"
            onClick={handleAddToBag}
            className={`inline-flex h-10 items-center justify-center border border-[#1d241e] text-xs font-black text-[#1d241e] transition hover:bg-[#1d241e] hover:text-white ${
              isDesktop
                ? "mt-6 min-w-[180px] px-5"
                : "mt-3.5 w-full min-w-0 px-3"
            }`}
          >
            {actionLabel}
          </button>

          <div className={`${isDesktop ? "mt-5 gap-x-5" : "mt-3 gap-x-4"} flex flex-wrap items-center gap-y-2 text-xs font-bold`}>
            <Link href={productHref(product)} className="text-[#52604f] transition hover:text-[#1d241e]">View item</Link>
            <button type="button" onClick={handleRemove} className="text-[#b54e47] transition hover:text-[#772e29]">Remove item</button>
          </div>
        </div>

        <Link
          href={productHref(product)}
          className={`relative overflow-hidden bg-[#f0f2ee] ${
            isDesktop
              ? "h-[150px] w-[150px] justify-self-end"
              : "order-first h-24 w-24 justify-self-start"
          }`}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={isDesktop ? "150px" : "96px"}
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-[#b54e47]">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </span>
          )}
        </Link>
      </div>
    </article>
  )
}

export default function FavouritesPage() {
  const items = useFavStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 720px)")
  const cartableItems = items.filter((item) => item.type !== "service" && item.type !== "raw")

  const handleAddAllToBag = () => {
    if (cartableItems.length === 0) {
      toast("Choose product options before adding them to your bag.")
      return
    }

    cartableItems.forEach((product) => addItem(cartItem(product)))
    const skipped = items.length - cartableItems.length
    toast.success(skipped > 0 ? `${cartableItems.length} item(s) added. Select options for the rest.` : "All saved items added to bag!")
  }

  return (
    <div className="min-h-screen bg-[#fffefb] text-[#1d241e]">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b px-5 py-6 sm:px-10 sm:py-8" style={{ borderColor: "#d9ddd6" }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex h-10 w-10 items-center justify-center text-[#1d241e] transition hover:text-[#b54e47]"
        >
          <ArrowLeft className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
        </button>
        <h1 className="text-[30px] font-black leading-none tracking-[-0.045em] sm:text-[36px]">Wishlist</h1>
        <span aria-hidden="true" />
      </header>

      <main className="px-5 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-[900px]">
          {items.length === 0 ? (
            <section className="border-t py-20 text-center sm:py-28" style={{ borderColor: "#d9ddd6" }}>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f6dfd3] text-[#b54e47]">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-[30px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Your wishlist is waiting.</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#717a6e]">Save products you want to come back to and they will stay here for you.</p>
              <Link href="/products" className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#1d241e] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]">
                Explore products
              </Link>
            </section>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-5 border-t pb-5 pt-4" style={{ borderColor: "#d9ddd6" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#748071]">Saved items</p>
                <p className="text-xs font-bold text-[#7d877a]">{items.length} {items.length === 1 ? "item" : "items"}</p>
              </div>

              <div>
                {items.map((product) => <WishlistRow key={product.slug} product={product} isDesktop={isDesktop} />)}
              </div>

              <section className="mt-7 flex flex-col gap-5 border-t pt-7 sm:mt-9 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "#d9ddd6" }}>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
                  <Link href="/products" className="text-[#52604f] transition hover:text-[#1d241e]">Continue shopping</Link>
                  <p className="text-[#7d877a]">Your saved list updates automatically.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddAllToBag}
                  className="inline-flex h-12 min-w-[230px] items-center justify-center gap-2 bg-[#1d241e] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#354033]"
                >
                  Add all to bag
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </button>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
