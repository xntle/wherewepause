import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const Inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-inter",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "wherewepause",
  description: "safe space to pause",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
