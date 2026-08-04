"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Heart, Search } from "lucide-react"
import Header from "./Header"
import Footer from "./Footer"
import ProductPageCard from "./ProductSection"
import Pagination from "./pagination"
import AutoProductCarousel from "./AutoProductCarousel"
import { getAllProducts } from "../lib/product"
import { getAllRawMaterials } from "../lib/rawMaterials"
import { CATALOG_ITEMS_PER_PAGE } from "../lib/catalogPagination"
import { trackSearch } from "../lib/tiktok"

const CATALOGS = {
  products: {
    path: "/products",
    basePath: "products",
    fetchItems: getAllProducts,
    heroImage: "/images/skincare-hero-editorial.png",
    heroAlt: "Two women enjoying a playful skincare ritual",
    heroImageClass: "scale-[1.06]",
    heroWord: null,
    eyebrow: "Everyday skincare",
    heading: "Skincare products for the way your skin feels.",
    description:
      "Explore everyday skincare and targeted routines, with delivery options available in Lagos and across Nigeria.",
    searchPlaceholder: "Search skincare products",
    emptyLabel: "products",
    localGuide: {
      eyebrow: "Shopping from Lagos?",
      title: "A clearer route from browsing to delivery.",
      description:
        "Explore the full catalogue here, read the Lagos skincare guide for local information, or compare in-person facial treatments at the Stelcity studio in Agbara.",
      links: [
        { label: "Skincare in Lagos guide", href: "/skincare-in-lagos" },
        { label: "Facial treatments in Agbara", href: "/our-services/facial-treatment" },
        { label: "Routine for oily skin in Nigeria", href: "/blog/best-skincare-routine-for-oily-skin-nigeria" },
      ],
    },
  },
  rawMaterials: {
    path: "/raw-materials",
    basePath: "raw-materials",
    fetchItems: getAllRawMaterials,
    heroImage: "/images/raw-materials-ingredients-hero.png",
    heroAlt: "Botanical powders, butters, oils, and fruit used in skincare formulations",
    heroWord: null,
    eyebrow: "For makers and formulators",
    heading: "Skincare raw materials for your next blend.",
    description:
      "Source botanical powders, nourishing butters, carrier oils, and formulation essentials in Nigeria.",
    searchPlaceholder: "Search raw materials",
    emptyLabel: "raw materials",
    localGuide: {
      eyebrow: "For makers in Nigeria",
      title: "Source ingredients, then keep building your knowledge.",
      description:
        "Browse raw materials for your next formulation, explore practical skincare training, or use the Stelcity Lagos guide to find every part of the business.",
      links: [
        { label: "Skincare training in Lagos and online", href: "/training-programs" },
        { label: "Explore Stelcity in Lagos", href: "/skincare-in-lagos" },
        { label: "Affordable skincare buying guide", href: "/blog/where-to-buy-affordable-skincare-products-nigeria" },
      ],
    },
  },
}

const SHOP_LINKS = [
  { label: "Skincare products", href: "/products", type: "products" },
  { label: "Raw materials", href: "/raw-materials", type: "rawMaterials" },
  { label: "Beauty services", href: "/our-services", type: "services" },
]

const SORT_OPTIONS = [
  { label: "Featured", value: "default" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
]

const getServerMediaSnapshot = () => false

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", callback)
    return () => media.removeEventListener("change", callback)
  }, [query])

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function CatalogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-[22px] bg-[#ebe9e3]" />
      <div className="mt-4 h-4 w-3/4 rounded-full bg-[#e1ded7]" />
      <div className="mt-3 h-3 w-full rounded-full bg-[#ebe8e1]" />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-[#ebe8e1]" />
      <div className="mt-5 h-10 rounded-full bg-[#dedbd4]" />
    </div>
  )
}

function CatalogHero({ config }) {
  return (
    <section className="relative h-[390px] overflow-hidden sm:h-[470px] lg:h-[560px]">
      <Image
        src={config.heroImage}
        alt={config.heroAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover object-center ${config.heroImageClass ?? ""}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,13,0.16)_0%,rgba(20,17,13,0.08)_42%,rgba(20,17,13,0.5)_100%)]" />
      {config.heroWord ? (
        <h1 className={`absolute inset-x-0 text-center font-black leading-[0.75] tracking-[-0.08em] text-[#fffdf7] drop-shadow-[0_10px_28px_rgba(0,0,0,0.22)] ${config.heroWordClass} ${config.heroPositionClass}`}>
          {config.heroWord}
        </h1>
      ) : null}
    </section>
  )
}

