"use client";

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function DynamicFavicon() {
  const { theme } = useTheme();
  
  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    
    link.type = 'image/png';
    link.href = theme === 'dark' ? '/favicon-dark.ico' : '/favicon-light.ico';
  }, [theme]);
  
  return null;
}