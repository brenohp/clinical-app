// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // 1. IMPORTAR

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestão de Consultório", // Pode aproveitar e mudar o título :)
  description: "Sistema de gestão para clínicas e consultórios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider> {/* 2. ENVELOPAR */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}