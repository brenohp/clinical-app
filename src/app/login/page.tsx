// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation' // 1. Importamos useSearchParams

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false) // 2. Novo estado de carregamento
  const router = useRouter()
  const searchParams = useSearchParams() // Hook para ler os parâmetros da URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true) // Ativa o estado de carregamento

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('Credenciais inválidas. Tente novamente.')
        setIsLoading(false) // Desativa o carregamento em caso de erro
      } else if (result?.ok) {
        // 3. Lógica de redirecionamento inteligente
        const callbackUrl = searchParams.get('callbackUrl') // Pega a URL de callback
        router.push(callbackUrl || '/painel') // Redireciona para ela ou para /painel como padrão
      }
    } catch {
      setError('Ocorreu um erro inesperado.')
      setIsLoading(false) // Desativa o carregamento em caso de erro
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-brand-background">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
          <h1 className="text-center text-3xl font-bold mb-8 text-brand-primary">
            Acessar Sistema
          </h1>
          
          {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</p>}

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
              disabled={isLoading} // Desabilita o campo durante o carregamento
            />
          </div>

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
              disabled={isLoading} // Desabilita o campo durante o carregamento
            />
          </div>

          <div className="flex items-center justify-between">
            {/* 4. Botão com estado de carregamento */}
            <button
              type="submit"
              disabled={isLoading} // Desabilita o botão durante o carregamento
              className="bg-brand-accent hover:bg-brand-primary text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-300 disabled:bg-gray-400"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;{new Date().getFullYear()} ClinicalAPP. Todos os direitos reservados.
        </p>
      </div>
    </main>
  )
}