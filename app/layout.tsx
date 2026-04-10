import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "備品貸出管理",
  description: "QRコードで備品の貸出・返却を管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-background">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-bold text-lg">
              備品管理
            </Link>
            <Link href="/equipments" className="text-sm text-muted-foreground hover:text-foreground">
              備品一覧
            </Link>
            <Link href="/scan" className="text-sm text-muted-foreground hover:text-foreground">
              QRスキャン
            </Link>
            <Link href="/loans" className="text-sm text-muted-foreground hover:text-foreground">
              貸出状況
            </Link>
            <Link href="/loans/history" className="text-sm text-muted-foreground hover:text-foreground">
              履歴
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
