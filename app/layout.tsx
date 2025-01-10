import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }


import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Sidebar from './components/Sidebar'

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const router = useRouter()
  
    useEffect(() => {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true)
      }
    }, [])

    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode)
    }
  
    // Don't show layout on login page
    if (router.pathname === '/login') {
      return <main className={isDarkMode ? 'dark' : ''}>{children}</main>
    }

    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        

        </body>
      </html>
      
    );
  }