"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react"
import toast from "react-hot-toast"
import { useCartStore } from "../store/cartStore"
import { useFavStore } from "../store/favStore"

const ProductPageCard = ({ product, basePath = "products" }) => {
  const addItem = useCartStore((state) => state.addItem)
  const toggleFav = useFavStore((state) => state.toggleFav)
  const isFav = useFavStore((state) => state.isFav(product.slug))
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const isRawMaterial = basePath === "raw-materials"
  const href = `/${basePath}/${product.slug}`

  const handleAddToCart = () => {
    if (isRawMaterial) {
      router.push(href)
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: null,
    })
    toast.success("Added to cart!")
  }

  const handleToggleFav = () => {
    toggleFav({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      priceLabel: product.priceLabel,
      image: product.image,
      description: product.description,
      badge: product.badge,
      rating: product.rating,
      variants: product.variants || [],
      type: isRawMaterial ? "raw" : "product",
    })
    toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
  }

  const formattedPrice = product.priceLabel || (
    Number.isFinite(product.price)
      ? `₦${product.price.toLocaleString()}`
      : "Price unavailable"
  )

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#f0eee9] sm:rounded-[24px]">
        <Link href={href} aria-label={`View ${product.name}`} className="relative block h-full w-full">
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="lazy"
              onError={() => setImageError(true)}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 28vw"
            />
          ) : (
            <div className="grid h-full place-items-center bg-[#e5eadf] px-6 text-center">
              <span className="font-serif text-lg italic text-[#788773]">Image coming soon</span>
            </div>
          )}
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-[#17130f] backdrop-blur-sm sm:left-4 sm:top-4 sm:text-[9px]">
          {isRawMaterial ? "Raw material" : "Skincare"}
        </span>

        <button
          type="button"
          suppressHydrationWarning
          aria-label={isFav ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
          onClick={handleToggleFav}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-[#17130f] shadow-[0_8px_24px_rgba(31,26,20,0.1)] backdrop-blur-sm transition hover:scale-105 sm:right-4 sm:top-4"
        >
          <Heart
            className={`h-4 w-4 ${isFav ? "fill-[#d16f66] text-[#d16f66]" : "text-[#17130f]"}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4 sm:pt-5">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
          <Link href={href} className="min-w-0">
            <h3 className="line-clamp-2 text-[14px] font-black leading-[1.2] tracking-[-0.015em] text-[#17130f] transition group-hover:text-[#ba5f58] sm:text-lg">
              {product.name}
            </h3>
          </Link>
          <span className="shrink-0 text-[12px] font-black text-[#17130f] sm:text-base">
            {formattedPrice}
          </span>
        </div>

        <p className="mt-2 hidden text-xs leading-5 text-[#777068] sm:line-clamp-2">
          {product.description}
        </p>

        {isRawMaterial && product.variants?.length > 0 && (
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b857d]">
            {product.variants.length} {product.variants.length === 1 ? "weight" : "weights"} available
          </p>
        )}

        <div className="mt-auto flex gap-2 pt-4 sm:pt-5">
          <Link
            href={href}
            className="grid h-10 min-w-0 flex-1 place-items-center rounded-full border border-[#cbc6bd] bg-white px-3 text-[10px] font-black text-[#17130f] transition hover:border-[#17130f] sm:h-11 sm:text-xs"
          >
            Details
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#17130f] px-3 text-[10px] font-black text-white transition hover:-translate-y-0.5 hover:bg-[#322c26] sm:h-11 sm:text-xs"
          >
            <span>{isRawMaterial ? "Choose" : "Add to bag"}</span>
            {isRawMaterial
              ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              : <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductPageCard
