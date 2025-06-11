// app/(dashboard)/layout.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { SidebarNav } from './_components/SidebarNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-brand-background">
      <aside 
        className={`bg-brand-primary text-white flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64 p-6' : 'w-20 p-4'
        }`}
      >
        {/* CORREÇÃO APLICADA AQUI */}
        <div 
          className={`flex items-center ${
            isSidebarOpen ? 'justify-between' : 'justify-center'
          }`}
        >
          {/* Trocamos 'opacity-0' por 'hidden' para melhor comportamento no layout */}
          <Link href="/painel" className={`text-2xl font-semibold text-white transition-opacity duration-200 ${!isSidebarOpen && 'hidden'}`}>
            ClinicalAPP
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-300 hover:text-white"
          >
            {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelRightClose size={24} />}
          </button>
        </div>

        <div className="flex-1 mt-8">
          <SidebarNav isSidebarOpen={isSidebarOpen} />
        </div>
        
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