"use client"
export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "../../components/Header"
import { useAuthStore } from "../../store/authStore"
import { getShippingAddress, saveShippingAddress, updateShippingAddress } from "../../lib/profile"
import toast from "react-hot-toast"

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
]

export default function ShippingAddressPage() {
  const token = useAuthStore((s) => s.token)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [existing, setExisting] = useState(null)

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

  useEffect(() => {
    if (!token) return
    getShippingAddress(token).then((data) => {
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
    if (!form.street_address.trim()) newErrors.street_address = "Street address is required"
    if (!form.city.trim()) newErrors.city = "City is required"
    if (!form.state) newErrors.state = "Please select a state"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      if (existing) {
        await updateShippingAddress({ ...form, country: "Nigeria" }, token)
      } else {
        await saveShippingAddress({ ...form, country: "Nigeria" }, token)
      }
      toast.success("Shipping address saved!")
      router.push(redirect || "/profile")
    } catch (err) {
      toast.error(err.message || "Failed to save address")
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
          Shipping Address
        </h1>

        {fetching ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">

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

            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">Street Address *</label>
              <input
                type="text"
                value={form.street_address}
                onChange={(e) => handleChange("street_address", e.target.value)}
                placeholder="123 Lekki Phase 1"
                className={inputClass("street_address")}
              />
              {errors.street_address && (
                <p className="text-red-400 text-[11px] mt-1 px-1">{errors.street_address}</p>
              )}
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Ikeja"
                className={inputClass("city")}
              />
              {errors.city && (
                <p className="text-red-400 text-[11px] mt-1 px-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">State *</label>
              <select
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className={`${inputClass("state")} appearance-none`}
              >
                <option value="">Select a state</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-400 text-[11px] mt-1 px-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">Country</label>
              <div className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-400 bg-gray-50">
                Nigeria
              </div>
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">Postal Code</label>
              <input
                type="text"
                value={form.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                placeholder="100271"
                className={inputClass("postal_code")}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#D65A5A] text-white font-semibold py-3 rounded-full text-[14px] hover:bg-[#c44f4f] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Saving..." : existing ? "Update Address" : "Save Address"}
            </button>

          </div>
        )}
      </div>
    </div>
  )
}