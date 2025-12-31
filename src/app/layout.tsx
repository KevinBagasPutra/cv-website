import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kevin Bagas Putra - Freelance Web Developer | Laravel & MySQL Expert",
  description: "Professional freelance web developer specializing in Laravel, PHP, and MySQL. Expert in creating company profiles, e-commerce websites, and custom information systems. Available for hire.",
  keywords: [
    "Kevin Bagas Putra",
    "Freelance Web Developer",
    "Laravel Developer",
    "PHP Developer",
    "MySQL Expert",
    "Web Development Indonesia",
    "Company Profile Website",
    "Sistem Informasi",
    "Website UMKM",
    "Jakarta Web Developer"
  ],
  authors: [{ name: "Kevin Bagas Putra", url: "https://kevinbagasputra.github.io/my-cv/" }],
  creator: "Kevin Bagas Putra",
  publisher: "Kevin Bagas Putra",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kevin Bagas Putra - Freelance Web Developer",
    description: "Expert Laravel & PHP developer specializing in company profiles, e-commerce, and custom web applications.",
    url: "https://kevinbagasputra.github.io/my-cv/",
    siteName: "Kevin Bagas Putra - Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kevin Bagas Putra - Web Developer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Bagas Putra - Freelance Web Developer",
    description: "Expert Laravel & PHP developer specializing in company profiles, e-commerce, and custom web applications.",
    creator: "@kevinbagasputra",
    images: ["/og-image.jpg"]
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
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
