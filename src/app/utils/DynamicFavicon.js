"use client";

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function DynamicFavicon() {
  const { theme } = useTheme();
  
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = theme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [theme]);
  
  return null;
}