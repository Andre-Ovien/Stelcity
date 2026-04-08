"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import { getProfile, updateProfile } from "../../lib/profile"
import toast from "react-hot-toast"
import { handleSessionExpiry } from "../../lib/handleSessionExpiry"

const GENDER_OPTIONS = ["male", "female", "prefer not to say"]

export default function EditProfilePage() {
  const token = useAuthStore((s) => s.token)
  const softLogout = useAuthStore((s) => s.softLogout)
  const updateUser = useAuthStore((s) => s.updateUser)
  const router = useRouter()

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    gender: "",
    date_of_birth: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!token) return
    getProfile(token)
      .then((data) => {
        if (data) {
          setForm({
            email: data.email || "",
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            gender: data.gender || "",
            date_of_birth: data.date_of_birth || "",
          })
        }
        setFetching(false)
      })
      .catch((err) => {
        if (err.message === "SESSION_EXPIRED") {
          toast.error("Your session has expired. Please log in again.")
          handleSessionExpiry(router, softLogout, "/profile/edit")
        }
        setFetching(false)
      })
  }, [token])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async () => {
    const newErrors = {}
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required"
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const updated = await updateProfile({
        full_name: form.full_name,
        phone_number: form.phone_number,
        gender: form.gender,
        date_of_birth: form.date_of_birth || null,
      }, token)
      updateUser({ full_name: updated.full_name, name: updated.full_name })
      toast.success("Profile updated!")
      router.push("/profile")
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        toast.error("Your session has expired. Please log in again.")
        handleSessionExpiry(router, softLogout, "/profile/edit")
        return
      }
      toast.error(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#D65A5A] transition-colors text-gray-800 bg-white ${
      errors[field] ? "border-red-400" : "border-gray-200"
    }`

  return (
    <div className="min-h-screen bg-[#D6E4D3]">
      <Header />

      
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-0 pb-10">

        <h1 className="text-[22px] font-bold text-[#D65A5A] text-center mb-6">
          Edit Profile
        </h1>

        
        <div className="sm:bg-white sm:rounded-2xl sm:border sm:border-gray-100 sm:p-6 sm:shadow-sm">

          {fetching ? (
            <div className="flex flex-col gap-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">

              <div>
                <label className="text-[12px] text-gray-500 mb-1 block">Email</label>
                <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-400 bg-gray-50">
                  {form.email}
                </div>
                <p className="text-[11px] text-gray-400 mt-1 px-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-[12px] text-gray-500 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder="John Doe"
                  className={inputClass("full_name")}
                />
                {errors.full_name && (
                  <p className="text-red-400 text-[11px] mt-1 px-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="text-[12px] text-gray-500 mb-1 block">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="08012345678"
                  className={inputClass("phone_number")}
                />
                {errors.phone_number && (
                  <p className="text-red-400 text-[11px] mt-1 px-1">{errors.phone_number}</p>
                )}
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className={`${inputClass("gender")} appearance-none`}
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    className={inputClass("date_of_birth")}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}