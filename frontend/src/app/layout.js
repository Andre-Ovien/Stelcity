import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Stelcity",
  description: "StelCity is an e-commerce platform built to showcase and sell products, raw materials, and services. The platform is designed to provide a smooth shopping experience for customers while giving the brand a digital storefront.",
  icons: "/favicon.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}