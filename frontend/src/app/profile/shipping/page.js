"use client"

export const dynamic = "force-dynamic"

import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Heart, LockKeyhole, MapPin, Package, UserRound } from "lucide-react"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import { getShippingAddress, saveShippingAddress, updateShippingAddress } from "../../lib/profile"
import toast from "react-hot-toast"
import { handleSessionExpiry } from "../../lib/handleSessionExpiry"

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
]

const SHIPPING_CACHE_KEY = "stelcity_shipping_address"
const citiesCache = new Map()
const getServerMediaSnapshot = () => false

const ACCOUNT_NAVIGATION = [
  { label: "User info", href: "/profile", Icon: UserRound },
  { label: "Favourites", href: "/My-Favourites", Icon: Heart },
  { label: "Orders", href: "/profile/orders", Icon: Package },
  { label: "Delivery address", href: "/profile/shipping", Icon: MapPin, active: true },
  { label: "Password & security", href: "/profile/change-password", Icon: LockKeyhole },
]

function saveAddressToLocal(data) {
  try { localStorage.setItem(SHIPPING_CACHE_KEY, JSON.stringify(data)) } catch {}
}

function getAddressFromLocal() {
  try {
    const raw = localStorage.getItem(SHIPPING_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", callback)
    return () => media.removeEventListener("change", callback)
  }, [query])

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function AccountNavItem({ label, href, Icon, active = false }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 border-l-2 px-3 py-3 text-sm font-bold transition ${
        active
          ? "border-[#d65a5a] bg-[#fff4ef] text-[#1d241e]"
          : "border-transparent text-[#6d776b] hover:border-[#e5d3cb] hover:bg-[#f7f7f3] hover:text-[#1d241e]"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-[#d65a5a]" : "text-[#849080]"}`} aria-hidden="true" />
      {label}
    </Link>
  )
}

function AddressField({ children, error, label, htmlFor, required = false }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">
        {label}{required ? " *" : ""}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-[#b34d46]">{error}</p>}
    </div>
  )
}

function ShippingAddressContent() {
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")
  const isDesktop = useMediaQuery("(min-width: 960px)")

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [existing, setExisting] = useState(null)
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    country: "Nigeria",
    postal_code: "",
  })

  const [errors, setErrors] = useState({})
  const addressFetched = useRef(false)
  const cityFetchController = useRef(null)

  useEffect(() => {
    if (!token || addressFetched.current) return
    addressFetched.current = true

    const cached = getAddressFromLocal()
    if (cached) {
      setExisting(cached)
      setForm({
        full_name: cached.full_name || "",
        phone_number: cached.phone_number || "",
        street_address: cached.street_address || "",
        city: cached.city || "",
        state: cached.state || "",
        country: "Nigeria",
        postal_code: cached.postal_code || "",
      })
      if (cached.state) fetchCities(cached.state)
      setFetching(false)
    }

    getShippingAddress(token)
      .then((data) => {
        if (data) {
          setExisting(data)
          setForm({
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            street_address: data.street_address || "",
            city: data.city || "",
            state: data.state || "",
            country: "Nigeria",
            postal_code: data.postal_code || "",
          })
          saveAddressToLocal(data)
          if (data.state) fetchCities(data.state)
        }
        setFetching(false)
      })
      .catch((err) => {
        if (err.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, redirect || "/profile/shipping")
        }
        setFetching(false)
      })
  }, [redirect, router, softLogout, token])

  const fetchCities = async (state) => {
    if (!state) return
    if (cityFetchController.current) cityFetchController.current.abort()
    if (citiesCache.has(state)) {
      setCities(citiesCache.get(state))
      return
    }
    setLoadingCities(true)
    cityFetchController.current = new AbortController()
    try {
      const res = await fetch(
        `https://nga-states-lga.onrender.com/?state=${encodeURIComponent(state)}`,
        { signal: cityFetchController.current.signal }
      )
      const data = await res.json()
      const cityList = data || []
      citiesCache.set(state, cityList)
      setCities(cityList)
    } catch (err) {
      if (err.name !== "AbortError") setCities([])
    } finally {
      setLoadingCities(false)
      cityFetchController.current = null
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
    if (field === "state") {
      setForm((prev) => ({ ...prev, state: value, city: "" }))
      fetchCities(value)
    }
  }

  const handleSubmit = async () => {
    const newErrors = {}
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required"
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required"
    if (!form.street_address.trim()) newErrors.street_address = "Street address is required"
    if (!form.city.trim()) newErrors.city = "City is required"
    if (!form.state) newErrors.state = "Please select a state"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const addressData = { ...form, country: "Nigeria" }
      if (existing) {
        await updateShippingAddress(addressData, token)
      } else {
        await saveShippingAddress(addressData, token)
      }
      saveAddressToLocal(addressData)
      toast.success("Shipping address saved!")
      router.push(redirect || "/profile")
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please log in again.")
        handleSessionExpiry(router, softLogout, redirect || "/profile/shipping")
        return
      }
      toast.error(err.message || "Failed to save address")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `h-11 w-full border bg-[#fffefb] px-4 text-sm text-[#1d241e] outline-none transition focus:border-[#d65a5a] ${
      errors[field] ? "border-[#d65a5a]" : "border-[#d9ddd6]"
    }`

  return (
    <div className="min-h-screen bg-[#fffefb] text-[#1d241e]">
      <Header />

      <main className="pb-0 pt-5 sm:pt-8">
        <div className="w-full">
          <div
            className="account-workspace-grid min-h-[650px]"
            style={{
              display: "grid",
              gridTemplateColumns: isDesktop ? "250px minmax(0, 1fr)" : "minmax(0, 1fr)",
            }}
          >
            <aside
              className="flex flex-col p-6 sm:p-8"
              style={{
                borderColor: "#d9ddd6",
                borderBottomWidth: isDesktop ? 0 : 1,
                borderRightWidth: isDesktop ? 1 : 0,
              }}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#748071]">Stelcity account</p>
                <h1 className="mt-3 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Delivery address</h1>
              </div>

              <nav aria-label="Account navigation" className="mt-8 flex flex-col gap-1">
                {ACCOUNT_NAVIGATION.map((item) => <AccountNavItem key={item.href} {...item} />)}
              </nav>

              <Link href="/profile" className="mt-8 inline-flex items-center gap-2 self-start text-xs font-black text-[#52604f] transition hover:text-[#1d241e] lg:mt-auto">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to account
              </Link>
            </aside>

            <section className="min-w-0 p-6 sm:p-8 lg:p-12">
              <header className="border-b pb-8" style={{ borderColor: "#e4e5df" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Delivery details</p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="max-w-2xl text-[36px] font-black leading-[0.95] tracking-[-0.055em] text-[#1d241e] sm:text-[46px]">Where should we send your order?</h2>
                  <p className="max-w-[310px] text-sm leading-6 text-[#6d776b]">Keep one delivery address on hand for a faster, simpler checkout.</p>
                </div>
                {redirect && <p className="mt-5 text-xs font-bold text-[#62725f]">This address will be used to complete your checkout.</p>}
              </header>

              {fetching && !existing ? (
                <div className="mt-9 max-w-4xl animate-pulse">
                  <div className="grid gap-x-8 gap-y-6" style={{ gridTemplateColumns: isDesktop ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)" }}>
                    {["one", "two", "three", "four", "five", "six"].map((item) => (
                      <div key={item}>
                        <div className="h-3 w-24 bg-[#e8ebe5]" />
                        <div className="mt-2 h-11 bg-[#f0f2ee]" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form
                  className="mt-9 max-w-4xl"
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit()
                  }}
                >
                  <div
                    className="gap-x-8 gap-y-6"
                    style={{
                      display: "grid",
                      gridTemplateColumns: isDesktop ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                    }}
                  >
                    <AddressField label="Full name" htmlFor="full_name" required error={errors.full_name}>
                      <input
                        id="full_name"
                        type="text"
                        autoComplete="name"
                        value={form.full_name}
                        onChange={(event) => handleChange("full_name", event.target.value)}
                        placeholder="John Doe"
                        className={inputClass("full_name")}
                      />
                    </AddressField>

                    <AddressField label="Phone number" htmlFor="phone_number" required error={errors.phone_number}>
                      <input
                        id="phone_number"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone_number}
                        onChange={(event) => handleChange("phone_number", event.target.value)}
                        placeholder="0801 234 5678"
                        className={inputClass("phone_number")}
                      />
                    </AddressField>

                    <div style={{ gridColumn: isDesktop ? "1 / -1" : "auto" }}>
                      <AddressField label="Street address" htmlFor="street_address" required error={errors.street_address}>
                        <input
                          id="street_address"
                          type="text"
                          autoComplete="street-address"
                          value={form.street_address}
                          onChange={(event) => handleChange("street_address", event.target.value)}
                          placeholder="123 Lekki Phase 1"
                          className={inputClass("street_address")}
                        />
                      </AddressField>
                    </div>

                    <AddressField label="State" htmlFor="state" required error={errors.state}>
                      <select
                        id="state"
                        autoComplete="address-level1"
                        value={form.state}
                        onChange={(event) => handleChange("state", event.target.value)}
                        className={`${inputClass("state")} appearance-none`}
                      >
                        <option value="">Select a state</option>
                        {NIGERIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                      </select>
                    </AddressField>

                    <AddressField label="City" htmlFor="city" required error={errors.city}>
                      {loadingCities ? (
                        <div className="flex h-11 w-full items-center border border-[#d9ddd6] bg-[#f4f5f1] px-4 text-sm text-[#7a8477]">Loading cities…</div>
                      ) : cities.length > 0 ? (
                        <select
                          id="city"
                          autoComplete="address-level2"
                          value={form.city}
                          onChange={(event) => handleChange("city", event.target.value)}
                          className={`${inputClass("city")} appearance-none`}
                        >
                          <option value="">Select a city</option>
                          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                        </select>
                      ) : (
                        <input
                          id="city"
                          type="text"
                          autoComplete="address-level2"
                          value={form.city}
                          onChange={(event) => handleChange("city", event.target.value)}
                          placeholder={form.state ? "Enter city manually" : "Select a state first"}
                          className={inputClass("city")}
                          disabled={!form.state}
                        />
                      )}
                    </AddressField>

                    <AddressField label="Country" htmlFor="country">
                      <div id="country" className="flex h-11 items-center border border-[#e4e5df] bg-[#f4f5f1] px-4 text-sm text-[#899187]">Nigeria</div>
                    </AddressField>

                    <AddressField label="Postal code" htmlFor="postal_code">
                      <input
                        id="postal_code"
                        type="text"
                        autoComplete="postal-code"
                        value={form.postal_code}
                        onChange={(event) => handleChange("postal_code", event.target.value)}
                        placeholder="100271"
                        className={inputClass("postal_code")}
                      />
                    </AddressField>
                  </div>

                  <div className="mt-10 flex flex-col gap-4 border-t pt-7 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "#e4e5df" }}>
                    <p className="max-w-md text-xs leading-5 text-[#798274]">We’ll use this address only for delivery and updates about your order.</p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-12 min-w-[184px] items-center justify-center rounded-full bg-[#d65a5a] px-7 text-xs font-black text-white shadow-[0_12px_24px_rgba(214,90,90,0.2)] transition hover:-translate-y-0.5 hover:bg-[#bc4949] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {loading ? "Saving…" : existing ? "Update address" : "Save address"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ShippingAddressPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fffefb] text-[#1d241e]">
        <Header />
        <div className="px-6 py-16 text-center text-sm text-[#748071]">Loading delivery address…</div>
      </div>
    }>
      <ShippingAddressContent />
    </Suspense>
  )
}
