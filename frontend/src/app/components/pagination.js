const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8 text-[13px]">

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-400 disabled:opacity-30 hover:text-gray-700 transition-colors"
      >
        ...Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 rounded-full text-[12px] font-medium transition-colors
              ${currentPage === page
                ? "bg-[#D65A5A] text-white"
                : "text-gray-500 hover:text-gray-800"
              }`}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-400 disabled:opacity-30 hover:text-gray-700 transition-colors"
      >
        Next...
      </button>

    </div>
  )
}

export default Pagination