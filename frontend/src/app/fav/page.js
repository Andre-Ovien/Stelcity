import React from 'react'

import FavouritesPage from './FavouritesPage'

export const metadata = {
  title: "Your Favorites | Stelcity",
  description: "View and manage your saved skincare products.",
  robots: {
    index: false,
    follow: false,
  },
}

const page = () => {
  return (
    <FavouritesPage />
  )
}

export default page