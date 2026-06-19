import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const jetBrains = JetBrains_Mono({
  variable: "--font-JetBrains_Mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ParkEase — Smart Parking, Zero Hassle",
  description:
    "Find and reserve premium parking spots in seconds. Real-time availability, instant booking, seamless experience.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </SidebarProvider>
  );
}
