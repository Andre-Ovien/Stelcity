"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react"
import { FaHeart } from "react-icons/fa"
import Header from "../components/Header"
import { getServices } from "../lib/services"
import { useFavStore } from "../store/favStore"
import toast from "react-hot-toast"

const CARD_LAYOUTS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
]

const IMAGE_POSITIONS = [
  "object-center",
  "object-[50%_42%]",
  "object-center",
  "object-[50%_38%]",
  "object-center",
  "object-[50%_42%]",
]

function ServiceCard({ service, index }) {
  const toggleFav = useFavStore((state) => state.toggleFav)
  const isFav = useFavStore((state) => state.isFav(service.slug))
  const items = Array.isArray(service.items) ? service.items : []
  const minPrice = items.length > 0
    ? Math.min(...items.map((item) => item.price))
    : null

  const handleToggleFav = (event) => {
    event.stopPropagation()
    toggleFav({
      slug: service.slug,
      name: service.category,
      price: minPrice ?? 0,
      priceLabel: minPrice ? `From ₦${minPrice.toLocaleString()}` : "",
      image: service.image,
      description: service.description,
      badge: null,
      rating: 5,
      type: "service",
    })
    toast.success(isFav ? "Removed from favourites" : "Added to favourites!")
  }

  return (
    <article
      className={`group relative min-h-[440px] overflow-hidden rounded-[26px] bg-[#8a9788] shadow-[0_22px_60px_rgba(78,54,41,0.12)] sm:min-h-[500px] ${CARD_LAYOUTS[index % CARD_LAYOUTS.length]}`}
    >
      <Link
        href={`/our-services/${service.slug}`}
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d65a5a]"
        aria-label={`View ${service.category} services`}
      >
        <span className="sr-only">View {service.category}</span>
      </Link>

      {service.image ? (
        <Image
          src={service.image}
          alt={service.category}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className={`object-cover transition duration-700 group-hover:scale-[1.035] ${IMAGE_POSITIONS[index % IMAGE_POSITIONS.length]}`}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#889687,#c9a68f)]">
          <Sparkles className="absolute right-10 top-10 h-16 w-16 text-white/40" strokeWidth={1.2} aria-hidden="true" />
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,24,20,0.02)_20%,rgba(28,24,20,0.22)_55%,rgba(28,24,20,0.86)_100%)]" />

      <div className="pointer-events-none absolute left-5 top-5 z-20 rounded-full border border-white/45 bg-[#fffaf3]/88 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#332923] backdrop-blur-md sm:left-6 sm:top-6">
        {String(index + 1).padStart(2, "0")}
      </div>

      <button
        type="button"
        onClick={handleToggleFav}
        className="absolute right-5 top-5 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-[#fffaf3]/90 text-[#b7afa8] shadow-[0_8px_24px_rgba(38,29,24,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white sm:right-6 sm:top-6"
        aria-label={isFav ? `Remove ${service.category} from favourites` : `Add ${service.category} to favourites`}
      >
        <FaHeart className={isFav ? "text-[#d65a5a]" : "text-[#b7afa8]"} size={13} aria-hidden="true" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 text-white sm:p-8">
        <div className="flex items-end justify-between gap-5">
          <div className="max-w-[620px]">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.13em] text-white/70">
              <span>{items.length} {items.length === 1 ? "treatment" : "treatments"}</span>
              {minPrice !== null && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/45" aria-hidden="true" />
                  <span>From ₦{minPrice.toLocaleString()}</span>
                </>
              )}
            </div>
            <h2 className="text-[30px] font-black leading-[0.95] tracking-[-0.045em] sm:text-[40px]">{service.category}</h2>
            {service.description && (
              <p className="mt-3 max-w-xl line-clamp-2 text-sm leading-6 text-white/76">{service.description}</p>
            )}
          </div>

          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fffaf3] text-[#2f2823] transition duration-300 group-hover:rotate-45" aria-hidden="true">
            <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </article>
  )
}

