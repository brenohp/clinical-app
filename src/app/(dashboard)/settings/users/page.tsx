// app/(dashboard)/configuracoes/usuarios/page.tsx

import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { PrismaClient, User } from '@prisma/client';
import { PlusCircle } from 'lucide-react';

import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import { UsersTable } from '@/components/admin/UsersTable'; 
import { PageHeader } from '@/components/layout/PageHeader'; 

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

export default async function GestaoDeUsuariosPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/panel'); 
  }

  const users = await getUsers();

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Gestão de Usuários"
        description="Adicione, edite e gerencie os profissionais do sistema."
        backHref="/settings"
      >
        <Link 
            href="/settings/users/new" 
            className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200 flex-shrink-0"
        >
            <PlusCircle size={20} />
            <span className="font-medium whitespace-nowrap">Adicionar Usuário</span>
        </Link>
      </PageHeader>

      <main className="bg-white p-6 rounded-lg shadow-md">
        <UsersTable users={users} />
      </main>
    </div>
  );
}