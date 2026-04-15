"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { getCollectionPreview } from "../lib/homeCollection";
import { useFavStore } from "../store/favStore";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

const TABS = [
  { label: "All", value: "all" },
  { label: "Products", value: "products" },
  { label: "Raw Materials", value: "raw" },
  { label: "Services", value: "services" },
];

const showMore = {
  all:      { label: "Show more", href: "/products" },
  products: { label: "Show more products", href: "/products" },
  raw:      { label: "Show more raw materials", href: "/raw-materials" },
  services: { label: "View all services", href: "/our-services" },
};

function ProductCard({ product }) {
  const toggleFav = useFavStore((s) => s.toggleFav);
  const isFav = useFavStore((s) => s.isFav(product.slug)); 
  const addItem = useCartStore((s) => s.addItem);

  const href =
    product.type === "service"
      ? "/services"
      : product.type === "raw"
      ? `/raw-materials/${product.slug}`
      : `/products/${product.slug}`;

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
      type: product.type,
    });
    toast.success(
      isFav ? "Removed from favourites" : "Added to favourites!"
    );
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (product.type === "service") {
      window.location.href = "/our-services";
      return;
    }

    if (product.type === "raw") {
      window.location.href = `/raw-materials/${product.slug}`;
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: null,
      variantId: null,
    });
    toast.success("Added to cart!");
  };

  const buttonLabel =
    product.type === "service"
      ? "View Service"
      : product.type === "raw"
      ? "Select Weight"
      : "Add to Cart";

  return (
    <Link href={href} className="h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 relative flex flex-col h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
            {product.badge}
          </span>
        )}

        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#EEF5EE] flex items-center justify-center shrink-0">
          <button
            onClick={handleToggleFav}
            className="
              absolute top-2 right-2 z-10
              bg-white rounded-full p-1.5 shadow-sm
              transition-all duration-150
              hover:scale-110 hover:shadow-md
              active:scale-90
            "
          >
            <FaHeart
              className={isFav ? "text-red-400" : "text-gray-300"}
              size={12}
            />
          </button>

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <span className="text-[36px]">✨</span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between mt-2.5">
          <div>
            <h3 className="text-[13px] font-semibold text-gray-800 sm:text-[14px] xl:text-lg line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-medium text-gray-900 sm:text-[12px] xl:text-base">
                {product.priceLabel}
              </span>
            </div>

            <div className="flex text-yellow-400 text-[12px] mt-1 gap-0.5 xl:text-base">
              ★★★★★
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="
              bg-[#D65A5A] flex items-center justify-center gap-1
              border border-transparent rounded-full
              px-2 py-1.5 mt-2
              text-[11px] sm:text-[12px] xl:text-sm
              text-white font-medium w-full
              transition-all duration-200
              hover:bg-[#c44f4f] hover:shadow-md hover:-translate-y-0.5
              active:scale-95 active:bg-[#b84444] active:shadow-none
            "
          >
            {buttonLabel}
            <IoAddCircleOutline size={14} className="xl:w-4 xl:h-4 shrink-0" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-2 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
      <div className="h-8 bg-gray-200 rounded-full w-full mt-2" />
    </div>
  );
}

const ProductGrid = () => {
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(6);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setCount(12);
      } else if (window.innerWidth >= 768) {
        setCount(8);
      } else {
        setCount(6);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getCollectionPreview(category).then((data) => {
      if (mounted) {
        setItems(data || []);
        setLoading(false);
      }
    });

    return () => { mounted = false };
  }, [category]);

  return (
    <section
      className="px-4 sm:px-6 lg:px-10 xl:px-14 py-10 xl:py-14 bg-[#F7F6F6]"
      id="collection"
    >
      <h2 className="font-bold text-[22px] sm:text-2xl xl:text-3xl text-gray-900 underline text-center ">
        Browse Our Collection
      </h2>

      <p className="text-[13px] sm:text-sm xl:text-lg text-gray-500 mt-1 max-w-xl md:mt-4 text-center mx-auto">
        Explore our skincare categories to find what works best for your skin.
      </p>

      <div className="flex gap-3 mt-5 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`
              shrink-0 px-4 py-1.5 rounded-full border
              text-[13px] sm:text-sm xl:text-base font-medium
              transition-all duration-200
              active:scale-95
              ${
                category === tab.value
                  ? "bg-[#D65A5A] text-white border-[#D65A5A] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#D65A5A] hover:text-[#D65A5A]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 sm:gap-5 lg:gap-5">
        {loading
          ? Array.from({ length: count }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : items.slice(0, count).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-[13px] sm:text-sm">
          Nothing to show right now.
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href={showMore[category].href}
          className="
            inline-block text-[13px] sm:text-sm xl:text-base
            text-gray-500 underline underline-offset-2
            transition-colors duration-200
            hover:text-[#D65A5A]
            active:text-[#b84444]
          "
        >
          {showMore[category].label}
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;