import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Maximize2, Sparkles } from "lucide-react"

const BEST_SELLERS = [
  {
    name: "Caramel Body Butter",
    description: "Heals damaged skin, helps fade stretch marks, and keeps skin deeply hydrated.",
    price: "₦10,000",
    image: "/images/bestseller-caramel-body-butter-cutout.png",
    background: "bg-[#e5efdc]",
    accent: "bg-[#c7dbba]",
    imageClassName: "object-contain object-bottom p-0 drop-shadow-xl -translate-y-8 scale-[1.1] sm:-translate-y-10 sm:scale-[1.16]",
  },
  {
    name: "Glass Skin Face & Body Set",
    description: "A lightening face and body set for skin uniformity, brightening, and a polished glow.",
    price: "₦70,000",
    image: "/images/bestseller-glass-skin-set-cutout.png",
    background: "bg-[#dff2f5]",
    accent: "bg-[#c6e1e5]",
    imageClassName: "object-contain object-bottom p-0 drop-shadow-xl -translate-y-6 scale-[1.06] sm:-translate-y-8",
    featured: true,
  },
  {
    name: "Skin Lightening Set",
    description: "Gradually lightens the skin and gives a clean, radiant glow.",
    price: "₦55,000",
    image: "/images/bestseller-skin-lightening-set-cutout.png",
    background: "bg-[#f8d9cd]",
    accent: "bg-[#efc0b0]",
    imageClassName: "object-contain object-bottom p-0 drop-shadow-xl -translate-y-6 scale-[1.16] sm:-translate-y-8",
  },
  {
    name: "Acne Set",
    description: "Targets pimples, blemishes, clogged pores, and excess oil for clearer-looking skin.",
    price: "₦30,000",
    image: "/images/bestseller-acne-set-cutout.png",
    background: "bg-[#eee6f5]",
    accent: "bg-[#d8cae5]",
    imageClassName: "object-contain object-bottom p-0 drop-shadow-xl -translate-y-6 scale-[1.16] sm:-translate-y-8",
  },
]

function BestSellerTile({ product, index }) {
  const isFeatured = product.featured

  return (
    <article
      className={`${product.background} relative grid min-h-[270px] min-w-[86vw] snap-center overflow-hidden rounded-[8px] border border-black/5 shadow-[0_18px_45px_rgba(42,30,18,0.08)] sm:min-w-[540px] ${
        isFeatured ? "lg:min-w-[630px]" : "lg:min-w-[380px]"
      }`}
    >
      <div className="absolute -bottom-10 right-8 h-36 w-36 rounded-full opacity-70 blur-sm sm:h-44 sm:w-44" />
      <div className={`absolute bottom-12 right-14 h-28 w-28 rounded-full ${product.accent} opacity-70`} />

      <div className="relative z-10 grid h-full grid-cols-1 sm:grid-cols-[0.78fr_1.22fr]">
        <div className="flex min-h-[210px] flex-col justify-center px-6 py-7 sm:px-7 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase text-[#6d6258]">
            <Sparkles className="h-3.5 w-3.5 text-[#829442]" aria-hidden="true" />
            Bestseller 0{index + 1}
          </div>

          <h3 className="max-w-[260px] text-2xl font-black leading-[0.98] text-[#211b17]">
            {product.name}
          </h3>

          <p className="mt-4 max-w-[300px] text-sm leading-5 text-[#5f554d]">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-[#17130f] px-5 text-xs font-black uppercase text-white transition hover:-translate-y-0.5 hover:bg-[#2a241f]"
            >
              Explore
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <span className="text-sm font-black text-[#211b17]">{product.price}</span>
          </div>
        </div>

        <div className="relative min-h-[250px] overflow-hidden sm:min-h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={isFeatured ? "(max-width: 1024px) 70vw, 360px" : "(max-width: 1024px) 70vw, 250px"}
            className={product.imageClassName}
          />
          <div className="pointer-events-none absolute inset-x-8 bottom-10 h-12 rounded-full bg-black/10 blur-xl" />
        </div>
      </div>
    </article>
  )
}

const BestSellers = () => {
  return (
    <section className="overflow-hidden bg-[#fff6e4] py-16 text-[#17130f] sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[980px] px-5 text-center">
        <p className="text-xs font-black uppercase text-[#8a7a65]">Stelcity best sellers</p>
        <h2 className="mx-auto mt-3 max-w-[650px] font-serif text-[38px] font-black leading-[0.98] sm:text-[52px]">
          Be choosy with your skincare routine
        </h2>
      </div>

      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-20 bg-[linear-gradient(90deg,#fff6e4,rgba(255,246,228,0))] lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 bg-[linear-gradient(270deg,#fff6e4,rgba(255,246,228,0))] lg:block" />

        <div className="scrollbar-hide flex snap-x items-stretch gap-6 overflow-x-auto px-5 pb-8 sm:px-8 lg:px-[max(2.5rem,calc((100vw-1180px)/2))]">
          {BEST_SELLERS.map((product, index) => (
            <BestSellerTile key={product.name} product={product} index={index} />
          ))}
        </div>

        <Link
          href="/products"
          aria-label="Explore all products"
          className="absolute -bottom-10 right-[max(1.25rem,calc((100vw-1180px)/2))] z-20 hidden h-20 w-20 place-items-center rounded-full bg-white/80 text-[#17130f] shadow-[0_18px_40px_rgba(42,30,18,0.12)] backdrop-blur-md transition hover:-translate-y-1 lg:grid"
        >
          <Maximize2 className="h-8 w-8" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default BestSellers
