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
