export function handleSessionExpiry(router, softLogout, redirectPath) {
  softLogout()
  sessionStorage.setItem("redirectAfter", redirectPath || "/")
  router.push("/auth") 
}