// src/components/AuthProvider.tsx

'use client' // Importante! Este é um Componente de Cliente

import { SessionProvider } from 'next-auth/react'
import React from 'react'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}