const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const categoryDescriptions = {
  "Body wash": "Refreshing full-body cleansing treatments designed to remove impurities and leave your skin smooth.",
  "Dental Care": "Professional oral care services focused on maintaining healthy teeth and gums.",
  "Removal": "Hair and unwanted growth removal services using safe and effective methods.",
  "Facial treatment": "Specialized skincare treatments designed to cleanse, hydrate, and rejuvenate the face.",
  "Massage": "Relaxing and therapeutic massage services aimed at relieving muscle tension.",
  "Advanced aesthetics": "High-level cosmetic treatments that use modern techniques to enhance skin quality.",
}

async function fetchAllServices() {
  let allResults = []
  let url = `${BASE_URL}/api/services/add-service/`

  while (url) {
    const res = await fetch(url)
    const data = await res.json()
    allResults = [...allResults, ...data.results]
    url = data.next
  }

  return allResults
}

export async function getServices() {
  const allItems = await fetchAllServices()

  const grouped = {}
  allItems.forEach((item) => {
    const cat = item.category_name
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({
      id: `${cat}-${item.name}`,
      name: item.name,
      price: parseFloat(item.price),
    })
  })

  return Object.entries(grouped).map(([category, items], index) => ({
    id: index + 1,
    category,
    description: categoryDescriptions[category] || `Professional ${category.toLowerCase()} services.`,
    image: null,
    items,
  }))
}