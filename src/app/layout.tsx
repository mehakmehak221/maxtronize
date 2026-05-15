import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { StoreProvider } from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maxtronize",
    template: "%s | Maxtronize",
  },
  description: "Tokenized real-world asset platform for issuers and investors.",
  icons: {
    icon: [{ url: "/icons/favicon.png", type: "image/png" }],
    shortcut: "/icons/favicon.png",
    apple: "/icons/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300 selection:bg-primary/20 selection:text-foreground">
        <StoreProvider>
          <ThemeProvider>
            <div className="motion-app-mount flex min-h-full flex-1 flex-col">{children}</div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
