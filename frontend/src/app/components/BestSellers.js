"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { IoAddCircleOutline } from "react-icons/io5"
import { getBestSellers } from "../lib/bestSellers"

const BestSellerCard = ({ product }) => {
  return (
    <div className="min-w-42.5 bg-white rounded-2xl p-3 flex flex-col gap-2 border border-gray-100 shadow-sm">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="170px"
        />
      </div>

      <div>
        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="flex text-yellow-400 text-[11px] gap-0.5">
        {"★".repeat(product.rating)}
      </div>

      <button className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-[12px] text-gray-700 font-medium hover:bg-gray-50 transition-colors w-fit">
        Add to Cart
        <IoAddCircleOutline size={15} />
      </button>
    </div>
  )
}

const BestSellers = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getBestSellers().then((data) => setProducts(data))
  }, [])

  return (
    <section className="py-8">
      <h2 className="text-[22px] font-bold text-gray-900 px-4 mb-5">
        Our Bestsellers
      </h2>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {products.map((product) => (
          <BestSellerCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default BestSellers