"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { getServices } from "../lib/services"

const getServerMediaSnapshot = () => false
const CLONE_COUNT = 3

const CARD_TONES = [
  { surface: "#fffdf8", ink: "#241b18", label: "#5f8478" },
  { surface: "#8d9e90", ink: "#fffdf8", label: "#e7c653" },
  { surface: "#8d9e90", ink: "#fffdf8", label: "#e7c653" },
]

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", callback)
    return () => media.removeEventListener("change", callback)
  }, [query])

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function ServiceCardSkeleton() {
  return (
    <div className="h-[330px] w-full animate-pulse rounded-[14px] border border-[#755e50]/15 bg-white/40 p-3.5 sm:h-[370px] sm:p-4">
      <div className="h-4 w-24 bg-[#755e50]/15" />
      <div className="mt-2 h-3 w-3/4 bg-[#755e50]/10" />
      <div className="mt-3 h-[220px] rounded-[9px] bg-[#755e50]/15 sm:h-[250px]" />
    </div>
  )
}

function ServiceCard({ service, index, inactive = false }) {
  const tone = CARD_TONES[index % CARD_TONES.length]
  const description = service.description || "Explore specialist care created around your skin goals."

  return (
    <Link
      href={`/our-services/${service.slug}`}
      tabIndex={inactive ? -1 : undefined}
      aria-hidden={inactive || undefined}
      className="group relative block h-[330px] w-full overflow-hidden rounded-[14px] border border-[#241b18]/10 p-3.5 transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d65a5a] sm:h-[370px] sm:p-4"
      style={{ backgroundColor: tone.surface, color: tone.ink }}
    >
      <div className="relative z-10 max-w-[92%]">
        <h3 className="text-[14px] font-black leading-[1.05] tracking-[-0.025em] sm:text-[15px]">{service.category}</h3>
        <p className="mt-1 line-clamp-2 text-[9px] leading-[1.28] opacity-70 sm:text-[10px]">{description}</p>
      </div>

      <div className="absolute bottom-3 left-3 right-3 top-[94px] overflow-hidden rounded-[9px] sm:bottom-4 sm:left-4 sm:right-4 sm:top-[106px]" style={{ backgroundColor: `${tone.ink}18` }}>
        {service.image ? (
          <Image
            src={service.image}
            alt={service.category}
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 31vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-end justify-between p-5" aria-hidden="true">
            <span className="text-[58px] font-black leading-none tracking-[-0.09em] opacity-25">0{index + 1}</span>
            <Sparkles className="h-8 w-8 opacity-45" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <span
        className="absolute bottom-1.5 right-1.5 z-20 grid h-8 w-8 place-items-center rounded-full transition duration-300 group-hover:rotate-45 sm:bottom-2 sm:right-2 sm:h-9 sm:w-9"
        style={{ backgroundColor: tone.label, color: tone.ink }}
        aria-hidden="true"
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
    </Link>
  )
}

export default function ServicesFeature() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(CLONE_COUNT)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const isTablet = useMediaQuery("(min-width: 640px)")
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const visibleCount = isDesktop ? 3 : isTablet ? 2 : 1
  const indexedServices = services.map((service, index) => ({ service, originalIndex: index }))
  const carouselItems = services.length > 0
    ? [
        ...indexedServices.slice(-CLONE_COUNT),
        ...indexedServices,
        ...indexedServices.slice(0, CLONE_COUNT),
      ]
    : []
  const activeService = services.length > 0
    ? ((currentIndex - CLONE_COUNT) % services.length + services.length) % services.length
    : 0

  useEffect(() => {
    let isCurrent = true

    getServices()
      .then((data) => {
        if (isCurrent) setServices((data || []).slice(0, 6))
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    if (services.length <= visibleCount || prefersReducedMotion) return undefined

    const timer = window.setInterval(() => {
      setTransitionEnabled(true)
      setCurrentIndex((current) => current + 1)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [prefersReducedMotion, services.length, visibleCount])

  const moveSlide = (direction) => {
    if (services.length <= visibleCount) return
    setTransitionEnabled(true)
    setCurrentIndex((current) => current + direction)
  }

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return

    let resetIndex = currentIndex

    if (currentIndex >= services.length + CLONE_COUNT) {
      resetIndex = currentIndex - services.length
    } else if (currentIndex < CLONE_COUNT) {
      resetIndex = currentIndex + services.length
    }

    if (resetIndex !== currentIndex) {
      setTransitionEnabled(false)
      setCurrentIndex(resetIndex)
      window.requestAnimationFrame(() => setTransitionEnabled(true))
    }
  }

  return (
    <section id="services" className="overflow-hidden bg-[linear-gradient(180deg,#d7ad8f_0%,#ecded2_30%,#f7f0e6_100%)] px-5 py-16 text-[#241b18] sm:px-8 sm:py-20 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-col gap-7 border-b border-[#241b18]/15 pb-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8a6857] sm:text-[11px]">Our services</p>
            <h2 className="mt-4 text-[40px] font-black leading-[0.92] tracking-[-0.055em] sm:text-[58px] lg:text-[72px]">
              Care for every version of your skin.
              <span className="block font-serif text-[0.78em] font-normal italic tracking-[-0.04em] text-[#c46f65]">Choose your ritual.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-[#67554b] lg:mb-1">
            Explore six specialist treatments, then choose the exact service that suits your skin and your day.
          </p>
        </header>

        <div className="mt-8 lg:mt-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => <ServiceCardSkeleton key={index} />)}
            </div>
          ) : services.length > 0 ? (
            <div role="region" aria-roledescription="carousel" aria-label="Stelcity services">
              <div className="-mx-2 overflow-hidden">
                <div
                  className={`flex ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${transitionEnabled ? "transition-transform duration-700" : "transition-none"}`}
                  style={{ transform: `translate3d(-${currentIndex * (100 / visibleCount)}%, 0, 0)` }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {carouselItems.map(({ service, originalIndex }, itemIndex) => {
                    const isVisible = itemIndex >= currentIndex && itemIndex < currentIndex + visibleCount

                    return (
                    <div
                      key={`${service.slug}-${itemIndex}`}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={service.category}
                      aria-hidden={!isVisible}
                      className="shrink-0 px-2"
                      style={{ flexBasis: `${100 / visibleCount}%` }}
                    >
                      <ServiceCard service={service} index={originalIndex} inactive={!isVisible} />
                    </div>
                    )
                  })}
                </div>
              </div>

              {services.length > visibleCount && (
                <div className="mt-6 flex items-center justify-between gap-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#756358]">
                    {String(activeService + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveSlide(-1)}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#241b18]/15 bg-white/45 text-[#241b18] transition hover:bg-white"
                      aria-label="Previous services"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSlide(1)}
                      className="grid h-10 w-10 place-items-center rounded-full border border-[#241b18]/15 bg-white/45 text-[#241b18] transition hover:bg-white"
                      aria-label="Next services"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {!loading && services.length === 0 && (
          <div className="mt-10 border-y border-[#241b18]/15 py-10 text-center">
            <p className="text-lg font-black">Our treatments are being updated.</p>
            <Link href="/our-services" className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-[#b85c54] transition hover:text-[#241b18]">
              Explore services
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
