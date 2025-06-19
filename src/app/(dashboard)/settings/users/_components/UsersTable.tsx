// src/app/(dashboard)/settings/users/_components/UsersTable.tsx
'use client';

import Link from 'next/link';
import type { UserForTable } from '@/app/(dashboard)/settings/users/page';
// import { DeleteUserButton } from './DeleteUserButton'; // 1. Botão de exclusão removido daqui
import { Edit } from 'lucide-react'; // 2. Ícone de edição importado

type UsersTableProps = {
  users: UserForTable[];
};

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-brand-primary">
        <thead className="bg-brand-background">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-brand-accent uppercase tracking-wider">Nome</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-brand-accent uppercase tracking-wider">Email</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-brand-accent uppercase tracking-wider">Função</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-brand-accent uppercase tracking-wider">Data de Criação</th>
            {/* 3. Cabeçalho de Ações alinhado à direita */}
            <th className="py-3 px-4 text-right text-sm font-semibold text-brand-accent uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-brand-background/50 transition-colors duration-150">
              <td className="py-4 px-4 whitespace-nowrap">{user.name}</td>
              <td className="py-4 px-4 whitespace-nowrap">{user.email}</td>
              <td className="py-4 px-4 whitespace-nowrap">
                <span className={`px-3 py-1 text-xs font-bold leading-5 rounded-full ${user.role === 'ADMIN' ? 'bg-brand-accent text-white' : 'bg-brand-accent-light text-brand-primary'}`}>
                  {user.role}
                </span>
              </td>
              <td className="py-4 px-4 whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </td>
              {/* 4. Célula de Ações com o novo link de Edição e alinhamento corrigido */}
              <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                <div className="flex justify-end">
                    <Link 
                        href={`/settings/users/${user.id}/edit`}
                        className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-primary p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <Edit size={16} />
                        <span>Editar</span>
                    </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  );
}