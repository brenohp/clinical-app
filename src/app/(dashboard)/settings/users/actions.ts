// app/(dashboard)/settings/users/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUser(userId: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
  };

  if (!data.name || !data.email || !data.role) {
    return { success: false, message: 'Nome, email e função são obrigatórios.' };
  }

  try {
    // Verifica se o novo email já está em uso por OUTRO usuário
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