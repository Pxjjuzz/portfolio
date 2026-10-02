import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const title = "Prajwal Poojary — AI / ML · Creative Developer · Builder";

const description =
  "Prajwal Poojary is an AIML engineering student in Bangalore building AI, IoT and interactive experiences. I build things that shouldn't feel like websites.";

export const metadata: Metadata = {
  metadataBase: new URL("https://prajwal.dev"),
  title: {
    default: title,
    template: "%s — Prajwal Poojary",
  },
  description,
  applicationName: "Prajwal.OS",
  keywords: [
    "Prajwal Poojary",
    "AIML engineering student",
    "AI ML developer",
    "creative developer",
    "WebGL",
    "Three.js",
    "IoT",
    "computer vision",
    "video editor",
    "Bangalore",
  ],
  authors: [{ name: "Prajwal Poojary" }],
  creator: "Prajwal Poojary",
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Prajwal.OS",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04050a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}