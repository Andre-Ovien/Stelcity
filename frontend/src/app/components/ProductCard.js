import Image from "next/image"
import { FaHeart } from "react-icons/fa"

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 relative flex flex-col">

    
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide uppercase">
          {product.badge}
        </span>
      )}

      
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      
      <div className="mt-2.5 flex justify-between items-start gap-1">
        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight">
          {product.name}
        </h3>
        <FaHeart className="text-red-400 text-[13px] shrink-0 mt-0.5" />
      </div>

    
      <div className="flex items-center gap-2 mt-1">
        {product.originalPrice && (
          <span className="text-[11px] text-gray-400 line-through">
            ₦{product.originalPrice.toLocaleString()}
          </span>
        )}
        <span className="text-[13px] font-bold text-gray-900">
          ₦{product.price.toLocaleString()}
        </span>
      </div>

      
      <div className="flex text-yellow-400 text-[12px] mt-1 gap-0.5">
        ★★★★★
      </div>

    </div>
  )
}

export default ProductCard