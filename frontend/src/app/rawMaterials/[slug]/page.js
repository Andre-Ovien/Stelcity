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
      <div className="flex gap-2 mb-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-8 w-14 bg-gray-200 rounded-full" />)}
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-6" />
      <div className="h-12 bg-gray-200 rounded-full w-full" />
    </div>
  )
}

export default function RawMaterialDetailPage({ params }) {
  const { slug } = use(params)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  useEffect(() => {
    getProductDetail(slug).then((data) => {
      setProduct(data)
      if (data.variants.length > 0) {
        setSelectedVariant(data.variants[0])
      }
      setLoading(false)
    })
  }, [slug])

  const currentPrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : product?.price

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id}`,
      name: product.name,
      price: currentPrice,
      image: product.image,
      quantity,
      variant: selectedVariant?.weight || null,
      variantId: selectedVariant?.id || null,
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
      <div className="text-center py-20 text-gray-400">Product not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white my-6">
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
          ₦{currentPrice?.toLocaleString()}
        </p>

        <div className="flex items-center gap-1 mt-1 mb-4">
          <span className="text-yellow-400 text-[13px]">★★★★★</span>
          <span className="text-[12px] text-gray-400">5.0</span>
        </div>

        {product.variants.length > 0 && (
          <div className="mb-5">
            <p className="text-[13px] font-medium text-gray-700 mb-2">Select Weight</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v)
                    setQuantity(1)
                  }}
                  className={`px-4 py-1.5 rounded-full border text-[13px] font-medium transition-all ${
                    selectedVariant?.id === v.id
                      ? "bg-[#D65A5A] text-white border-[#D65A5A]"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>
        )}

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
              onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock || product.stock, q + 1))}
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