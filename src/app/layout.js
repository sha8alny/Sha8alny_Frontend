import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
<<<<<<< HEAD
import { ToastProvider } from "./context/ToastContext";
import ReactQueryProvider from "./providers/ReactQueryProvider";
export const metadata = {
  title: "Shaغlny",
  description: "i need job",
=======
import ReactQueryProvider from "./providers/ReactQueryProvider";

export const metadata = {
  title: "Shaغlny",
  description: "I need job",
>>>>>>> parent of a31f319 (Merge remote-tracking branch 'origin/development' into jobs-page)
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
<<<<<<< HEAD
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
=======
          <ThemeProvider>{children}</ThemeProvider>
>>>>>>> parent of a31f319 (Merge remote-tracking branch 'origin/development' into jobs-page)
        </ReactQueryProvider>
      </body>
    </html>
  );
}
