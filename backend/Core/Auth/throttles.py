import hashlib

from rest_framework.throttling import SimpleRateThrottle


class LoginRateThrottle(SimpleRateThrottle):
    scope = "login"

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        email = str(request.data.get("email", "")).strip().lower()
        if not email:
            return f"login_{ident}_unknown"

        email_hash = hashlib.sha256(email.encode("utf-8")).hexdigest()[:16]
        return f"login_{ident}_{email_hash}"


class LoginBurstRateThrottle(SimpleRateThrottle):
    scope = "login_burst"

    def get_cache_key(self, request, view):
        return f"login_burst_{self.get_ident(request)}"


class RegisterRateThrottle(SimpleRateThrottle):
    scope = "register"

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return f"register_{ident}"
