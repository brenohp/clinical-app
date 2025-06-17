// app/(dashboard)/_components/UserProfile.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';

export function UserProfile() {
  // Hook para pegar os dados da sessão do usuário
  const { data: session } = useSession();
  // Estado para controlar a visibilidade do menu dropdown
  const [isOpen, setIsOpen] = useState(false);
  // Ref para detectar cliques fora do menu
  const menuRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar o menu se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // Adiciona o listener quando o menu está aberto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Remove o listener quando o componente é desmontado ou o menu fecha
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!session?.user) {
    return null; // Não renderiza nada se não houver sessão
  }

  // Pega a primeira letra do nome do usuário para o avatar
  const userInitial = session.user.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão do Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
      >
        {userInitial}
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
          {/* Informações do Usuário */}
          <div className="px-4 py-2 border-b">
            <p className="font-semibold text-brand-primary">{session.user.name}</p>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>

          {/* Links de Navegação */}
          <div className="py-1">
            <Link
              href="/settings/profile" // Rota para uma futura página de perfil
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)} // Fecha o menu ao clicar
            >
              <User className="mr-3" size={16} /> Meu Perfil
            </Link>
            <Link
              href="/settings" // Rota para uma futura página de configurações
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3" size={16} /> Configurações
            </Link>
          </div>

          {/* Botão de Sair */}
          <div className="py-1 border-t">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3" size={16} /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}