import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

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
  description: "Premium skincare products, raw materials and professional services. Shop skincare essentials, book beauty services and learn from expert training programs.",
  keywords: ["skincare", "beauty", "Nigeria", "skincare products", "raw materials", "facial treatment", "skin care Nigeria", "body care"],
  metadataBase: new URL("https://stelcity.com"),
  icons: "/favicon.png",
  openGraph: {
    title: "Stelcity — Healthy Skin Starts Here",
    description: "Premium skincare products, raw materials and professional services.",
    url: "https://stelcity.com",
    siteName: "Stelcity",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "Stelcity",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stelcity — Healthy Skin Starts Here",
    description: "Premium skincare products, raw materials and professional services.",
    images: ["/images/logo.png"],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}