function CatalogNavigation({ catalogType, itemCount, mobile = false }) {
  if (mobile) {
    return (
      <nav aria-label="Shop categories" className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden">
        {SHOP_LINKS.map((link) => {
          const active = link.type === catalogType
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-w-max items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition ${
                active
                  ? "border-[#17130f] bg-[#17130f] text-white"
                  : "border-[#d9d5ce] bg-white text-[#625c55] hover:border-[#17130f]"
              }`}
            >
              {link.label}
              {active && <span className="text-white/60">{itemCount}</span>}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <aside className="sticky top-28 hidden self-start lg:block">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">
        Category
      </p>
      <nav aria-label="Shop categories" className="mt-5 border-t border-[#dedbd4]">
        {SHOP_LINKS.map((link) => {
          const active = link.type === catalogType
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center justify-between border-b border-[#dedbd4] py-4 text-sm font-bold transition ${
                active ? "text-[#17130f]" : "text-[#746e66] hover:text-[#17130f]"
              }`}
            >
              <span>{link.label}</span>
              {active ? (
                <span className="grid h-7 min-w-7 place-items-center rounded-full bg-[#eaff51] px-2 text-[10px] text-[#17130f]">
                  {itemCount}
                </span>
              ) : (
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-10 border border-[#dedbd4] bg-[#f2eee6] p-5">
        <Heart className="h-5 w-5 text-[#d16f66]" aria-hidden="true" />
        <p className="mt-4 font-serif text-xl font-semibold leading-tight">
          Saved something you love?
        </p>
        <Link
          href="/My-Favourites"
          className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#17130f]"
        >
          View favourites
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}

function CatalogContent({ catalogType, initialItems = [], initialPage = 1 }) {
  const config = CATALOGS[catalogType]
  const [allItems, setAllItems] = useState(initialItems)
  const [loading, setLoading] = useState(initialItems.length === 0)
  const [loadError, setLoadError] = useState(false)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("default")
  const catalogRef = useRef(null)
  const lastTrackedSearch = useRef("")
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isWideDesktop = useMediaQuery("(min-width: 1280px)")

  useEffect(() => {
    if (initialItems.length > 0) return

    let mounted = true
    const loadItems = async () => {
      setLoading(true)
      setLoadError(false)
      try {
        const items = await config.fetchItems()
        if (mounted) setAllItems(items)
      } catch (error) {
        console.error(`Failed to load ${config.emptyLabel}:`, error)
        if (mounted) setLoadError(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadItems()
    return () => {
      mounted = false
    }
  }, [catalogType, config, initialItems.length])

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = query
      ? allItems.filter((item) => item.name.toLowerCase().includes(query))
      : allItems

    return [...filtered].sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price
      if (sort === "price_desc") return b.price - a.price
      if (sort === "name_asc") return a.name.localeCompare(b.name)
      return 0
    })
  }, [allItems, search, sort])

  const totalPages = Math.ceil(visibleItems.length / CATALOG_ITEMS_PER_PAGE)
  const requestedPage = Number(initialPage || 1)
  const safeRequestedPage = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1
  const currentPage = totalPages > 0 ? Math.min(safeRequestedPage, totalPages) : 1
  const startIndex = (currentPage - 1) * CATALOG_ITEMS_PER_PAGE
  const paginatedItems = visibleItems.slice(startIndex, startIndex + CATALOG_ITEMS_PER_PAGE)
  const currentIds = new Set(paginatedItems.map((item) => item.id))
  const recommendations = [...allItems]
    .reverse()
    .filter((item) => !currentIds.has(item.id))
    .slice(0, 4)

  const resetToFirstPage = () => {
    if (safeRequestedPage !== 1) {
      router.replace(`${config.path}?page=1`, { scroll: false })
    }
  }

  const handlePageChange = (page) => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const trackCatalogSearch = () => {
    const query = search.trim()
    if (query.length < 2 || query === lastTrackedSearch.current) return

    trackSearch(query)
    lastTrackedSearch.current = query
  }

  return (
    <>
      <Header immersive />
      <CatalogHero config={config} />

      <main ref={catalogRef} className="relative z-10 -mt-8 scroll-mt-24 rounded-t-[30px] bg-[#faf9f6] px-4 pb-24 pt-10 text-[#17130f] sm:-mt-10 sm:rounded-t-[40px] sm:px-7 sm:pt-14 lg:px-10 lg:pb-32">
        <div className="mx-auto max-w-[1480px]">
          <div
            className="catalog-heading-grid grid gap-8 border-b border-[#dedbd4] pb-10 lg:items-end lg:gap-16"
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop
                ? "minmax(0, 1fr) minmax(360px, 0.72fr)"
                : "minmax(0, 1fr)",
            }}
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a] sm:text-xs">
                {config.eyebrow}
              </p>
              <h1 className="mt-4 max-w-[820px] text-[40px] font-black leading-[0.95] tracking-[-0.045em] sm:text-[58px] lg:text-[70px]">
                {config.heading}
              </h1>
              <p className="mt-5 max-w-[580px] text-sm leading-6 text-[#6a645d] sm:text-base">
                {config.description}
              </p>
            </div>

            <label className="flex h-14 items-center gap-3 rounded-full border border-[#d8d4cc] bg-white px-5 shadow-[0_14px_40px_rgba(35,29,24,0.05)] transition focus-within:border-[#17130f]">
              <Search className="h-4 w-4 shrink-0 text-[#17130f]" aria-hidden="true" />
              <span className="sr-only">{config.searchPlaceholder}</span>
              <input
                type="search"
                aria-label={config.searchPlaceholder}
                value={search}
                onBlur={trackCatalogSearch}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return
                  event.preventDefault()
                  trackCatalogSearch()
                  event.currentTarget.blur()
                }}
                onChange={(event) => {
                  setSearch(event.target.value)
                  resetToFirstPage()
                }}
                placeholder={config.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#938d85]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-[10px] font-black uppercase tracking-[0.12em] text-[#807970]"
                >
                  Clear
                </button>
              )}
            </label>
          </div>

          <div className="mt-6">
            <CatalogNavigation catalogType={catalogType} itemCount={allItems.length} mobile />
          </div>

          <div
            className="catalog-layout-grid mt-8 grid gap-8 lg:gap-10 xl:gap-14"
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop
                ? `${isWideDesktop ? "240px" : "220px"} minmax(0, 1fr)`
                : "minmax(0, 1fr)",
            }}
          >
            <CatalogNavigation catalogType={catalogType} itemCount={allItems.length} />

            <div className="min-w-0">
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-xs font-bold text-[#7b756d] sm:text-sm">
                  {loading ? "Loading catalogue…" : `${visibleItems.length} ${visibleItems.length === 1 ? "item" : "items"}`}
                </p>

                <label className="flex items-center gap-2 text-xs font-bold text-[#7b756d]">
                  <span className="hidden sm:inline">Sort by</span>
                  <select
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value)
                      resetToFirstPage()
                    }}
                    className="rounded-full border border-[#d8d4cc] bg-white px-4 py-2.5 text-xs font-bold text-[#17130f] outline-none transition focus:border-[#17130f]"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {loadError ? (
                <div className="grid min-h-[360px] place-items-center border border-[#dedbd4] bg-white px-6 text-center">
                  <div>
                    <h3 className="font-serif text-3xl font-semibold">We couldn&apos;t load the shop.</h3>
                    <p className="mt-3 text-sm text-[#777068]">Please refresh the page and try again.</p>
                  </div>
                </div>
              ) : (
                <div
                  className="catalog-product-grid grid gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 xl:gap-x-6"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${isWideDesktop ? 3 : 2}, minmax(0, 1fr))`,
                  }}
                >
                  {loading
                    ? Array.from({ length: CATALOG_ITEMS_PER_PAGE }).map((_, index) => (
                        <CatalogCardSkeleton key={index} />
                      ))
                    : paginatedItems.map((product) => (
                        <ProductPageCard
                          key={product.id}
                          product={product}
                          basePath={config.basePath}
                        />
                      ))}
                </div>
              )}

              {!loading && !loadError && paginatedItems.length === 0 && (
                <div className="grid min-h-[360px] place-items-center border border-[#dedbd4] bg-white px-6 text-center">
                  <div>
                    <h3 className="font-serif text-3xl font-semibold">Nothing matched that search.</h3>
                    <p className="mt-3 text-sm text-[#777068]">Try a shorter or more general product name.</p>
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="mt-6 rounded-full bg-[#17130f] px-6 py-3 text-xs font-black text-white"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}

              {!loading && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={config.path}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>

          {!loading && recommendations.length > 0 && (
            <section className="mt-24 border-t border-[#dedbd4] pt-12 sm:mt-28 sm:pt-16">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">
                    Keep exploring
                  </p>
                  <h2 className="mt-3 text-[32px] font-black tracking-[-0.035em] sm:text-[44px]">
                    You may also like
                  </h2>
                </div>
                <Link href={config.path} className="hidden items-center gap-2 text-xs font-black sm:flex">
                  View all
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <AutoProductCarousel label="Recommended products">
                {recommendations.map((product) => (
                  <ProductPageCard
                    key={`recommended-${product.id}`}
                    product={product}
                    basePath={config.basePath}
                  />
                ))}
              </AutoProductCarousel>
            </section>
          )}

          <section className="mt-20 overflow-hidden bg-[#1d241e] text-white sm:mt-24 lg:grid lg:grid-cols-[1fr_0.72fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#a4b4a0]">
                {config.localGuide.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[660px] text-[34px] font-black leading-[0.96] tracking-[-0.05em] sm:text-[46px]">
                {config.localGuide.title}
              </h2>
              <p className="mt-5 max-w-[620px] text-sm leading-7 text-white/64">
                {config.localGuide.description}
              </p>
            </div>
            <nav
              aria-label={`${catalogType === "products" ? "Skincare" : "Raw material"} guides`}
              className="divide-y divide-white/14 border-t border-white/14 lg:border-l lg:border-t-0"
            >
              {config.localGuide.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex min-h-[92px] items-center justify-between gap-5 px-6 py-5 text-sm font-black transition hover:bg-white hover:text-[#1d241e] sm:px-8"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function CatalogPage({
  catalogType,
  initialItems = [],
  initialPage = 1,
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <CatalogContent
        catalogType={catalogType}
        initialItems={initialItems}
        initialPage={initialPage}
      />
    </div>
  )
}
