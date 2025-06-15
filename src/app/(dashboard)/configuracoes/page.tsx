// app/(dashboard)/configuracoes/page.tsx

import { getServerSession } from 'next-auth/next';
import { PrismaClient, User } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
// 1. DESCOMENTE A LINHA ABAIXO
import { UsersTable } from '@/components/admin/UsersTable'; 

const prisma = new PrismaClient();

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    return users;
  } catch (error) {
    console.error("Falha ao buscar usuários: ", error);
    return [];
  }
}

export type UserForTable = Pick<User, 'id' | 'name' | 'email' | 'role' | 'createdAt'>;

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions);
  
  const users: UserForTable[] = session?.user.role === 'ADMIN' ? await getUsers() : [];

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Configurações
        </h1>
        <p className="text-brand-accent mt-1">
          Gerencie suas preferências e configurações do sistema.
        </p>
      </header>

      {session?.user.role === 'ADMIN' && (
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-brand-primary mb-4">
            Administração
          </h2>
          <div className="border-t border-gray-200 pt-4">
             <h3 className="text-lg font-medium text-brand-primary mb-2">
                Gestão de Usuários
             </h3>
             {/* 2. SUBSTITUA O PLACEHOLDER PELA CHAMADA REAL DO COMPONENTE */}
             <UsersTable users={users} />
          </div>
        </section>
      )}
    </div>
  );
}