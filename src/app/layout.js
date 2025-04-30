import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import StripeProvider from "./providers/StripeProvider";
import Navbar from "./components/layout/NavBar";
import {AuthProvider} from "./context/AuthContext";
import DynamicFavicon from "./utils/DynamicFavicon";
import NotificationProvider from "./providers/NotificationProvider";
import { Toaster } from "@/app/components/ui/Sonner";

export const metadata = {
  title: "Shaغalny",
  description: "i need job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <AuthProvider>
          <ReactQueryProvider>
            <StripeProvider>
              <ThemeProvider>
                <NotificationProvider>
                <DynamicFavicon />
                <div className="sticky top-0 z-50">
                  <header>
                    <Navbar />
                  </header>
                </div>
                <ToastProvider>{children}</ToastProvider>
                </NotificationProvider>
              </ThemeProvider>
            </StripeProvider>
          </ReactQueryProvider>
          </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
