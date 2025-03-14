import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

import ReactQueryProvider from "./providers/ReactQueryProvider";
export const metadata = {
  title: "Shaغlny",
  description: "i need job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
