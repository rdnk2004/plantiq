import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PlantIQ | IoT Smart Plant Health Monitoring System",
  description: "Interactive visual dashboard and QR plant passport for the PlantIQ IoT smart plant health monitoring system. ESP32 powered, multi-sensor fusion, adaptive baseline, and predictive watering window.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#0F1117] text-gray-100" style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <Navigation />
        <main className="flex-grow pb-20 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
