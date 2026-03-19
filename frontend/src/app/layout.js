import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","600","700"],
  variable: "--font-poppins"
})

const metadata = {
  title: "Stelcity",
  description: "StelCity is an e-commerce platform built to showcase and sell products, raw materials, and services. The platform is designed to provide a smooth shopping experience for customers while giving the brand a digital storefront.",
  icons: "/favicon.png",
};

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