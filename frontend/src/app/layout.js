import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import OrgSchema from "./components/OrgSchema"
import TikTokPixel from "./components/TiktokPixel"

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
    default: "Stelcity Skincare Nigeria",
    template: "%s | Stelcity",
  },
  description:
    "Shop skincare products and formulation ingredients, book beauty treatments, and learn practical skincare skills with Stelcity in Nigeria.",
  applicationName: "Stelcity",
  creator: "Stelcity",
  publisher: "Stelcity",
  category: "Skincare and beauty",
  manifest: "/site.webmanifest",
  verification: {
    google: "NU24pPefYwBVi4eXe8KuNyKyc-Zkc_16LofW-qZF9kg",
    other: {
      "p:domain_verify": "cc74998e20ef106bf21017318d86493b",
    },
  },

  metadataBase: new URL("https://www.stelcity.com"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Stelcity Skincare Nigeria",
    description:
      "Shop skincare products and formulation ingredients, book beauty treatments, and learn practical skincare skills with Stelcity.",
    siteName: "Stelcity",
    images: [
      {
        url: "/images/og-banner.jpg",
        width: 1200,
        height: 634,
        alt: "Stelcity Skincare Products — Healthy Skin Starts Here",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stelcity Skincare Nigeria",
    description:
      "Shop skincare products and ingredients, book beauty treatments, and learn with Stelcity.",
    images: ["/images/og-banner.jpg"],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <OrgSchema />
        <TikTokPixel />
        <main>{children}</main>
        
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
