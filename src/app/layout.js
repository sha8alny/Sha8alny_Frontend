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
  title: {
    default: 'Shaغalny',
    template: '%s | Shaغalny'
  },
  description: 'Shaغalny connects professionals across the Middle East with job opportunities, networking, and career development resources to boost your career journey.',
  keywords: ['jobs', 'networking', 'career', 'employment', 'professional', 'Middle East', 'Egypt', 'job hunting'],
  openGraph: {
    title: 'Shaغalny - Connect, Learn, and Grow Professionally',
    description: 'Shaغalny connects professionals across the Middle East with job opportunities, networking, and career development resources to boost your career journey.',
    url: 'https://sha8alny.online',
    siteName: 'Shaغalny',
    images: [
      {
        url: 'https://sha8alny.online/lightmode.svg',
        width: 1200,
        height: 630,
        alt: 'Shaغalny - Professional Networking Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shaغalny - Connect, Learn, and Grow Professionally',
    description: 'Shaغalny connects professionals across the Middle East with job opportunities, networking, and career development resources to boost your career journey.',
    images: ['https://sha8alny.online/lightmode.svg'],
    creator: '@sha8alny',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  metadataBase: new URL('https://sha8alny.online'),
  alternates: {
    canonical: '/',
  },
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
