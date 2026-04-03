"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import { getProductDetail } from "../../lib/productDetail"
import { useCartStore } from "../../store/cartStore"
import toast from "react-hot-toast"

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse px-4 pb-10 max-w-5xl mx-auto">
      <div className="md:flex md:gap-8">
        <div className="w-full md:w-1/2 aspect-square rounded-2xl bg-gray-200 mb-4 md:mb-0" />
        <div className="md:flex-1 flex flex-col gap-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-12 bg-gray-200 rounded-full w-full mt-4" />
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage({ params }) {
  const { slug } = use(params) 
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  useEffect(() => {
    if (!slug) return
    getProductDetail(slug)
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch(() => {
        setProduct(null)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="text-center py-20 text-gray-400">Product not found</div>
      </div>
    )
  }

  const maxStock = Number(product.stock) || 99

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
    toast.success("Added to cart!")
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/cart")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-4 md:px-8 lg:px-16 pb-24 md:pb-10 max-w-5xl mx-auto xl:mt-7">
        <div className="md:flex md:gap-8 md:items-start">
          <div className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 md:mb-0 md:sticky md:top-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              loading="eager"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
                {product.badge}
              </span>
            )}
          </div>

          <div className="md:flex-1">
            <h1 className="text-[20px] md:text-[26px] font-bold text-gray-900">{product.name}</h1>
            <p className="text-[16px] md:text-[20px] font-semibold text-[#D65A5A] mt-1">{product.priceLabel}</p>

            <div className="flex items-center gap-1 mt-1 mb-4">
              <span className="text-yellow-400 text-[13px]">★★★★★</span>
              <span className="text-[12px] text-gray-400">5.0</span>
            </div>

            <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed whitespace-pre-line mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-[14px] font-medium text-gray-700">Quantity</span>
              <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-gray-500 text-[18px] font-medium hover:text-[#D65A5A] active:scale-90 transition-all"
                >
                  −
                </button>
                <span className="text-[14px] font-semibold w-5 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  className="text-gray-500 text-[18px] font-medium hover:text-[#D65A5A] active:scale-90 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="hidden md:flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 border border-[#D65A5A] text-[#D65A5A] font-semibold py-3 rounded-full text-[14px] hover:bg-[#fff0f0] active:scale-95 active:bg-[#ffe0e0] transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] active:scale-95 active:bg-[#b83e3e] transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 z-50">
        <button
          onClick={handleAddToCart}
          className="flex-1 border border-[#D65A5A] text-[#D65A5A] font-semibold py-3 rounded-full text-[14px] hover:bg-[#fff0f0] active:scale-95 transition-all"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] active:scale-95 transition-all"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}