// src/app/page.tsx
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Evita redirecionamento automático
      })

      if (result?.error) {
        console.error(result.error)
        alert('Falha no login: verifique suas credenciais.')
      } else {
        // O login foi bem-sucedido, a sessão será atualizada automaticamente
        alert('Login realizado com sucesso!')
      }
    } catch (error) {
      console.error('Ocorreu um erro inesperado:', error)
      alert('Ocorreu um erro inesperado.')
    }
  }

  // Se a sessão estiver carregando, mostra uma mensagem
  if (status === 'loading') {
    return <p>Carregando...</p>
  }

  // Se o usuário estiver autenticado, mostra a mensagem de boas-vindas
  if (status === 'authenticated') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl mb-4">Bem-vindo, {session.user?.name}!</h1>
        <p>Email: {session.user?.email}</p>
        <p className="mb-4">Role: {session.user?.role}</p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </main>
    )
  }

  // Se não estiver autenticado, mostra o formulário de login
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border rounded text-black"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </main>
  )
}