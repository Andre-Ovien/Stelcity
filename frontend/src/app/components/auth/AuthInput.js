export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  className,
}) {
  const baseClass = "h-12 w-full rounded-full border bg-[#fbfaf7] px-4 text-sm text-[#17130f] outline-none transition placeholder:text-[#aaa39a] focus:border-[#17130f] focus:bg-white"
  const borderClass = error ? "border-[#c95650]" : "border-[#d8d4cc]"
  const errorId = id ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.18em] text-[#625c55]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${baseClass} ${borderClass} ${className || ""}`}
      />
      {error && <p id={errorId} className="px-1 text-xs text-[#c95650]">{error}</p>}
    </div>
  )
}
