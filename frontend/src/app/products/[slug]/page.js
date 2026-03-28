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
    <div className="animate-pulse px-4 pb-10">
      <div className="w-full aspect-square rounded-2xl bg-gray-200 mb-4" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-6" />
      <div className="h-12 bg-gray-200 rounded-full w-full" />
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
    getProductDetail(slug).then((data) => {
      setProduct(data)
      setLoading(false)
    })
  }, [slug])

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

  if (loading) return (
    <div className="min-h-screen bg-white my-6">
      <Header/>
      <ProductDetailSkeleton />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-white my-6">
      <Header />
      <div className="text-center py-20 text-gray-400 mt-6">Product not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white my-0">
      <Header />

      <div className="px-4 pb-24">

        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
              {product.badge}
            </span>
          )}
        </div>

        <h1 className="text-[20px] font-bold text-gray-900">{product.name}</h1>
        <p className="text-[16px] font-semibold text-[#D65A5A] mt-1">
          {product.priceLabel}
        </p>

        <div className="flex items-center gap-1 mt-1 mb-4">
          <span className="text-yellow-400 text-[13px]">★★★★★</span>
          <span className="text-[12px] text-gray-400">5.0</span>
        </div>

        <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>

        <div className="flex items-center gap-4 mt-6">
          <span className="text-[14px] font-medium text-gray-700">Quantity</span>
          <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-gray-500 text-[18px] font-medium"
            >
              −
            </button>
            <span className="text-[14px] font-semibold w-5 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="text-gray-500 text-[18px] font-medium"
            >
              +
            </button>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 z-50">
        <button
          onClick={handleAddToCart}
          className="flex-1 border border-[#D65A5A] text-[#D65A5A] font-semibold py-3 rounded-full text-[14px] hover:bg-[#fff0f0] transition-colors"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors"
        >
          Buy Now
        </button>
      </div>

    </div>
  )
}