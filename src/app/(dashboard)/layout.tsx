// app/(dashboard)/layout.tsx

import Link from 'next/link';
// Re-adicionando Settings para o link de configurações
import { LayoutDashboard, Users, Settings, Menu } from 'lucide-react';

export default function DashboardLayout({
  children, // Este é o "recheio" (a página atual)
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-brand-background">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-primary text-white flex flex-col">
        <div className="p-6">
          <Link href="/painel" className="text-2xl font-semibold text-white hover:opacity-80 transition-opacity">
            ClinicalAPP
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {/* Adicionei as classes de estilo completas aos links */}
          <Link href="/painel" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white bg-brand-accent">
            <LayoutDashboard size={20} />
            <span>Painel</span>
          </Link>
          <Link href="/patients" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-brand-accent/50 transition duration-200">
            <Users size={20} />
            <span>Pacientes</span>
          </Link>
        </nav>
        {/* Adicionei a seção inferior da sidebar com o link de configurações */}
        <div className="p-6">
          <Link href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-brand-accent/50 transition duration-200">
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
        </div>
      </aside>

      {/* Área Principal onde o conteúdo da página é injetado */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Adicionei o Header completo que estava faltando */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Botão de menu para mobile */}
            <button className="text-gray-600 md:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-brand-primary ml-2 md:ml-0">
              Painel Administrativo
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Profile (funcionalidade no futuro) */}
            <div className="w-8 h-8 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary font-bold">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}