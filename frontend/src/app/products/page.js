"use client"

import { useState, useEffect, useCallback } from "react"
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

  const fetchProducts = useCallback((page) => {
    setLoading(true)
    let mounted = true
    getProducts(page).then((data) => {
      if (mounted) {
        setAllProducts(data.products || [])
        setTotalCount(data.count || 0)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const cleanup = fetchProducts(currentPage)
    return cleanup
  }, [currentPage, fetchProducts])

  const handleSort = (value) => {
    if (value === "rawMaterials") return router.push("/rawMaterials")
    if (value === "Services") return router.push("/services")
    setSort(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 xl:py-10">
        {/* Your original Title layout */}
        <h1 className="text-xl sm:text-2xl xl:text-4xl font-bold text-gray-900 text-center mb-6 xl:mb-8 tracking-tight pt-6 xl:pt-0">
          Shop Our Products
        </h1>

        {/* Your original Search and Sort layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 xl:mb-8">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 xl:w-5 xl:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full border border-gray-200 bg-white rounded-full pl-9 pr-4 py-2.5 text-sm xl:text-base text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs sm:text-sm xl:text-base text-gray-500 whitespace-nowrap">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="text-xs sm:text-sm xl:text-base border border-gray-200 bg-white rounded-lg px-3 py-2.5 outline-none text-gray-700 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 active:bg-gray-100"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Updated Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {loading
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <ProductPageCardSkeleton key={i} />
              ))
            : sorted.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] rounded-2xl bg-white border border-transparent hover:border-gray-100 overflow-hidden"
                >
                  <ProductPageCard product={product} />
                </div>
              ))
          }
        </div>

        {!loading && sorted.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm xl:text-base">
            No products found for &ldquo;{search}&rdquo;
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-12 xl:mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}