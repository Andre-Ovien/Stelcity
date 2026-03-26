"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import ProductPageCard from "../components/ProductSection"
import Pagination from "../components/pagination"
import { getProducts } from "../lib/product"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 10

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Go to Raw Materials", value: "rawMaterials" },
  { label: "Go to Services", value: "Services" },
]
// export const metadata = {
//   title: "Products",
//   description: "Browse our range of premium skincare products.",
// }

function ProductPageCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-2 animate-pulse h-full">
      <div className="w-full aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded-full w-full mt-auto" />
    </div>
  )
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("default")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getProducts(currentPage).then((data) => {
      if (mounted) {
        setAllProducts(data.products)
        setTotalCount(data.count)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [currentPage])

  const handleSort = (value) => {
    if (value === "rawMaterials") {
      router.push("/rawMaterials")
      return
    }
    if (value === "Services") {
      router.push("/services")
      return
    }
    setSort(value)
    setCurrentPage(1)
  }

  const searched = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...searched].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price
    if (sort === "price_desc") return b.price - a.price
    return 0
  })

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white my-6">
      <Header />

      <div className="px-4 pb-10 pt-6">

        <h1 className="text-[20px] font-bold text-gray-900 text-center mb-4  xl:text-3xl ">
          Shop Our Products
        </h1>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search products..."
              className="w-full border border-gray-200 rounded-full px-4 py-2 text-[13px] outline-none  text-gray-700 xl:text-lg"
            />
            
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[12px] text-gray-500 xl:text-lg">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="text-[12px] border border-gray-200 rounded-lg px-2 py-1 outline-none text-gray-700 xl:text-lg"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-stretch">
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductPageCardSkeleton key={i} />
              ))
            : sorted.map((product, index) => (
                <ProductPageCard key={`${product.id}-${index}`} product={product} />
              ))
          }
        </div>

        {!loading && sorted.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-[14px]">
            No products found for `{search}`
          </div>
        )}

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        )}

      </div>
    </div>
  )
}