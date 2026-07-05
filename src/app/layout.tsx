import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${plusJakartaSans.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-obsidian text-gray-100" style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        {/* Soft, modern background glows */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] rounded-full bg-brand-green/5 blur-[140px] opacity-75" />
          <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-brand-copper/5 blur-[180px] opacity-75" />
        </div>
        <Navigation />
        <main className="flex-grow pb-24 md:pb-12 pt-6 md:pt-28">
          {children}
        </main>
      </body>
    </html>
  );
}
