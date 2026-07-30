const passwordRequirements = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export { passwordRequirements }

export default function PasswordRequirements({ password, variant = "default" }) {
  if (variant === "auth") {
    return (
      <div className="grid gap-x-4 gap-y-2 rounded-2xl border border-[#e1ddd5] bg-[#f8f6f1] p-4 sm:grid-cols-2">
        {passwordRequirements.map((req) => {
          const met = req.test(password)
          return (
            <div key={req.label} className="flex items-center gap-2">
              <span className={`grid h-4 w-4 place-items-center rounded-full text-[9px] font-black ${met ? "bg-[#eaff51] text-[#17130f]" : "bg-[#e3dfd8] text-[#8a837a]"}`} aria-hidden="true">
                {met ? "✓" : "·"}
              </span>
              <span className={`text-[10px] leading-4 ${met ? "text-[#38322c]" : "text-[#817a72]"}`}>
                {req.label}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white/80 rounded-xl px-4 py-3 flex flex-col gap-1.5">
      {passwordRequirements.map((req) => (
        <div key={req.label} className="flex items-center gap-2">
          <span className={`text-[11px] font-bold ${req.test(password) ? "text-green-500" : "text-red-400"}`}>
            {req.test(password) ? "✓" : "✗"}
          </span>
          <span className={`text-[11px] ${req.test(password) ? "text-green-600" : "text-red-400"}`}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  )
}
