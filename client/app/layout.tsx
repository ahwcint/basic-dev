import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { getSession } from '@/lib/api/get-session';
import { cn } from '@/lib/utils';
import { MainQueryClientProvider } from '@/components/common/root/main-query-client-provider';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/lib/providers/theme-provider';

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-noto-sans',
  subsets: ['thai'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Basic-Dev',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isRefreshTokenExpired, isTokenExpired, accessToken, user } = await getSession();
  return (
    <html lang="en" className={cn(notoSansThai.variable)} suppressHydrationWarning>
      <body className={cn('flex m-auto rounded overflow-clip border background-primary')}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none *:absolute">
          <div className="-top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="-bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl" />
          <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />

          <div className="top-20 right-20 w-60 h-60 bg-gradient-to-br from-violet-500/8 to-blue-500/8 rounded-full blur-2xl" />
          <div className="bottom-20 left-20 w-60 h-60 bg-gradient-to-tr from-emerald-500/8 to-cyan-500/8 rounded-full blur-2xl" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MainQueryClientProvider>
            <AuthProvider
              accessToken={accessToken}
              isRefreshTokenExpired={isRefreshTokenExpired}
              isTokenExpired={isTokenExpired}
              accessUser={user}
            >
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </MainQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
