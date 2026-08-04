"use client"

import { use, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Heart, Minus, Plus, ShoppingBag } from "lucide-react"
import toast from "react-hot-toast"
import Header from "./Header"
import Footer from "./Footer"
import ProductPageCard from "./ProductSection"
import AutoProductCarousel from "./AutoProductCarousel"
import { getProductDetail } from "../lib/productDetail"
import { getAllProducts } from "../lib/product"
import { getAllRawMaterials } from "../lib/rawMaterials"
import { trackViewContent } from "../lib/tiktok"
import { useCartStore } from "../store/cartStore"
import { useFavStore } from "../store/favStore"

const DETAIL_CONFIG = {
  product: {
    basePath: "products",
    backLabel: "Back to products",
    eyebrow: "Skincare product",
    imageLabel: "Skincare",
    relatedEyebrow: "Keep exploring",
    relatedTitle: "More for your routine",
    imageTone: "bg-[#f0eee9]",
  },
  raw_material: {
    basePath: "raw-materials",
    backLabel: "Back to raw materials",
    eyebrow: "Raw material",
    imageLabel: "Raw material",
    relatedEyebrow: "Continue sourcing",
    relatedTitle: "More for your next blend",
    imageTone: "bg-[#efe3d5]",
  },
}

function toPrice(value) {
  const price = Number.parseFloat(value)
  return Number.isFinite(price) ? price : null
}

function formatPrice(value) {
  const price = toPrice(value)
  return price === null ? "Price unavailable" : `₦${price.toLocaleString()}`
}

function DetailSkeleton({ isRawMaterial }) {
  return (
    <main className="px-4 pb-24 pt-6 sm:px-7 sm:pt-10 lg:px-10">
      <div className="mx-auto max-w-[1480px] animate-pulse">
        <div className="h-3 w-32 rounded-full bg-[#dedbd4]" />
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className={`aspect-square flex-1 rounded-[28px] ${isRawMaterial ? "bg-[#ead9ca]" : "bg-[#ebe9e3]"}`} />
          <div className="flex flex-1 flex-col gap-4 lg:pt-4">
            <div className="h-3 w-24 rounded-full bg-[#dedbd4]" />
            <div className="h-14 max-w-xl rounded-2xl bg-[#e5e1da] sm:h-20" />
            <div className="h-5 w-32 rounded-full bg-[#dedbd4]" />
            <div className="mt-4 h-4 max-w-lg rounded-full bg-[#e5e1da]" />
            <div className="h-4 max-w-md rounded-full bg-[#e5e1da]" />
            <div className="mt-6 h-36 border-y border-[#dedbd4]" />
          </div>
        </div>
      </div>
    </main>
  )
}

