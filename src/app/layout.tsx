import type { Metadata } from 'next'
import { Inter, Poppins, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LCCCS - Liberian Center for Cross Cultural Studies',
  description: 'A world-class educational institution dedicated to cross-cultural studies and academic excellence.',
  keywords: ['education', 'university', 'cross-cultural studies', 'Liberia', 'academic excellence'],
  authors: [{ name: 'LCCCS' }],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'LCCCS - Liberian Center for Cross Cultural Studies',
    description: 'A world-class educational institution dedicated to cross-cultural studies and academic excellence.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
