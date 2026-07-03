import "./globals.css";
import type { Metadata } from "next";
import ClientResponsiveHelper from "@/components/ClientResponsiveHelper";

export const metadata: Metadata = {
  title: "BuildCon ERP",
  description: "Construction ERP + AI Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ClientResponsiveHelper />
      </body>
    </html>
  );
}
