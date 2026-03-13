const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";


export async function getBestSellers() {
  const fakeBestSellers = [
    {
      id: 1,
      name: "Germall Plus",
      description: "Protects water-based skincare products",
      price: 5000,
      rating: 5,
      image: "/images/german.png",
    },
    {
      id: 2,
      name: "Glass Skin Face Set",
      description: "For dark eye circles, dull skin, clears...",
      price: 15000,
      rating: 5,
      image: "/images/acne.png",
    },
    {
      id: 3,
      name: "Acne Face Set",
      description: "Clears pimples and dark spots...",
      price: 30000,
      rating: 5,
      image: "/images/black.png",
    },
    {
      id: 4,
      name: "Luxury Face Serum",
      description: "Brightens and smoothens skin tone...",
      price: 5000,
      rating: 5,
      image: "/images/face.png",
    },
  ]

  return fakeBestSellers
}