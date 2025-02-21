import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@/components/ProgressBar.jsx";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HelperBuddy - Reliable Home Repair Services",
  description:
    "HelperBuddy is your trusted platform for home repair services. Get expert electricians, plumbers, and technicians for quick and affordable service.",
  keywords:
    "ac installation, fan cleaning,helper buddy, home repair, plumbing, electrician, appliance repair, handyman services, home maintenance, HelperBuddy",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: "HelperBuddy - Get Expert Home Repair Services",
    description:
      "Need a quick fix? Book trusted professionals for home repairs, plumbing, electrical work, and more with HelperBuddy.",
    url: "https://helper-buddy.vercel.app",
    siteName: "HelperBuddy",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "HelperBuddy - Home Repair Services",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="dv6I5U3SsXAiLpOcS3O7PyVPUsaNHRuTtdAisQOWWDg" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#007bff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ProgressBar />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}


