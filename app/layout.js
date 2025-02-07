import { } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "HelperBuddy",
  description: "HelperBuddy is a platform for providing repairing service to people.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
