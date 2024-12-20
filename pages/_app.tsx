import type { AppProps } from 'next/app'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'react-hot-toast'
import "@/app/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  )
}

