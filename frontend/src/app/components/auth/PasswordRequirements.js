const passwordRequirements = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export { passwordRequirements }

export default function PasswordRequirements({ password }) {
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