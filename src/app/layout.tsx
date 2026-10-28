import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const description =
  "Purse It generates the ideal backpack, bag, or purse design based on the items you use every day. Free to try.";

export const metadata: Metadata = {
  metadataBase: new URL("https://purse-it.vercel.app"),
  title: "Purse It — design the perfect bag for your stuff",
  description,
  openGraph: {
    title: "Purse It — your bag, designed around what you carry",
    description,
    url: "https://purse-it.vercel.app",
    siteName: "Purse It",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purse It — your bag, designed around what you carry",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
