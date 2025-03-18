import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import StripeProvider  from "./providers/StripeProvider";
export const metadata = {
  title: "Shaغlny",
  description: "i need job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <StripeProvider>
            <ThemeProvider>
              <ToastProvider>{children}</ToastProvider>
            </ThemeProvider>
          </StripeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
