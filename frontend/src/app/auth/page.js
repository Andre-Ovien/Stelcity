import AuthPage from './authClient'

export const metadata = {
  title: "Login or Create Account",
  description:"Access your account or create a new one to shop premium skincare products.",
  robots: {
    index: false,
    follow: false,
  },
}

const page = async ({ searchParams }) => {
  const { mode } = await searchParams

  return (
    <AuthPage initialMode={mode === "login" ? "login" : "register"} />
  )
}

export default page
