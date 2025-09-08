import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Candidate Finder - Job Portal",
  description: "Find your dream job today with Candidate Finder!",
  icons: {
    icon: "/fit-finder-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="min-h-full flex flex-col">
          <Navigation />
          <main className="flex-grow">{children}</main>
          <footer className="bg-white border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  &copy; {new Date().getFullYear()} Candidate Finder. All rights
                  reserved.
                </p>
                <p className="text-xs text-gray-400">
                  Powered by{" "}
                  <span className="font-semibold text-gray-600">
                    ALL SYSTEMS GO SDN BHD
                  </span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
