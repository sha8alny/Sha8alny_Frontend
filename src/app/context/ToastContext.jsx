"use client";
import { createContext, useContext, useState } from "react";
import Toast from "@/app/components/ui/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, success = true, duration = 3000) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), duration);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          success={toast.success}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);