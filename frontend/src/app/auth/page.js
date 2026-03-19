"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuthStore } from "../store/authStore"
import { loginUser, registerUser } from "../lib/auth"
import toast from "react-hot-toast"
import Header from "../components/Header"
import AuthInput from "../components/auth/AuthInput"
import PasswordInput from "../components/auth/PasswordInput"
import PasswordRequirements, { passwordRequirements } from "../components/auth/PasswordRequirements"

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function AuthPage() {
  const [mode, setMode] = useState("register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  const allRequirementsMet = passwordRequirements.every((r) => r.test(password))

  const handleSubmit = async () => {
    const newErrors = {}

    if (mode === "register" && !name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    if (mode === "register" && password && !allRequirementsMet) {
      newErrors.password = "Password does not meet all requirements"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      let data
      if (mode === "register") {
        data = await registerUser(name, email, password)
      } else {
        data = await loginUser(email, password)
      }

      login(data.user, data.token, data.refreshToken)
      toast.success(mode === "register" ? "Account created!" : "Welcome back!")

      const redirectAfter = sessionStorage.getItem("redirectAfter") || "/"
      sessionStorage.removeItem("redirectAfter")
      router.push(redirectAfter)

    } catch (err) {
      const msg = err.message || ""
      if (msg.toLowerCase().includes("email")) {
        setErrors({ email: "This email is already registered" })
      } else if (msg.toLowerCase().includes("password")) {
        setErrors({ password: "Incorrect password" })
      } else if (msg.toLowerCase().includes("credentials")) {
        setErrors({ email: "Invalid email or password" })
      } else {
        toast.error(msg || "Something went wrong, please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMode = () => {
    setMode(mode === "register" ? "login" : "register")
    setName("")
    setEmail("")
    setPassword("")
    setTouched(false)
    setErrors({})
  }

  return (
    <div className="relative min-h-screen flex flex-col">

      <Image
        src="/images/backk.png"
        alt="background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-20 flex flex-col min-h-screen">
        <div className="mt-5">
          <Header />
        </div>

        <div className="flex flex-col px-6 pt-10 pb-10">

          <h1 className="text-[28px] font-bold text-[#D65A5A] text-center">
            {mode === "register" ? "Welcome!" : "Welcome Back!"}
          </h1>

          <p className="text-[13px] text-black text-center mt-2 mb-10 px-3">
            {mode === "register"
              ? "Create your account and start exploring our skincare essentials today."
              : "Log in to continue your skincare journey."
            }
          </p>

          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">

            {mode === "register" && (
              <AuthInput
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrors((prev) => ({ ...prev, name: "" }))
                }}
                placeholder="Name"
                error={errors.name}
              />
            )}

            <AuthInput
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: "" }))
              }}
              placeholder="Email"
              error={errors.email}
            />

            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setTouched(true)
                setErrors((prev) => ({ ...prev, password: "" }))
              }}
              error={errors.password}
            />

            {mode === "register" && touched && password.length > 0 && (
              <PasswordRequirements password={password} />
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors disabled:opacity-60 mt-2"
            >
              {loading
                ? "Please wait..."
                : mode === "register" ? "Register" : "Log in"
              }
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-[12px] text-black">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <button
              onClick={handleToggleMode}
              className="w-full border border-gray-300 bg-white/10 text-black font-medium py-3 rounded-full text-[14px] hover:bg-white/20 transition-colors"
            >
              {mode === "register" ? "Log in" : "Register"}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}