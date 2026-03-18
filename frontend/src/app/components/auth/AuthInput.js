export default function AuthInput({ type = "text", value, onChange, placeholder, error, className }) {
  const baseClass = "w-full bg-transparent border rounded-xl px-4 py-3 text-[14px] text-black outline-none focus:bg-white focus:text-black transition-all placeholder:text-black"
  const borderClass = error ? "border-red-400" : "border-gray-300 focus:border-[#D65A5A]"

  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClass} ${borderClass} ${className || ""}`}
      />
      {error && <p className="text-red-400 text-[11px] px-1">{error}</p>}
    </div>
  )
}