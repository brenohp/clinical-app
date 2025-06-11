// app/(dashboard)/layout.tsx

import Link from 'next/link';
import { Menu } from 'lucide-react';
// Note: importamos com CHAVES porque é uma exportação nomeada
import { SidebarNav } from './_components/SidebarNav';

// Note: esta é uma EXPORTAÇÃO PADRÃO
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-brand-background">
      <aside className="w-64 bg-brand-primary text-white flex flex-col">
        <div className="p-6">
          <Link href="/painel" className="text-2xl font-semibold text-white hover:opacity-80 transition-opacity">
            ClinicalAPP
          </Link>
        </div>
        
        <SidebarNav /> 
        
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button className="text-gray-600 md:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-brand-primary ml-2 md:ml-0">
              Painel Administrativo
            </h1>
          </div>
          <div className="flex items-center space-x-4">
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