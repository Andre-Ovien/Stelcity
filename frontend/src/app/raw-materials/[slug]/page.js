import RawMaterialClient from "./RawMaterialClient"
import { notFound } from "next/navigation"
import ProductSchema from "../../components/ProductSchema"
import BreadcrumbSchema from "../../components/BreadcrumbSchema"
import { getProductDetail } from "../../lib/productDetail"

export async function generateMetadata({ params }) {
  const { slug } = await params  
  try {
    const product = await getProductDetail(slug)  
    if (!product || product.category !== "raw_material") {
      return {
        title: "Product Not Found",
        robots: { index: false, follow: true },
      }
    }

    return {
      title: product.name,
      description:
        product.description ||
        `Buy ${product.name} for skincare formulation from Stelcity in Nigeria.`,
      alternates: {
        canonical: `/raw-materials/${slug}`,
      },
      openGraph: {
        title: `${product.name} | Stelcity`,
        description: product.description,
        url: `https://www.stelcity.com/raw-materials/${slug}`, 
        images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: product.image ? [product.image] : [],
      },
    }
  } catch {
    return {
      title: "Skincare Raw Material",
      robots: { index: false, follow: true },
    }
  }
}

export default async function RawMaterialPage({ params }) {
  const { slug } = await params 
  let product = null
  try {
    product = await getProductDetail(slug) 
  } catch (error) {
    if (error?.status === 404) notFound()
    throw error
  }

  if (product && product.category !== "raw_material") notFound()

  return (
    <>
      {product?.category === "raw_material" && <ProductSchema product={product} basePath="raw-materials" />}
      {product?.category === "raw_material" && (
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "/" },
            { name: "Raw Materials", url: "/raw-materials" },
            { name: product.name, url: `/raw-materials/${product.slug}` },
          ]}
        />
      )}
      <RawMaterialClient params={params} initialProduct={product} />
    </>
  )
}
