import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/context/AuthContext";
import { getSession } from "@/lib/api/getSession";
import { Navigation } from "@/components/common/navigation/Navigation";
import { MainContent } from "@/components/common/MainContent";
import { cn } from "@/lib/utils";

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-noto-sans',
  subsets: ['thai'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const bodyLayout = cn('flex max-w-7xl m-auto rounded overflow-clip border')

export const metadata: Metadata = {
  title: "Free Concert Tickets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" className={notoSansThai.variable}>
      <body
        className={cn(
          bodyLayout,
        )}
      >
        <AuthProvider
          user={session?.user || undefined}
          isRefreshTokenExpired={session?.isRefreshTokenExpired}
          isTokenExpired={session?.isTokenExpired}
        >
          <Navigation />
          <MainContent>{children}</MainContent>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
