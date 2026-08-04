"use client"

import { useCallback, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import { loginUser, registerUser } from "../lib/auth"
import { useAuthStore } from "../store/authStore"
import AuthInput from "../components/auth/AuthInput"
import PasswordInput from "../components/auth/PasswordInput"
import PasswordRequirements, { passwordRequirements } from "../components/auth/PasswordRequirements"
import { trackCompleteRegistration } from "../lib/tiktok"

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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

function AccountArtwork({ mobile = false, mode, isDesktop }) {
  const isRegistering = mode === "register"
  const image = isRegistering
    ? "/images/auth-signup-panel.png"
    : "/images/auth-signin-panel.png"
  const artworkTitle = isRegistering
    ? "A fresh start for your skincare ritual."
    : "Your skincare ritual is waiting."
  const artworkDescription = isRegistering
    ? "Create your account to make your next order feel simple and familiar."
    : "Sign in to pick up right where you left off."

  return (
    <section
      className={`relative overflow-hidden ${mobile ? "h-[34svh] min-h-[220px] lg:hidden" : "hidden min-h-screen lg:block"}`}
      style={{ display: mobile ? (isDesktop ? "none" : "block") : (isDesktop ? "block" : "none") }}
    >
      <Image
        src={image}
        alt={isRegistering ? "A woman enjoying a calm skincare ritual" : "A serene skincare still life"}
        fill
        priority
        sizes={mobile ? "100vw" : "(max-width: 1024px) 0px, 48vw"}
        className={`object-cover ${mobile ? "object-[56%_58%]" : isRegistering ? "object-[58%_53%]" : "object-[57%_62%]"}`}
      />
      <div className={`absolute inset-0 ${mobile ? "bg-[linear-gradient(90deg,rgba(35,28,21,0.12),rgba(35,28,21,0.32))]" : "bg-[linear-gradient(180deg,rgba(35,28,21,0.02)_0%,rgba(35,28,21,0.08)_48%,rgba(35,28,21,0.64)_100%)]"}`} />

      <Link href="/" className={`absolute inline-flex items-center rounded-full bg-white/92 shadow-sm backdrop-blur-sm ${mobile ? "left-5 top-5 px-3.5 py-2" : "left-8 top-8 px-4 py-2.5"}`}>
        <Image src="/images/logo.png" alt="Stelcity" width={112} height={40} className={`h-auto ${mobile ? "w-[88px]" : "w-24"}`} />
      </Link>

      {!mobile && (
        <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-12">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Stelcity account</p>
          <h2 className="mt-4 max-w-md font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.035em] xl:text-5xl">{artworkTitle}</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">{artworkDescription}</p>
        </div>
      )}
    </section>
  )
}

export default function AuthPage({ initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const router = useRouter()
  const isRegistering = mode === "register"
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const allRequirementsMet = passwordRequirements.every((requirement) => requirement.test(password))

  const handleSubmit = async () => {
    const newErrors = {}

    if (isRegistering && !name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!password) newErrors.password = "Password is required"
    if (isRegistering && password && !allRequirementsMet) {
      newErrors.password = "Password does not meet all requirements"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const data = isRegistering
        ? await registerUser(name, email, password)
        : await loginUser(email, password)

      login(data.user, data.token, data.refreshToken)
      if (isRegistering) trackCompleteRegistration()
      toast.success(isRegistering ? "Account created!" : "Welcome back!")

      const redirectAfter = sessionStorage.getItem("redirectAfter") || "/"
      sessionStorage.removeItem("redirectAfter")
      router.replace(redirectAfter)
    } catch (error) {
      const message = error.message || ""
      if (message.toLowerCase().includes("email")) {
        setErrors({ email: "This email is already registered" })
      } else if (message.toLowerCase().includes("password")) {
        setErrors({ password: "Incorrect password" })
      } else {
        toast.error(message || "Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMode = () => {
    setMode((currentMode) => currentMode === "register" ? "login" : "register")
    setName("")
    setEmail("")
    setPassword("")
    setTouched(false)
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#17130f]">
      <main
        className="min-h-screen lg:grid lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]"
        style={{
          display: isDesktop ? "grid" : "block",
          gridTemplateColumns: isDesktop ? "minmax(0, 0.94fr) minmax(0, 1.06fr)" : undefined,
        }}
      >
        <AccountArtwork mode={mode} isDesktop={isDesktop} />

        <section
          className="flex min-h-screen flex-col bg-[#faf9f6] lg:border-l lg:border-[#e4e0d8]"
          style={isDesktop ? { borderLeft: "1px solid #e4e0d8" } : undefined}
        >
          <AccountArtwork mobile mode={mode} isDesktop={isDesktop} />

          <div className="flex flex-1 items-center px-5 py-10 sm:px-10 sm:py-14 lg:px-[clamp(3.5rem,9vw,10rem)] lg:py-16">
            <div className="mx-auto w-full max-w-[460px]">
                <Link
                  href="/"
                  className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#817a72] transition hover:text-[#17130f] lg:inline-flex"
                  style={{ display: isDesktop ? "inline-flex" : "none" }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to shop
                </Link>

                <div className="mt-1 lg:mt-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#8a837a]">
                    {isRegistering ? "New to Stelcity" : "Account access"}
                  </p>
                  <h1 className="mt-4 text-[38px] font-black leading-[0.94] tracking-[-0.05em] text-[#17130f] sm:text-[48px]">
                    {isRegistering ? "Create your account." : "Welcome back."}
                  </h1>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-[#746e66]">
                    {isRegistering
                      ? "Use your email address to create a Stelcity account."
                      : "Sign in with the email address connected to your account."}
                  </p>
                </div>

                <div className="my-7 flex items-center gap-3" aria-hidden="true">
                  <span className="h-px flex-1 bg-[#e3dfd8]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9a938a]">Email access</span>
                  <span className="h-px flex-1 bg-[#e3dfd8]" />
                </div>

                <form
                  className="flex flex-col gap-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit()
                  }}
                  noValidate
                >
                  {isRegistering && (
                    <AuthInput
                      id="name"
                      label="Full name"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value)
                        setErrors((previous) => ({ ...previous, name: "" }))
                      }}
                      placeholder="Your full name"
                      autoComplete="name"
                      error={errors.name}
                    />
                  )}

                  <AuthInput
                    id="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setErrors((previous) => ({ ...previous, email: "" }))
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={errors.email}
                  />

                  <PasswordInput
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setTouched(true)
                      setErrors((previous) => ({ ...previous, password: "" }))
                    }}
                    placeholder={isRegistering ? "Create a secure password" : "Enter your password"}
                    autoComplete={isRegistering ? "new-password" : "current-password"}
                    error={errors.password}
                  />

                  {isRegistering && touched && password.length > 0 && (
                    <PasswordRequirements password={password} variant="auth" />
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 flex h-14 w-full items-center justify-between rounded-full bg-[#17130f] px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(23,19,15,0.16)] transition hover:-translate-y-0.5 hover:bg-[#322c26] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                  >
                    <span className="pl-1">{loading ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#eaff51] text-[#17130f] transition group-hover:translate-x-0.5">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                </form>

                <p className="mt-6 text-sm text-[#746e66]">
                  {isRegistering ? "Already have an account?" : "Don’t have an account?"}{" "}
                  <button
                    type="button"
                    onClick={handleToggleMode}
                    className="font-black text-[#17130f] underline decoration-[#d16f66] decoration-2 underline-offset-4 transition hover:text-[#d16f66]"
                  >
                    {isRegistering ? "Sign in" : "Create one"}
                  </button>
                </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
