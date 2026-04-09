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
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}