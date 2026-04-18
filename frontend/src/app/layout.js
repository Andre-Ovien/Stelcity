import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import OrgSchema from "./components/OrgSchema"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins"
})

export const metadata = {
  title: {
    default: "Stelcity - Best Skincare Products in Nigeria",
    template: "%s | Stelcity",
  },
  description:
    "Shop dermatologist-tested skincare products, raw materials and professional beauty services in Nigeria. Trusted by 10,000+ happy customers across Lagos.",
  applicationName: "Stelcity",
  creator: "Stelcity",
  publisher: "Stelcity",
  keywords: [
    "Stelcity Website",
    "Stelcity Skincare",
    "Stelcity Nigeria",
    "Skincare products Nigeria",
    "Best skincare Nigeria",
    "Skincare online Nigeria",
    "Skincare for all skin types Nigeria",
    "Skincare for sensitive skin Nigeria",
    "Skincare for acne-prone skin Nigeria",
    "Skincare for dry skin Nigeria",
    "Skincare for oily skin Nigeria",
    "Skincare for combination skin Nigeria",
    "Skincare for aging skin Nigeria",
    "Skincare for hyperpigmentation Nigeria",
    "Skincare for dark spots Nigeria",
    "Skincare for uneven skin tone Nigeria",
    "Skincare for dull skin Nigeria",
    "Skincare for glowing skin Nigeria",
    "Skincare for healthy skin Nigeria",
    "Best skincare products Nigeria",
    "Best skincare brands Nigeria",
    "Cheap skincare Nigeria",
    "buy skincare products Nigeria",
    "skincare raw materials Nigeria",
    "facial treatment Lagos",
    "organic skincare Nigeria",
    "beauty training Nigeria",
    "skincare consultation Nigeria",
    "premium skincare Nigeria",
    "skincare delivery Nigeria",
    "skincare subscription Nigeria",
    "skincare products online Nigeria",
    "skincare services Nigeria",
    "skincare experts Nigeria",
    "skincare routines Nigeria",
    "skincare tips Nigeria",
    "skincare reviews Nigeria",
    "skincare blog Nigeria",
    "Affordable skincare Nigeria",
    "Natural skincare Nigeria",
    "Skincare for all skin types Nigeria",
    "Skincare for sensitive skin Nigeria",
    "Skincare for acne-prone skin Nigeria",
    "Skincare for dry skin Nigeria",
    "Skincare for oily skin Nigeria",
    "Skincare for combination skin Nigeria",
    "Skincare for aging skin Nigeria",
    "Skincare for hyperpigmentation Nigeria",
    "Skincare for dark spots Nigeria",
    "Skincare for uneven skin tone Nigeria",
    "Skincare for dull skin Nigeria",
    "Skincare for glowing skin Nigeria",
    "Skincare for healthy skin Nigeria",
    "Stelcity skincare",
    "Stelcity beauty",
    "Stelcity spa",
    "Stelcity cosmetics",
    "Stelcity skincare products",
    "Stelcity beauty products",
    "Stelcity skin care brand",
    "Stelcity spa services",
    "Stelcity skincare store",
    "skincare products",
    "skincare routine",
    "beauty products",
    "facial skincare",
    "healthy glowing skin",
    "premium skincare products",
    "natural skincare products",
    "dermatologist tested skincare",
    "cruelty free skincare",
    "organic skincare products",
    "skincare essentials",
    "luxury skincare products",
    "skincare for glowing skin",
    "skincare treatments",
    "buy skincare products online",
    "affordable skincare products",
    "skincare store online",
    "best skincare products",
    "skincare products for women",
    "skincare products for men",
    "premium beauty products",
    "skin treatment products",
    "beauty care products",
    "face care products",
    "cosmetic raw materials",
    "skincare raw materials",
    "beauty product raw materials",
    "ingredients for skincare products",
    "cosmetic ingredients supplier",
    "skincare formulation ingredients",
    "cosmetic manufacturing ingredients",
    "skincare production materials",
    "cosmetic raw materials supplier",
    "skincare training",
    "beauty training",
    "skincare certification",
    "cosmetic formulation training",
    "skincare production training",
    "skincare business training",
    "beauty product formulation course",
    "cosmetic making training",
    "skincare entrepreneurship training",
    "spa training courses",
    "spa services",
    "skincare consultation",
    "professional skincare treatment",
    "facial treatment services",
    "beauty spa services",
    "skin therapy",
    "skin rejuvenation treatments",
    "acne treatment services",
    "skin care consultation",
    "skincare products in Nigeria",
    "buy skincare products in Nigeria",
    "spa services in Nigeria",
    "beauty products in Nigeria",
    "cosmetic raw materials Nigeria",
    "skincare training in Nigeria",
    "spa services Lagos",
    "beauty spa Lagos",
    "skincare products Lagos",
    "best skincare products for glowing skin",
    "natural skincare products for sensitive skin",
    "where to buy skincare products in Nigeria",
    "affordable skincare products in Nigeria",
    "cosmetic raw materials suppliers in Nigeria",
    "skincare training courses in Nigeria",
    "professional spa services in Lagos",
    "skincare consultation near me"
],
  metadataBase: new URL("https://www.stelcity.com"),
  alternates: {
    canonical: "https://www.stelcity.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Stelcity — Premium Skincare Products in Nigeria",
    description:
      "Shop dermatologist-tested skincare products, raw materials and professional beauty services in Nigeria. Trusted by 10,000+ happy customers across Lagos.",
    url: "https://www.stelcity.com",
    siteName: "Stelcity",
    images: [
      {
        url: "/images/og-banner.jpg?v=2",
        width: 1200,
        height: 630,
        alt: "Stelcity Skincare Products — Healthy Skin Starts Here",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stelcity — Premium Skincare Products in Nigeria",
    description:
      "Shop dermatologist-tested skincare products, raw materials and professional beauty services in Nigeria. Trusted by 10,000+ happy customers.",
    images: ["/images/og-banner.jpg?v=2"],
  },
  verification: {
    google: "NU24pPefYwBVi4eXe8KuNyKyc-Zkc_16LofW-qZF9kg",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <OrgSchema />
        <main>{children}</main>
        
        <Toaster position="top-center" />
      </body>
    </html>
  )
}