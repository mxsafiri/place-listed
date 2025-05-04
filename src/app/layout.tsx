import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { AppProviders } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlaceListed - Business Discovery Platform",
  description: "Discover and connect with local businesses. PlaceListed helps small businesses become digitally discoverable without needing a website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div suppressHydrationWarning>
          <AppProviders>
            <AuthProvider>
              <Navbar />
              <div className="min-h-screen">
                {children}
              </div>
              <Footer />
            </AuthProvider>
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
