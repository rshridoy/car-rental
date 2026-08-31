import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Auto — Fast and Easy Way to Rent a Car",
  description: "100% trusted car rental platform in the UK.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        <AIChatWidget />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
