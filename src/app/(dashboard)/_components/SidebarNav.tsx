// app/(dashboard)/_components/SidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

const navLinks = [
  { href: '/painel', label: 'Painel', icon: LayoutDashboard },
  { href: '/patients', label: 'Pacientes', icon: Users },
];

// Note: esta é uma EXPORTAÇÃO NOMEADA
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition duration-200 ${
                isActive
                  ? 'bg-brand-accent text-white'
                  : 'text-white hover:bg-brand-accent/50' // Corrigi para texto branco no inativo
              }`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6">
        <Link href="#" className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-brand-accent/50 transition duration-200">
          <Settings size={20} />
          <span>Configurações</span>
        </Link>
      </div>
    </>
  );
}