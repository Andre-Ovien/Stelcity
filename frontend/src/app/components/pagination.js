"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const buildPageRange = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  const validPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)

  return validPages.reduce((range, page, index) => {
    if (index > 0 && page - validPages[index - 1] > 1) {
      range.push(`ellipsis-${page}`)
    }
    range.push(page)
    return range
  }, [])
}

const Pagination = ({ currentPage, totalPages, basePath, onPageChange }) => {
  if (totalPages <= 1) return null

  const pageRange = buildPageRange(currentPage, totalPages)

  return (
    <nav aria-label="Catalogue pagination" className="mt-14 flex items-center justify-between border-t border-[#dedbd4] pt-7">
      {currentPage === 1 ? (
        <span className="flex items-center gap-2 text-xs font-black text-[#17130f] opacity-30" aria-disabled="true">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      ) : (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-2 text-xs font-black text-[#17130f] transition hover:-translate-x-0.5"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      )}

      <div className="flex items-center gap-1.5">
        {pageRange.map((page) =>
          typeof page === "string" ? (
            <span key={page} className="grid h-9 w-7 place-items-center text-xs text-[#8b857d]">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={page === 1 ? basePath : `${basePath}?page=${page}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black transition ${
                currentPage === page
                  ? "bg-[#17130f] text-white"
                  : "text-[#716b63] hover:bg-[#ebe8e1] hover:text-[#17130f]"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage === totalPages ? (
        <span className="flex items-center gap-2 text-xs font-black text-[#17130f] opacity-30" aria-disabled="true">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-2 text-xs font-black text-[#17130f] transition hover:translate-x-0.5"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </nav>
  )
}

export default Pagination
