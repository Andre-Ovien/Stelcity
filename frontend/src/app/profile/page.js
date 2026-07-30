"use client"

export const dynamic = "force-dynamic"

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Heart, LockKeyhole, LogOut, MapPin, Package, UserRound } from "lucide-react"
import toast from "react-hot-toast"
import Header from "../components/Header"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { getProfile, updateProfile } from "../lib/profile"
import { handleSessionExpiry } from "../lib/handleSessionExpiry"

const ACCOUNT_NAVIGATION = [
  { label: "User info", href: "/profile", Icon: UserRound, active: true },
  { label: "Favourites", href: "/My-Favourites", Icon: Heart },
  { label: "Orders", href: "/profile/orders", Icon: Package },
  { label: "Delivery address", href: "/profile/shipping", Icon: MapPin },
  { label: "Password & security", href: "/profile/change-password", Icon: LockKeyhole },
]

const GENDER_OPTIONS = ["male", "female", "prefer not to say"]
const getServerMediaSnapshot = () => false

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

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
  })

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const softLogout = useAuthStore((state) => state.softLogout)
  const updateUser = useAuthStore((state) => state.updateUser)
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 960px)")

  useEffect(() => {
    if (!token) return undefined

    let isCurrent = true

    getProfile(token)
      .then((data) => {
        if (!isCurrent) return

        if (data) {
          setProfile(data)
          setForm({
            email: data.email || user?.email || "",
            full_name: data.full_name || user?.name || user?.full_name || "",
            phone_number: data.phone_number || "",
            gender: data.gender || "",
            date_of_birth: data.date_of_birth || "",
          })
        } else {
          setForm((previous) => ({ ...previous, email: user?.email || "", full_name: user?.name || user?.full_name || "" }))
        }
      })
      .catch((error) => {
        if (!isCurrent) return

        if (error.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, "/profile")
        }
      })
      .finally(() => {
        if (isCurrent) setFetching(false)
      })

    return () => {
      isCurrent = false
    }
  }, [router, softLogout, token, user?.email, user?.full_name, user?.name])

  const account = useMemo(() => {
    const name = profile?.full_name || user?.name || user?.full_name || user?.email || "User"
    const email = profile?.email || user?.email || ""
    const isEmailName = name.includes("@")
    const firstName = isEmailName ? "there" : name.trim().split(/\s+/)[0]
    const initial = isEmailName ? "S" : (firstName?.[0] || "S").toUpperCase()

    return { name, email, firstName, initial }
  }, [profile, user])

  const handleChange = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: "" }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.full_name.trim()) nextErrors.full_name = "Full name is required"
    if (!form.phone_number.trim()) nextErrors.phone_number = "Phone number is required"

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSaving(true)
    try {
      const updated = await updateProfile(
        {
          full_name: form.full_name,
          phone_number: form.phone_number,
          gender: form.gender,
          date_of_birth: form.date_of_birth || null,
        },
        token
      )
      setProfile(updated)
      updateUser({ full_name: updated.full_name, name: updated.full_name, email: updated.email || form.email })
      toast.success("Profile updated!")
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please log in again.")
        handleSessionExpiry(router, softLogout, "/profile")
        return
      }
      toast.error(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    clearCart()
    logout()
    router.push("/")
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
                <h1 className="mt-3 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">User profile</h1>
              </div>

              <nav aria-label="Account navigation" className="mt-8 flex flex-col gap-1">
                {ACCOUNT_NAVIGATION.map((item) => (
                  <AccountNavItem key={item.href} {...item} />
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="mt-8 inline-flex items-center gap-2 self-start text-xs font-black text-[#b34d46] transition hover:text-[#802f2b] lg:mt-auto"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </aside>

            <section className="min-w-0 p-6 sm:p-8 lg:p-12">
              <div className="flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-center" style={{ borderColor: "#e4e5df" }}>
                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#f6dfd3] text-[27px] font-black text-[#b54e47] shadow-[0_12px_26px_rgba(167,87,79,0.12)]">
                  {fetching ? "…" : account.initial}
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Personal details</p>
                  <h2 className="mt-2 text-[30px] font-black leading-none tracking-[-0.045em] text-[#1d241e] sm:text-[36px]">
                    {fetching ? "Loading your profile…" : account.name}
                  </h2>
                  {!fetching && account.email && <p className="mt-2 text-sm text-[#717a6e]">{account.email}</p>}
                </div>
              </div>

              {fetching ? (
                <div className="profile-form-grid mt-9 gap-x-8 gap-y-6 animate-pulse">
                  {["one", "two", "three", "four", "five", "six"].map((item) => (
                    <div key={item}>
                      <div className="h-3 w-20 bg-[#e8ebe5]" />
                      <div className="mt-2 h-11 bg-[#f0f2ee]" />
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSave} className="mt-9">
                  <div
                    className="profile-form-grid gap-x-8 gap-y-6"
                    style={{
                      display: "grid",
                      gridTemplateColumns: isDesktop ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                    }}
                  >
                    <div>
                      <label htmlFor="full_name" className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">Full name</label>
                      <input
                        id="full_name"
                        type="text"
                        autoComplete="name"
                        value={form.full_name}
                        onChange={(event) => handleChange("full_name", event.target.value)}
                        className={inputClass("full_name")}
                      />
                      {errors.full_name && <p className="mt-1.5 text-xs text-[#b34d46]">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">Phone number</label>
                      <input
                        id="phone_number"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone_number}
                        onChange={(event) => handleChange("phone_number", event.target.value)}
                        className={inputClass("phone_number")}
                      />
                      {errors.phone_number && <p className="mt-1.5 text-xs text-[#b34d46]">{errors.phone_number}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">Email address</label>
                      <input id="email" type="email" value={form.email} readOnly className="h-11 w-full border border-[#e4e5df] bg-[#f4f5f1] px-4 text-sm text-[#899187] outline-none" />
                      <p className="mt-1.5 text-[11px] text-[#899187]">Your email address cannot be changed here.</p>
                    </div>

                    <div>
                      <label htmlFor="gender" className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">Gender</label>
                      <select
                        id="gender"
                        value={form.gender}
                        onChange={(event) => handleChange("gender", event.target.value)}
                        className={`${inputClass("gender")} appearance-none`}
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((gender) => (
                          <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="date_of_birth" className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">Date of birth</label>
                      <input
                        id="date_of_birth"
                        type="date"
                        value={form.date_of_birth}
                        onChange={(event) => handleChange("date_of_birth", event.target.value)}
                        className={inputClass("date_of_birth")}
                      />
                    </div>

                    <div>
                      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">Delivery address</span>
                      <Link href="/profile/shipping" className="flex h-11 items-center justify-between border border-[#d9ddd6] bg-[#fffefb] px-4 text-sm font-bold text-[#52604f] transition hover:border-[#d65a5a] hover:text-[#1d241e]">
                        Manage saved address
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-10 inline-flex h-12 min-w-[185px] items-center justify-center rounded-full bg-[#d65a5a] px-7 text-xs font-black text-white shadow-[0_12px_24px_rgba(214,90,90,0.2)] transition hover:-translate-y-0.5 hover:bg-[#bc4949] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1d241e]/42 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="w-full max-w-md border bg-[#fffefb] p-6 shadow-[0_24px_70px_rgba(29,36,30,0.22)] sm:p-7" style={{ borderColor: "#d9ddd6" }}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6dfd3] text-[#9d4f49]">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 id="logout-title" className="mt-5 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Log out?</h2>
            <p className="mt-3 text-sm leading-6 text-[#697267]">Your cart will be cleared when you leave your account.</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="h-11 rounded-full border border-[#cfd8cc] px-5 text-xs font-black text-[#52604f] transition hover:bg-[#f3f5f0]">
                Keep me signed in
              </button>
              <button type="button" onClick={handleLogout} className="h-11 rounded-full bg-[#1d241e] px-5 text-xs font-black text-white transition hover:bg-[#354033]">
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
