import { Geist, Geist_Mono } from "next/font/google";
import Squares from '@/components/ui/Squaresbg';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "diff-0-matic",
  description: "A comparission tool for diffing files",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <div className="absolute  inset-0 ">
          <Squares 
            speed={0.5} 
            squareSize={40}
            direction='diagonal' // up, down, left, right, diagonal
            borderColor='#fff'
            hoverFillColor='#222'
          />
        </div>
        {children}
      </body>
    </html>
  );
}
