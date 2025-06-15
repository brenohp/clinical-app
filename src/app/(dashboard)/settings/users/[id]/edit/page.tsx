// app/(dashboard)/settings/users/[id]/edit/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
// Vamos criar o formulário no próximo passo
// import { EditUserForm } from './_components/EditUserForm';

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const { id } = params;

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
        backHref="/settings/users" // <-- ROTA ATUALIZADA AQUI
      />

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <p>O formulário de edição aparecerá aqui...</p>
        {/* Futuramente, aqui renderizaremos o nosso formulário de cliente:
        <EditUserForm user={user} /> 
        */}
      </div>
    </div>
  );
}