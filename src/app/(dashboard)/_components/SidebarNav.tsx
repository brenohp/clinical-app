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

// O componente agora recebe 'isSidebarOpen' como propriedade
export function SidebarNav({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 py-2.5 rounded-lg transition duration-200 ${
                isSidebarOpen ? 'px-4' : 'justify-center px-2' // Padding dinâmico
              } ${
                isActive
                  ? 'bg-brand-accent text-white'
                  : 'text-white hover:bg-brand-accent/50'
              }`}
            >
              <link.icon size={20} />
              {/* O texto do link só aparece se a sidebar estiver aberta */}
              <span className={!isSidebarOpen ? 'hidden' : ''}>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Seção inferior */}
      <div className="mt-auto">
        <Link 
          href="#" 
          className={`flex items-center space-x-3 py-2.5 rounded-lg text-gray-300 hover:bg-brand-accent/50 transition duration-200 ${
            isSidebarOpen ? 'px-4' : 'justify-center px-2'
          }`}
        >
          <Settings size={20} />
          <span className={!isSidebarOpen ? 'hidden' : ''}>Configurações</span>
        </Link>
      </div>
    </>
  );
}