"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function PasswordInput({
  id = "password",
  label,
  value,
  onChange,
  placeholder = "Password",
  error,
  autoComplete = "current-password",
}) {
  const [show, setShow] = useState(false)
  const baseClass = "h-12 w-full rounded-full border bg-[#fbfaf7] px-4 pr-11 text-sm text-[#17130f] outline-none transition placeholder:text-[#aaa39a] focus:border-[#17130f] focus:bg-white"
  const borderClass = error ? "border-[#c95650]" : "border-[#d8d4cc]"
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.18em] text-[#625c55]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${baseClass} ${borderClass}`}
        />
        <button
          type="button"
          onClick={() => setShow((previous) => !previous)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#625c55] transition hover:bg-[#f0eee9] hover:text-[#17130f]"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {error && <p id={errorId} className="px-1 text-xs text-[#c95650]">{error}</p>}
    </div>
  )
}
