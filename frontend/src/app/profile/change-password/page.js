"use client"
export const dynamic = 'force-dynamic'
import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import toast from "react-hot-toast"
import { handleSessionExpiry } from "../../lib/handleSessionExpiry"
import { IoEye, IoEyeOff } from "react-icons/io5"
import PasswordRequirements, { passwordRequirements } from "../../components/auth/PasswordRequirements"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function ChangePasswordPage() {
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const router = useRouter()

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
      const res = await fetch(`${BASE_URL}/api/auth/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: form.current_password,
          new_password: form.new_password,
          confirm_password: form.confirm_password,
        }),
      })

      if (res.status === 401) throw new Error("SESSION_EXPIRED")

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
    `w-full border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#D65A5A] transition-colors text-gray-800 bg-white ${
      errors[field] ? "border-red-400" : "border-gray-200"
    }`

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-4 pb-10">
        <h1 className="text-[22px] font-bold text-[#D65A5A] text-center mb-6">
          Change Password
        </h1>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Current Password *</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={form.current_password}
                onChange={(e) => handleChange("current_password", e.target.value)}
                placeholder="Enter current password"
                className={inputClass("current_password")}
              />
              <button
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showCurrent ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-red-400 text-[11px] mt-1 px-1">{errors.current_password}</p>
            )}
          </div>

           <div>
                <label className="text-[12px] text-gray-500 mb-1 block">New Password *</label>
                <div className="relative">
                    <input
                    type={showNew ? "text" : "password"}
                    value={form.new_password}
                    onChange={(e) => {
                        handleChange("new_password", e.target.value)
                        setNewPasswordTouched(true)
                    }}
                    placeholder="Enter new password"
                    className={inputClass("new_password")}
                    />
                    <button
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                    {showNew ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                    </button>
                </div>
                {errors.new_password && (
                    <p className="text-red-400 text-[11px] mt-1 px-1">{errors.new_password}</p>
                )}
                {newPasswordTouched && form.new_password.length > 0 && (
                    <div className="mt-2">
                    <PasswordRequirements password={form.new_password} />
                    </div>
                )}
                </div>
            {errors.new_password && (
              <p className="text-red-400 text-[11px] mt-1 px-1">{errors.new_password}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Confirm New Password *</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm_password}
                onChange={(e) => handleChange("confirm_password", e.target.value)}
                placeholder="Confirm new password"
                className={inputClass("confirm_password")}
              />
              <button
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-400 text-[11px] mt-1 px-1">{errors.confirm_password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>

        </div>
    </div>
    
  )
}