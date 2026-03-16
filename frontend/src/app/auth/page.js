"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuthStore } from "../store/authStore"
import { loginUser, registerUser } from "../lib/auth"
import toast from "react-hot-toast"
import Header from "../components/Header"

export default function AuthPage() {
  const [mode, setMode] = useState("register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password || (mode === "register" && !name)) {
      toast.error("Please fill in all fields")
      return
    }

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
      router.push("/")
    } catch (err) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-transparent border border-gray-300 rounded-xl px-4 py-3 text-[14px] text-black outline-none focus:bg-white focus:border-[#D65A5A] focus:text-black transition-all placeholder:text-black"

  return (
    <div className="relative min-h-screen flex flex-col">

      <Image
        src="/images/backk.png"
        alt="background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/20 " />
      <div className="mt-5">
        <Header/>
      </div>

      <div className="relative z-20 flex flex-col min-h-screen px-6 pt-10 pb-10">

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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={inputClass}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

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
            onClick={() => {
              setMode(mode === "register" ? "login" : "register")
              setName("")
              setEmail("")
              setPassword("")
              setShowPassword(false)
            }}
            className="w-full border border-gray-300 bg-white/10 text-black font-medium py-3 rounded-full text-[14px] hover:bg-white/20 transition-colors"
          >
            {mode === "register" ? "Log in" : "Register"}
          </button>

        </div>
      </div>
    </div>
  )
}