import type { Metadata } from "next"
import { Inter, Roboto_Mono, Source_Sans_3, Orbitron } from 'next/font/google'
import TopNav from "@/components/top-nav"
import "./globals.css"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

const sourceSansPro = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans-pro',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "NeoCode Nexus Hub",
  description: "Learn JavaScript interactively",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${robotoMono.variable} ${sourceSansPro.variable} ${orbitron.variable}`}>
      <body className={`${orbitron.variable} font-orbitron bg-background text-foreground flex flex-col min-h-screen`}>
        <TopNav />
        <main className="flex-grow pt-12">
          {children}
        </main>
      </body>
    </html>
  )
}