function QuantityControl({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex h-12 items-center rounded-full border border-[#cbc6bd] bg-white p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="grid h-9 w-9 place-items-center rounded-full text-[#17130f] transition hover:bg-[#f0eee9] disabled:cursor-not-allowed disabled:opacity-35"
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
        className="grid h-9 w-9 place-items-center rounded-full text-[#17130f] transition hover:bg-[#f0eee9]"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

function ImageWell({ product, config, imageError, onImageError, favourite, onToggleFavourite }) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-[28px] ${config.imageTone} sm:rounded-[34px]`}>
      {product.image && !imageError ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 52vw"
          onError={onImageError}
          className="object-cover"
        />
      ) : (
        <div className="grid h-full place-items-center px-8 text-center" role="img" aria-label={`Image for ${product.name} is not available`}>
          <span className="font-serif text-2xl italic text-[#7c7168]">Image coming soon</span>
        </div>
      )}

      <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-[#17130f] backdrop-blur-sm">
        {config.imageLabel}
      </span>

      <button
        type="button"
        suppressHydrationWarning
        aria-label={favourite ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
        onClick={onToggleFavourite}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/92 text-[#17130f] shadow-[0_10px_28px_rgba(35,29,24,0.1)] backdrop-blur-sm transition hover:scale-105"
      >
        <Heart className={`h-4 w-4 ${favourite ? "fill-[#d16f66] text-[#d16f66]" : "text-[#17130f]"}`} aria-hidden="true" />
      </button>
    </div>
  )
}

function DetailNotFound({ config }) {
  return (
    <main className="px-4 pb-24 pt-6 sm:px-7 sm:pt-10 lg:px-10">
      <div className="mx-auto grid min-h-[52vh] max-w-[1480px] place-items-center border-y border-[#dedbd4] text-center">
        <div className="max-w-md px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">Stelcity</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#17130f]">We couldn&apos;t find that item.</h1>
          <p className="mt-4 text-sm leading-6 text-[#746e66]">It may have moved, or it is no longer listed in this collection.</p>
          <Link href={`/${config.basePath}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17130f] px-5 py-3 text-xs font-black text-white transition hover:bg-[#322c26]">
            Browse {config.basePath === "products" ? "products" : "raw materials"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function ProductDetailPage({
  params,
  expectedCategory = "product",
  initialProduct = null,
}) {
  const { slug } = use(params)
  const config = DETAIL_CONFIG[expectedCategory] || DETAIL_CONFIG.product
  const isRawMaterial = expectedCategory === "raw_material"
  const requestKey = `${expectedCategory}:${slug}`
  const hasMatchingInitialProduct =
    initialProduct?.category === expectedCategory && initialProduct?.slug === slug
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const toggleFav = useFavStore((state) => state.toggleFav)
  const [product, setProduct] = useState(
    hasMatchingInitialProduct ? initialProduct : null
  )
  const [resolvedRequest, setResolvedRequest] = useState(
    hasMatchingInitialProduct ? requestKey : null
  )
  const [imageError, setImageError] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedItems, setRelatedItems] = useState([])
  const trackedProductKey = useRef(null)
  const isFavourite = useFavStore((state) => state.isFav(product?.slug || slug))
  const loading = resolvedRequest !== requestKey

  useEffect(() => {
    if (hasMatchingInitialProduct) return undefined

    let cancelled = false

    getProductDetail(slug)
      .then((item) => {
        if (cancelled) return

        const validItem = item && item.category === expectedCategory ? item : null
        setProduct(validItem)
        setImageError(false)
        setSelectedVariant(
          expectedCategory === "raw_material" ? validItem?.variants?.[0] || null : null
        )
        setQuantity(1)
        setRelatedItems([])
        setResolvedRequest(requestKey)
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(null)
          setImageError(false)
          setSelectedVariant(null)
          setQuantity(1)
          setRelatedItems([])
          setResolvedRequest(requestKey)
        }
      })

    return () => {
      cancelled = true
    }
  }, [expectedCategory, hasMatchingInitialProduct, requestKey, slug])

  useEffect(() => {
    if (!product) return undefined

    let cancelled = false
    const loadRelated = expectedCategory === "raw_material"
      ? getAllRawMaterials
      : getAllProducts

    loadRelated()
      .then((items) => {
        if (cancelled || !Array.isArray(items)) return
        setRelatedItems(items.filter((item) => item.id !== product.id).slice(0, 4))
      })
      .catch(() => {
        if (!cancelled) setRelatedItems([])
      })

    return () => {
      cancelled = true
    }
  }, [expectedCategory, product])

  useEffect(() => {
    if (!product) return

    const productKey = `${expectedCategory}:${product.id}`
    if (trackedProductKey.current === productKey) return

    const variantPrices = (product.variants || [])
      .map((variant) => Number(variant.price))
      .filter(Number.isFinite)
    const viewPrice = expectedCategory === "raw_material" && variantPrices.length > 0
      ? Math.min(...variantPrices)
      : product.price

    trackViewContent({
      id: product.id,
      slug: product.slug || slug,
      name: product.name,
      price: viewPrice,
      category: expectedCategory,
      type: isRawMaterial ? "raw" : "product",
      quantity: 1,
    })
    trackedProductKey.current = productKey
  }, [expectedCategory, isRawMaterial, product, slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
        <Header />
        <DetailSkeleton isRawMaterial={isRawMaterial} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
        <Header />
        <DetailNotFound config={config} />
        <Footer />
      </div>
    )
  }

  const activePrice = isRawMaterial ? toPrice(selectedVariant?.price) : toPrice(product.price)
  const displayPrice = isRawMaterial && selectedVariant
    ? formatPrice(selectedVariant.price)
    : product.priceLabel
  const canPurchase = activePrice !== null && (!isRawMaterial || Boolean(selectedVariant))
  const noSelectableOptions = isRawMaterial && product.variants.length === 0

  const handleToggleFavourite = () => {
    toggleFav({
      id: product.id,
      slug: product.slug || slug,
      name: product.name,
      price: activePrice ?? product.price,
      priceLabel: displayPrice,
      image: product.image,
      description: product.description,
      variants: product.variants,
      type: isRawMaterial ? "raw" : "product",
    })
    toast.success(isFavourite ? "Removed from favourites" : "Saved to favourites")
  }

  const addToBag = () => {
    if (!canPurchase) {
      toast.error(
        noSelectableOptions
          ? "This item has no selectable option yet."
          : "This item does not have a price yet."
      )
      return false
    }

    addItem({
      id: isRawMaterial ? `${product.id}-${selectedVariant.id}` : product.id,
      slug: product.slug || slug,
      name: product.name,
      price: activePrice,
      image: product.image,
      quantity,
      variant: isRawMaterial ? selectedVariant.weight || null : null,
      variantId: isRawMaterial ? selectedVariant.id : null,
    })
    toast.success("Added to bag")
    return true
  }

  const buyNow = () => {
    if (addToBag()) router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <Header />

      <main className="px-4 pb-32 pt-6 sm:px-7 sm:pt-10 lg:px-10 lg:pb-36">
        <div className="mx-auto max-w-[1480px]">
          <Link
            href={`/${config.basePath}`}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#817a72] transition hover:text-[#17130f]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {config.backLabel}
          </Link>

          <section className="mt-7 flex flex-col gap-9 lg:mt-10 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
            <div className="w-full lg:sticky lg:top-28 lg:w-[52%] lg:self-start">
              <ImageWell
                product={product}
                config={config}
                imageError={imageError}
                onImageError={() => setImageError(true)}
                favourite={isFavourite}
                onToggleFavourite={handleToggleFavourite}
              />
            </div>

            <div className="w-full lg:w-[48%] lg:pt-3">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">{config.eyebrow}</p>
              <h1 className="mt-4 max-w-2xl text-[42px] font-black leading-[0.91] tracking-[-0.055em] text-[#17130f] sm:text-[58px] lg:text-[clamp(3.2rem,4.3vw,5rem)]">
                {product.name}
              </h1>
              <p className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#17130f] sm:text-[28px]">
                {displayPrice}
              </p>

              <div className="mt-8 border-t border-[#dedbd4] pt-6">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8a837a]">What it is</p>
                <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-[#625c55] sm:text-[15px] sm:leading-7">
                  {product.description || "Details for this item are not available yet."}
                </p>
              </div>

              <div className="mt-8 border-y border-[#dedbd4] py-6 sm:py-7">
                {isRawMaterial && (
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-black text-[#17130f]">Choose a weight</p>
                      {selectedVariant?.weight && (
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a837a]">{selectedVariant.weight} selected</p>
                      )}
                    </div>

                    {product.variants.length > 0 ? (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {product.variants.map((variant) => {
                          const selected = selectedVariant?.id === variant.id
                          return (
                            <button
                              key={variant.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                setSelectedVariant(variant)
                                setQuantity(1)
                              }}
                              className={`flex min-h-14 items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                selected
                                  ? "border-[#21150e] bg-[#21150e] text-[#fffaf2]"
                                  : "border-[#d8c8bb] bg-[#f8eee5] text-[#5f4938] hover:border-[#5f4938]"
                              }`}
                            >
                              <span className="text-sm font-black">{variant.weight || "Option"}</span>
                              <span className={`text-xs font-black ${selected ? "text-[#fffaf2]/80" : "text-[#806858]"}`}>
                                {formatPrice(variant.price)}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-[#746e66]">No selectable options are listed for this item yet.</p>
                    )}
                  </div>
                )}

                <div className={`${isRawMaterial ? "mt-7 border-t border-[#dedbd4] pt-6" : ""} flex flex-wrap items-center justify-between gap-4`}>
                  <div>
                    <p className="text-sm font-black text-[#17130f]">Quantity</p>
                    <p className="mt-1 text-xs text-[#817a72]">Adjust how many you&apos;d like to add.</p>
                  </div>
                  <QuantityControl
                    quantity={quantity}
                    onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                    onIncrease={() => setQuantity((current) => Math.min(99, current + 1))}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={addToBag}
                  disabled={!canPurchase}
                  className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#17130f] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#322c26] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Add to bag
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={!canPurchase}
                  className="flex h-14 items-center justify-center gap-2 rounded-full border border-[#17130f] bg-transparent px-6 text-sm font-black text-[#17130f] transition hover:bg-[#efece6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Buy now
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {!canPurchase && (
                <p className="mt-3 text-xs leading-5 text-[#8a837a]">
                  {noSelectableOptions
                    ? "Select an available option when one is listed to add this material to your bag."
                    : "This item cannot be added to your bag until a price is available."}
                </p>
              )}
            </div>
          </section>

          <section className="mt-16 grid border-t border-[#dedbd4] lg:mt-24 lg:grid-cols-2">
            <div className="border-b border-[#dedbd4] py-8 lg:border-b-0 lg:border-r lg:py-10 lg:pr-12">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8a837a]">About this product</p>
              <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-7 text-[#625c55] sm:text-[15px]">
                {product.description || "More information about this item will be added soon."}
              </p>
            </div>
            <div className="py-8 lg:py-10 lg:pl-12">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8a837a]">Purchase details</p>
              {isRawMaterial ? (
                product.variants.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span key={`detail-${variant.id}`} className="rounded-full border border-[#d8c8bb] bg-[#f8eee5] px-3 py-2 text-xs font-bold text-[#5f4938]">
                        {variant.weight || "Option"} · {formatPrice(variant.price)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[#625c55]">No weight options are listed for this material at the moment.</p>
                )
              ) : (
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#625c55]">Choose the quantity that suits your routine, then add it to your bag whenever you&apos;re ready.</p>
              )}
            </div>
          </section>

          {relatedItems.length > 0 && (
            <section className="mt-16 border-t border-[#dedbd4] pt-10 sm:mt-24 sm:pt-14">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">{config.relatedEyebrow}</p>
                  <h2 className="mt-3 text-[34px] font-black leading-none tracking-[-0.045em] text-[#17130f] sm:text-[46px]">{config.relatedTitle}</h2>
                </div>
                <Link href={`/${config.basePath}`} className="hidden items-center gap-2 text-xs font-black text-[#17130f] sm:inline-flex">
                  View all
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <AutoProductCarousel label={config.relatedTitle}>
                {relatedItems.map((item) => (
                  <ProductPageCard key={`detail-related-${item.id}`} product={item} basePath={config.basePath} />
                ))}
              </AutoProductCarousel>
            </section>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dedbd4] bg-[#faf9f6]/96 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-[#17130f]">{displayPrice}</p>
            {isRawMaterial && selectedVariant?.weight && (
              <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a837a]">{selectedVariant.weight}</p>
            )}
          </div>
          <button
            type="button"
            onClick={addToBag}
            disabled={!canPurchase}
            className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#17130f] px-5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Add to bag
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