function ServiceCardSkeleton({ index }) {
  return (
    <div
      className={`min-h-[440px] animate-pulse rounded-[26px] bg-[#ded4ca] sm:min-h-[500px] ${CARD_LAYOUTS[index % CARD_LAYOUTS.length]}`}
    >
      <div className="flex h-full items-end p-7">
        <div className="w-full">
          <div className="h-3 w-24 bg-white/45" />
          <div className="mt-4 h-9 w-2/3 bg-white/55" />
          <div className="mt-4 h-4 w-full max-w-md bg-white/35" />
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage({ initialServices = [] }) {
  const [services, setServices] = useState(initialServices)
  const [loading, setLoading] = useState(initialServices.length === 0)

  useEffect(() => {
    if (initialServices.length > 0) return undefined

    let isCurrent = true

    getServices()
      .then((data) => {
        if (isCurrent) setServices(data || [])
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [initialServices.length])

  return (
    <div className="min-h-screen bg-[#fff8ef] text-[#241b18]">
      <Header immersive />

      <main>
        <section className="relative overflow-hidden bg-[#ead8c8] px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-14 lg:pb-28 lg:pt-36">
          <div className="pointer-events-none absolute -left-24 top-28 h-80 w-80 rounded-full bg-[#f6dfd3]/75 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-[24%] h-72 w-72 rounded-full bg-[#b7c0ad]/38 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1280px] gap-14 lg:min-h-[650px] lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div className="relative z-10 max-w-[610px]">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#7f9277] sm:text-[11px]">
                Stelcity treatments
              </p>
              <h1 className="mt-5 text-[52px] font-black leading-[0.88] tracking-[-0.06em] text-[#241b18] sm:text-[72px] lg:text-[88px]">
                Care that feels
                <span className="block font-serif text-[0.78em] font-normal italic tracking-[-0.045em] text-[#c56f64]">
                  made for you.
                </span>
              </h1>
              <p className="mt-7 max-w-[500px] text-sm leading-6 text-[#68564b] sm:text-base sm:leading-7">
                Thoughtful facials, restorative body care, and expert-led treatments shaped around your skin—not a one-size-fits-all routine.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Skin rituals", "Body care", "Advanced treatments"].map((label) => (
                  <span key={label} className="rounded-full border border-[#6e5c51]/18 bg-[#fff8ef]/55 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#665348]">
                    {label}
                  </span>
                ))}
              </div>

              <a
                href="#treatments"
                className="mt-9 inline-flex h-12 items-center gap-3 rounded-full bg-[#241b18] px-6 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#3c302a]"
              >
                Find your treatment
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="relative min-h-[500px] sm:min-h-[620px] lg:min-h-full">
              <div className="absolute left-0 top-0 h-[58%] w-[72%] overflow-hidden rounded-[28px] bg-[#d8c7b8] shadow-[0_28px_80px_rgba(74,49,34,0.14)]">
                <Image
                  src="/images/service-facial-treatment.png"
                  alt="Professional facial treatment at Stelcity"
                  fill
                  priority
                  sizes="(max-width: 1024px) 72vw, 42vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute right-0 top-[18%] h-[44%] w-[42%] overflow-hidden rounded-[24px] border-4 border-[#ead8c8] bg-[#cab6a6] shadow-[0_24px_60px_rgba(74,49,34,0.17)]">
                <Image
                  src="/images/service-spa-massage.png"
                  alt="Relaxing spa massage treatment"
                  fill
                  sizes="(max-width: 1024px) 42vw, 25vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute bottom-0 left-[11%] h-[40%] w-[74%] overflow-hidden rounded-[26px] border-4 border-[#ead8c8] bg-[#c7b5a7] shadow-[0_26px_70px_rgba(74,49,34,0.18)]">
                <Image
                  src="/images/service-wellness-overlap.png"
                  alt="Calm wellness treatment at Stelcity"
                  fill
                  sizes="(max-width: 1024px) 74vw, 42vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="absolute bottom-[9%] right-[2%] z-10 grid h-24 w-24 place-items-center rounded-full border border-[#241b18]/10 bg-[#fff8ef]/92 text-center text-[9px] font-black uppercase leading-4 tracking-[0.12em] text-[#5e4d43] shadow-[0_16px_40px_rgba(74,49,34,0.12)] backdrop-blur-md sm:h-28 sm:w-28">
                Skin
                <br />
                body
                <br />
                wellness
              </div>
            </div>
          </div>
        </section>

        <section id="treatments" className="bg-[#fff8ef] px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-[1280px]">
            <header className="grid gap-6 border-b border-[#241b18]/12 pb-10 lg:grid-cols-[1fr_0.48fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7f9277]">Treatment menu</p>
                <h2 className="mt-4 max-w-[780px] text-[42px] font-black leading-[0.92] tracking-[-0.055em] sm:text-[58px] lg:text-[70px]">
                  Choose the care your skin is asking for.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#6f5b51] lg:justify-self-end">
                Open a category to see its available treatments, pricing, and booking options.
              </p>
            </header>

            <div className="mt-10 grid gap-4 lg:grid-cols-12">
              {loading
                ? Array.from({ length: 6 }, (_, index) => <ServiceCardSkeleton key={index} index={index} />)
                : services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
            </div>

            {!loading && services.length === 0 && (
              <div className="mt-10 border-y border-[#241b18]/12 py-20 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-[#c56f64]" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black tracking-[-0.035em]">Our treatment menu is being refreshed.</h3>
                <p className="mt-3 text-sm text-[#756258]">Please check back shortly.</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
