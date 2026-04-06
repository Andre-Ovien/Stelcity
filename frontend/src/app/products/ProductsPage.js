"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "../components/Header"
import ProductPageCard from "../components/ProductSection"
import Pagination from "../components/pagination"
import { getProducts } from "../lib/product"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 12 

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Go to Raw Materials", value: "rawMaterials" },
  { label: "Go to Services", value: "Services" },
]

function ProductPageCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-4 flex flex-col gap-2 animate-pulse h-full shadow-sm">
      <div className="w-full aspect-square rounded-lg bg-gray-200" />
      <div className="space-y-2 mt-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="h-8 bg-gray-200 rounded-lg w-full mt-auto" />
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
    <div className="min-h-screen bg-[#FBFBFC]">
      <Header />

      <main className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Page Title */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Our Products
          </h1>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full md:w-auto bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Grid */}
        {/* grid-cols-2 is the mobile default, lg:grid-cols-3 for tablets, xl:grid-cols-4 for desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductPageCardSkeleton key={i} />)
          ) : (
            sorted.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full"
              >
                <ProductPageCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && sorted.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-sm">No products found for "{search}"</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  )
}