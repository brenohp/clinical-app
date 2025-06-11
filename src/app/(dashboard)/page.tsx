// src/app/dashboard/page.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Enquanto a sessão está sendo verificada no cliente, mostramos um loader
  if (status === 'loading') {
    return <p className="flex justify-center items-center h-screen text-brand-primary">Carregando...</p>
  }

  // Se o usuário não estiver autenticado, o ideal é que o middleware já o tenha redirecionado.
  // Este é um fallback de segurança no lado do cliente.
  if (status === 'unauthenticated') {
    router.push('/login')
    return null; // Retorna nulo para não renderizar nada enquanto redireciona
  }

  // Se estiver autenticado, mostra o conteúdo do dashboard
  return (
    <div className="min-h-screen bg-brand-background text-brand-primary">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-brand-primary">
            Clinical App
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-brand-accent hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Sair
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-4">
          Bem-vindo(a) de volta, <span className="text-brand-accent">{session?.user?.name}</span>!
        </h2>
        <p className="text-gray-600">
          Este é o seu painel de controle. Em breve, aqui estarão seus agendamentos e informações importantes.
        </p>
        
        <div className="mt-8 p-6 bg-white rounded-xl shadow">
          <h3 className="text-xl font-semibold text-brand-accent">Próximos Agendamentos</h3>
          <p className="mt-2 text-gray-500">Nenhum agendamento para hoje.</p>
        </div>
      </main>
    </div>
  )
}