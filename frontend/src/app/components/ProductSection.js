// src/app/components/ProductPageCard.jsx
"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "../store/cartStore";
import { useFavStore } from "../store/favStore";
import toast from "react-hot-toast";

const ProductPageCard = ({ product, basePath = "products" }) => {
  const addItem = useCartStore((s) => s.addItem);
  const toggleFav = useFavStore((s) => s.toggleFav);
  const isFav = useFavStore((s) => s.isFav(product.slug)); 
  const router = useRouter();

  const isRawMaterial = basePath === "raw-materials";

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isRawMaterial) {
      router.push(`/${basePath}/${product.slug}`);
      return;
    }
    addItem({
      id: product.id, 
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: null,
    });
    toast.success("Added to cart!");
  };

  const handleToggleFav = (e) => {
    e.preventDefault();
    toggleFav({
      id: product.id,
      slug: product.slug, 
      name: product.name,
      price: product.price,
      priceLabel: product.priceLabel,
      image: product.image,
      description: product.description,
      badge: product.badge,
      rating: product.rating,
      variants: product.variants || [],
      type: isRawMaterial ? "raw" : "product",
    });
    toast.success(
      isFav ? "Removed from favourites" : "Added to favourites!"
    );
  };

  return (
    <Link href={`/${basePath}/${product.slug}`} className="flex flex-col h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2 h-full">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 shrink-0">
          {product.badge && (
            <span className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {product.badge}
            </span>
          )}
          <button
            suppressHydrationWarning
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            onClick={handleToggleFav}
            className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm"
          >
            <FaHeart
              suppressHydrationWarning
              className={isFav ? "text-red-400" : "text-gray-300"}
              size={12}
            />
          </button>
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            
          />
        </div>

        <h3 className="text-[13px] font-semibold text-gray-800 leading-tight xl:text-xl line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-400 leading-tight line-clamp-2 xl:text-lg flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              ₦{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-[12px] font-medium text-gray-900 xl:text-lg">
            {product.priceLabel || `₦${product.price.toLocaleString()}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-[11px] xl:text-xl">
            {"★".repeat(product.rating)}
          </span>
          <span className="text-[11px] text-gray-400">{product.rating}.0</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-1.5 bg-[#D65A5A] text-white rounded-full py-2 text-[12px] font-medium hover:bg-[#c44f4f] transition-colors w-full mt-auto xl:text-xl shrink-0"
        >
          {isRawMaterial ? "Select Weight" : "Add to Cart"}
          <IoAddCircleOutline size={15} />
        </button>
      </div>
    </Link>
  );
};

export default ProductPageCard;