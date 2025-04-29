// context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { redirectToSignIn, refreshAccessToken } from "../services/userAuthentication";

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/signin', '/signup', '/register', '/forget-password', '/reset-password', '/verify-email', '/error', '/about'];


const AuthContext = createContext({
  authenticated: false,
  loading: true,
  getRedirectPath: () => '/',
  clearRedirectPath: () => {},
});

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    if (!pathname) return;

    // Skip auth check for public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const isProfileComplete = localStorage.getItem("isProfileComplete");

    if (isProfileComplete=== "false" && pathname !== "/complete-profile" && accessToken) {
      router.push('/complete-profile');
      return;
    }

    if (!accessToken && !refreshToken ) {
      sessionStorage.setItem('redirectPath', pathname);
      redirectToSignIn();
      return;
    }

    if (!accessToken && refreshToken) {
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        sessionStorage.setItem('redirectPath', pathname);
        redirectToSignIn();
        return;
      }
    }

    setAuthenticated(true);
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const getRedirectPath = useCallback(() => {
    return sessionStorage.getItem('redirectPath') || '/';
  }, []);

  const clearRedirectPath = useCallback(() => {
    sessionStorage.removeItem('redirectPath');
  }, []);

  const contextValue = {
    authenticated,
    loading,
    getRedirectPath,
    clearRedirectPath,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? null : children} {/* Optional: replace null with a spinner */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
