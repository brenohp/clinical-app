// src/app/(dashboard)/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  // O middleware cuidará do redirecionamento, mas mantemos um loader
  if (status === 'loading') {
    return <p className="p-6">Carregando...</p>
  }

  return (
    // Note que não há <header> ou <main> aqui, pois eles já vêm do layout.tsx
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">
          Bem-vindo(a) de volta, <span className="text-brand-accent">{session?.user?.name}</span>!
        </h2>
        <p className="text-gray-600 mt-1">
          Este é o seu painel de controle. Aqui estão as informações mais recentes da clínica.
        </p>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Consultas Hoje */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <p className="text-sm text-gray-500">Consultas Hoje</p>
          <p className="text-3xl font-bold text-brand-accent">8</p> 
        </div>

        {/* Card 2: Pacientes Ativos */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <p className="text-sm text-gray-500">Pacientes Ativos</p>
          <p className="text-3xl font-bold text-brand-accent">124</p> 
        </div>

        {/* Adicione mais cards conforme necessário */}
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow">
        <h3 className="text-xl font-semibold text-brand-primary">Próximos Agendamentos</h3>
        <p className="mt-2 text-gray-500">Nenhum agendamento para hoje.</p>
      </div>
    </>
  )
}