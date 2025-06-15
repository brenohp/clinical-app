// app/(dashboard)/_components/SidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, Calendar } from 'lucide-react';

const navLinks = [
  { href: '/painel', label: 'Painel', icon: LayoutDashboard },
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/appointments', label: 'Agenda', icon: Calendar },
];

const footerLinks = [
  { href: '/configuracoes', label: 'Configurações', icon: Settings }
];

export function SidebarNav({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const pathname = usePathname();

  // 1. Substituímos o Fragment <> por uma div com classes de layout
  return (
    // 2. Adicionamos as classes essenciais: flex, flex-col, h-full
    <div className="flex flex-col h-full"> 
      {/* Links Principais */}
      {/* A classe flex-1 aqui é importante, pois diz para esta nav ocupar todo o espaço vertical disponível */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 py-2.5 rounded-lg transition duration-200 ${
                isSidebarOpen ? 'px-4' : 'justify-center px-2'
              } ${
                isActive
                  ? 'bg-brand-accent text-white'
                  : 'text-white hover:bg-brand-accent/50'
              }`}
            >
              <link.icon size={20} />
              <span className={!isSidebarOpen ? 'hidden' : ''}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Seção inferior com mt-auto agora funcionará corretamente */}
      <div className="mt-auto space-y-2 mb-4">  
        {footerLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 py-2.5 rounded-lg transition duration-200 ${
                isSidebarOpen ? 'px-4' : 'justify-center px-2'
              } ${
                isActive
                  ? 'bg-brand-accent text-white'
                  : 'text-white hover:bg-brand-accent/50'
              }`}
            >
              <link.icon size={20} />
              <span className={!isSidebarOpen ? 'hidden' : ''}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div> // 1. Fechamos a nova div aqui
  );
}