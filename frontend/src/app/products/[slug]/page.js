import ProductClient from "./ProductClient"
import { notFound } from "next/navigation"
import ProductSchema from "../../components/ProductSchema"
import BreadcrumbSchema from "../../components/BreadcrumbSchema"
import { getProductDetail } from "../../lib/productDetail"

export async function generateMetadata({ params }) {
  const { slug } = await params
  try {
    const product = await getProductDetail(slug)
    if (!product || product.category !== "product") {
      return {
        title: "Product Not Found",
        robots: { index: false, follow: true },
      }
    }

    return {
      title: product.name,
      description:
        product.description ||
        `Shop ${product.name} from Stelcity with delivery across Nigeria.`,
      alternates: {
        canonical: `/products/${slug}`,
      },
      openGraph: {
        title: `${product.name} | Stelcity`,
        description: product.description,
        url: `https://www.stelcity.com/products/${slug}`,
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
      title: "Skincare Product",
      robots: { index: false, follow: true },
    }
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  let product = null
  try {
    product = await getProductDetail(slug)
  } catch (error) {
    if (error?.status === 404) notFound()
    throw error
  }

  if (product && product.category !== "product") notFound()

  return (
    <>
      {product?.category === "product" && <ProductSchema product={product} />}
      {product?.category === "product" && (
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "/" },
            { name: "Skincare Products", url: "/products" },
            { name: product.name, url: `/products/${product.slug}` },
          ]}
        />
      )}
      <ProductClient params={params} initialProduct={product} />
    </>
  )
}
