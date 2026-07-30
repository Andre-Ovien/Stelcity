export const SITE_URL = "https://www.stelcity.com"

export const BUSINESS = {
  name: "Stelcity",
  phoneDisplay: "+234 809 222 1127",
  phoneInternational: "+2348092221127",
  whatsappNumber: "2348092221127",
  email: "stellaefeturi1@gmail.com",
  address:
    "No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along Badagry Express Way, Lagos State",
  streetAddress:
    "No 430 Jida Plaza, Opp Redeem Church, Agbara Bus Stop, Along Badagry Express Way",
  locality: "Agbara",
  region: "Lagos State",
  country: "NG",
  mapCoordinates: {
    latitude: 6.5040875,
    longitude: 3.1003906,
  },
}

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/Stelcityskincarenspa",
  instagram: "https://www.instagram.com/stelcityskincare_aesthetics",
}

export function getWhatsAppUrl(message) {
  const baseUrl = `https://wa.me/${BUSINESS.whatsappNumber}`
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
}

export function getGoogleMapsUrl() {
  const { latitude, longitude } = BUSINESS.mapCoordinates
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

export function getGoogleMapsDirectionsUrl() {
  const { latitude, longitude } = BUSINESS.mapCoordinates
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
}
