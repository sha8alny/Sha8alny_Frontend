// context/AuthContext.js
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { redirectToSignIn, refreshAccessToken, checkAdminStatus } from "../services/userAuthentication";

// Define public paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/signin', '/signup', '/register', '/forget-password', '/reset-password', '/verify-email', '/error', '/about', '/privacy-policy', '/cookie-policy', '/terms'];

// Define admin paths that require admin authorization
const ADMIN_PATHS = ['/admin'];

const AuthContext = createContext({
  authenticated: false,
  loading: true,
  isAdmin: false,
  getRedirectPath: () => '/',
  clearRedirectPath: () => {},
});

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

    // Check admin status for admin routes
    if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
      try {
        const adminStatus = await checkAdminStatus();
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          router.push('/'); // Redirect to home if not admin
          return;
        }
      } catch (error) {
        console.error("Failed to verify admin status:", error);
        router.push('/');
        return;
      }
    }

    setAuthenticated(true);
    setLoading(false);
  }, [pathname, router]);

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
    isAdmin,
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
