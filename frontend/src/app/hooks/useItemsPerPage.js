"use client"

import { useState, useEffect } from "react"

export function useItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(4) 

  useEffect(() => {
    const update = () => {
      setItemsPerPage(window.innerWidth >= 768 ? 8 : 4)
    }
    update() 
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return itemsPerPage
}