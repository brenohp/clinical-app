// app/(dashboard)/settings/users/actions.ts
'use server';

import { getServerSession } from 'next-auth/next'; // <-- IMPORTAÇÃO ADICIONADA
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // <-- IMPORTAÇÃO ADICIONADA
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


export async function updateUser(userId: string, formData: FormData) {
  // ... código da sua função de update que já fizemos ...
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
  };

  if (!data.name || !data.email || !data.role) {
    return { success: false, message: 'Nome, email e função são obrigatórios.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== userId) {
      return { success: false, message: 'Este email já está em uso por outro usuário.' };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });

    revalidatePath('/settings/users');
    revalidatePath(`/settings/users/${userId}/edit`);

    return { success: true, message: 'Usuário atualizado com sucesso!' };

  } catch (error: unknown) {
    console.error('Erro ao atualizar usuário:', error);
    return { success: false, message: 'Não foi possível atualizar o usuário.' };
  }
}

export async function deleteUser(userId: string) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id === userId) {
    return { success: false, message: 'Você não pode excluir sua própria conta.' };
  }

  try {
    const appointmentCount = await prisma.appointment.count({
        where: { doctorId: userId },
    });

    if (appointmentCount > 0) {
        return { 
            success: false, 
            message: `Este profissional tem ${appointmentCount} agendamento(s) vinculado(s) e não pode ser excluído.`
        };
    }
    
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath('/settings/users');
    return { success: true, message: 'Usuário excluído com sucesso.' };

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return { success: false, message: 'Ocorreu um erro inesperado ao tentar excluir o usuário.' };
  }
}