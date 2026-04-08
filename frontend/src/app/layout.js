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
    default: "Stelcity - Healthy Skin Starts Here",
    template: "%s | Stelcity",
  },
  description:
    "Shop premium skincare products, raw materials, and beauty services in Nigeria. Stelcity helps you achieve healthy skin with trusted products and expert care.",
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
  metadataBase: new URL("https://stelcity.com"),
  alternates: {
    canonical: "https://stelcity.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: "/favicon.png",
  openGraph: {
    title: "Stelcity - Healthy Skin Starts Here",
    description:
      "Premium skincare products, raw materials and professional services.",
    url: "https://stelcity.com",
    siteName: "Stelcity",
    images: [
      {
        url: "/images/og-banner.jpeg",
        width: 1200,
        height: 630,
        alt: "Stelcity Skincare Products",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stelcity - Healthy Skin Starts Here",
    description:
      "Premium skincare products, raw materials and professional services.",
    images: ["/images/og-banner.jpeg"],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable} antialiased`}>
        <OrgSchema />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}