import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ProgressBar from "@/components/progressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HelperBuddy",
  description: "HelperBuddy is a platform for providing repairing service to people.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="inter.className" >
        <ProgressBar/>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
