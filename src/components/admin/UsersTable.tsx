// src/components/admin/UsersTable.tsx

'use client';

import Link from 'next/link'; // 1. Adicionamos a importação do Link
import type { UserForTable } from '@/app/(dashboard)/settings/users/page';

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
            <th className="py-3 px-4 text-left text-sm font-semibold text-brand-accent uppercase tracking-wider">Ações</th>
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
              {/* 2. O botão foi trocado por um Link funcional */}
              <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                <Link 
                  href={`/settings/users/${user.id}/edit`}
                  className="text-brand-accent hover:text-brand-primary hover:underline"
                >
                  Editar
                </Link>
                {/* Aqui futuramente entrará o botão de excluir usuário */}
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