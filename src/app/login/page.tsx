// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('Credenciais inválidas. Tente novamente.')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch {
      setError('Ocorreu um erro inesperado.')
    }
  }

  return (
    // Usando a cor de fundo do nosso tema
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-brand-background">
      <div className="w-full max-w-md">
        {/* Card do formulário com fundo branco, sombra e bordas arredondadas */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
          
          {/* Título com a cor primária e tipografia padronizada */}
          <h1 className="text-center text-3xl font-bold mb-8 text-brand-primary">
            Acessar Sistema
          </h1>
          
          {/* Mensagem de erro */}
          {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</p>}

          {/* Campo de Email */}
          <div className="mb-4">
            <label className="block text-brand-primary text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-accent-light"
              required
            />
          </div>

          {/* Campo de Senha */}
          <div className="mb-6">
            <label className="block text-brand-primary text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-accent-light"
              required
            />
          </div>

          {/* Botão de Entrar com as cores do tema */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-brand-accent hover:bg-brand-primary text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
            >
              Entrar
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;{new Date().getFullYear()} Gestão de Consultório. Todos os direitos reservados.
        </p>
      </div>
    </main>
  )
}