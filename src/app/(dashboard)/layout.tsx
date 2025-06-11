// app/(dashboard)/layout.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { SidebarNav } from './_components/SidebarNav';
import { usePathname } from 'next/navigation';
import { UserProfile } from './_components/UserProfile'; // 1. Importamos o novo componente

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-brand-background">
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside 
        className={`bg-brand-primary text-white flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div 
          className={`flex items-center p-4 ${
            isSidebarOpen ? 'justify-between' : 'justify-center'
          }`}
        >
          <Link href="/painel" className={`text-2xl font-semibold text-white transition-opacity duration-200 ${!isSidebarOpen && 'hidden'}`}>
            ClinicalAPP
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-300 hover:text-white hidden md:block"
          >
            {isSidebarOpen ? <PanelLeftClose size={24} /> : <PanelRightClose size={24} />}
          </button>
        </div>

        <div className="flex-1 mt-4">
          <SidebarNav isSidebarOpen={isSidebarOpen} />
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-brand-primary ml-2 md:ml-0">
              Painel Administrativo
            </h1>
          </div>
          
          {/* 2. A div do avatar foi substituída pelo nosso novo componente */}
          <UserProfile />

        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}