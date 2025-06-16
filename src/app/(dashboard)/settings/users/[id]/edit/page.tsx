// app/(dashboard)/settings/users/[id]/edit/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { EditUserForm } from './_components/EditUserForm'; // 1. Importa o nosso formulário

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // A busca dos dados do usuário continua aqui, no servidor
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Editar Usuário"
        description={`Atualizando perfil de ${user.name}`}
        backHref="/settings/users"
      />

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        {/* 2. O parágrafo temporário é substituído pelo formulário real */}
        <EditUserForm user={user} />
      </div>
    </div>
  );
}