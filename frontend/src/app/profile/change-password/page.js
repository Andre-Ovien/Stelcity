"use client"

export const dynamic = "force-dynamic"

import { useCallback, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, LockKeyhole, MapPin, Package, ShieldCheck, UserRound } from "lucide-react"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import toast from "react-hot-toast"
import { handleSessionExpiry } from "../../lib/handleSessionExpiry"
import { authenticatedFetch } from "../../lib/authenticatedFetch"
import { IoEye, IoEyeOff } from "react-icons/io5"
import PasswordRequirements, { passwordRequirements } from "../../components/auth/PasswordRequirements"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
const getServerMediaSnapshot = () => false

const ACCOUNT_NAVIGATION = [
  { label: "User info", href: "/profile", Icon: UserRound },
  { label: "Favourites", href: "/My-Favourites", Icon: Heart },
  { label: "Orders", href: "/profile/orders", Icon: Package },
  { label: "Delivery address", href: "/profile/shipping", Icon: MapPin },
  { label: "Password & security", href: "/profile/change-password", Icon: LockKeyhole, active: true },
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

export default function ChangePasswordPage() {
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 960px)")

  const [loading, setLoading] = useState(false)
  const [newPasswordTouched, setNewPasswordTouched] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async () => {
    const newErrors = {}
    const allRequirementsMet = passwordRequirements.every((r) => r.test(form.new_password))

    if (form.new_password && !allRequirementsMet) {
      newErrors.new_password = "Password does not meet all requirements"
    }

    if (!form.current_password) newErrors.current_password = "Current password is required"
    if (!form.new_password) newErrors.new_password = "New password is required"
    if (form.new_password && form.new_password.length < 8) newErrors.new_password = "Password must be at least 8 characters"
    if (!form.confirm_password) newErrors.confirm_password = "Please confirm your new password"
    if (form.new_password && form.confirm_password && form.new_password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match"
    }
    if (form.current_password && form.new_password && form.current_password === form.new_password) {
      newErrors.new_password = "New password must be different from current password"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const res = await authenticatedFetch(`${BASE_URL}/api/auth/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: form.current_password,
          new_password: form.new_password,
          confirm_password: form.confirm_password,
        }),
      }, token)

      const data = await res.json()

      if (!res.ok) {
        if (data.current_password) {
          setErrors({ current_password: data.current_password[0] || "Incorrect current password" })
          return
        }
        if (data.new_password) {
          setErrors({ new_password: data.new_password[0] || "Invalid new password" })
          return
        }
        throw new Error(data.detail || data.message || "Failed to change password")
      }

      toast.success("Password changed successfully!")
      router.push("/profile")
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please log in again.")
        handleSessionExpiry(router, softLogout, "/profile/change-password")
        return
      }
      toast.error(err.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `h-11 w-full border bg-[#fffefb] px-4 pr-12 text-sm text-[#1d241e] outline-none transition focus:border-[#d65a5a] ${
      errors[field] ? "border-[#d65a5a]" : "border-[#d9ddd6]"
    }`

  const PasswordField = ({ label, field, show, setShow, onChangeSide, autoComplete }) => (
    <div>
      <label htmlFor={field} className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">
        {label}
      </label>
      <div className="relative">
        <input
          id={field}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={form[field]}
          onChange={(event) => {
            handleChange(field, event.target.value)
            onChangeSide?.()
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
          aria-invalid={errors[field] ? "true" : undefined}
          aria-describedby={errors[field] ? `${field}-error` : undefined}
          className={inputClass(field)}
        />
        <button
          type="button"
          onClick={() => setShow((previous) => !previous)}
          aria-label={show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[#7c8778] transition hover:text-[#1d241e]"
        >
          {show ? <IoEyeOff size={18} aria-hidden="true" /> : <IoEye size={18} aria-hidden="true" />}
        </button>
      </div>
      {errors[field] && <p id={`${field}-error`} role="alert" className="mt-1.5 text-xs text-[#b34d46]">{errors[field]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fffefb] text-[#1d241e]">
      <Header />

      <main className="pb-0 pt-5 sm:pt-8">
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
              <h1 className="mt-3 text-[28px] font-black leading-none tracking-[-0.045em] text-[#1d241e]">Password &amp; security</h1>
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
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a837a]">Account security</p>
                  <h2 className="mt-3 text-[36px] font-black leading-[0.95] tracking-[-0.055em] text-[#1d241e] sm:text-[46px]">Update your password.</h2>
                </div>
                <span className="grid h-12 w-12 place-items-center border border-[#d9ddd6] bg-[#f7f7f3] text-[#6f846a]" aria-hidden="true">
                  <ShieldCheck className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#6d776b]">Choose a strong password to keep your account and order history secure.</p>
            </header>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSubmit()
              }}
              className="mt-9 max-w-xl"
            >
              <div className="border-b pb-8" style={{ borderColor: "#e4e5df" }}>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Verify your current password</p>
                <div className="mt-5">
                  <PasswordField
                    label="Current password"
                    field="current_password"
                    show={showCurrent}
                    setShow={setShowCurrent}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7c8778]">Create a new password</p>
                <div className="mt-5 flex flex-col gap-6">
                  <div>
                    <label htmlFor="new_password" className="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#737c70]">New password</label>
                    <div className="relative">
                      <input
                        id="new_password"
                        type={showNew ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.new_password}
                        onChange={(event) => {
                          handleChange("new_password", event.target.value)
                          setNewPasswordTouched(true)
                        }}
                        placeholder="Enter a new password"
                        aria-invalid={errors.new_password ? "true" : undefined}
                        aria-describedby={errors.new_password ? "new_password-error" : undefined}
                        className={inputClass("new_password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((previous) => !previous)}
                        aria-label={showNew ? "Hide new password" : "Show new password"}
                        className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[#7c8778] transition hover:text-[#1d241e]"
                      >
                        {showNew ? <IoEyeOff size={18} aria-hidden="true" /> : <IoEye size={18} aria-hidden="true" />}
                      </button>
                    </div>
                    {errors.new_password && <p id="new_password-error" role="alert" className="mt-1.5 text-xs text-[#b34d46]">{errors.new_password}</p>}
                    {newPasswordTouched && form.new_password.length > 0 && (
                      <div className="mt-3">
                        <PasswordRequirements password={form.new_password} variant="auth" />
                      </div>
                    )}
                  </div>

                  <PasswordField
                    label="Confirm new password"
                    field="confirm_password"
                    show={showConfirm}
                    setShow={setShowConfirm}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-10 inline-flex h-12 min-w-[190px] items-center justify-center rounded-full bg-[#d65a5a] px-7 text-xs font-black text-white shadow-[0_12px_24px_rgba(214,90,90,0.2)] transition hover:-translate-y-0.5 hover:bg-[#bc4949] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
