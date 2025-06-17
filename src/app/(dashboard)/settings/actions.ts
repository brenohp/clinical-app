// app/(dashboard)/settings/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

export async function updateProfile(formData: FormData) {
  // 1. Pega a sessão para identificar o usuário logado
  const session = await getServerSession(authOptions);

  // 2. Guarda de segurança: se não houver sessão, não faz nada
  if (!session?.user?.id) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  // 3. Extrai os dados do formulário
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const passwordConfirmation = formData.get('passwordConfirmation') as string;

  if (!name) {
    return { success: false, message: 'O nome é obrigatório.' };
  }

  // Objeto para os dados que serão atualizados
  const dataToUpdate: { name: string; password?: string } = {
    name: name,
  };

  // 4. Lógica para atualização de senha (se fornecida)
  if (password) {
    if (password.length < 6) {
      return { success: false, message: 'A nova senha deve ter no mínimo 6 caracteres.' };
    }
    if (password !== passwordConfirmation) {
      return { success: false, message: 'As senhas não coincidem.' };
    }
    // Se a validação passar, criptografa a nova senha
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  // 5. Atualiza o usuário no banco de dados
  try {
    await prisma.user.update({
      where: {
        id: session.user.id, // Atualiza apenas o usuário logado
      },
      data: dataToUpdate,
    });

    revalidatePath('/settings');
    return { success: true, message: 'Perfil atualizado com sucesso!' };

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, message: 'Não foi possível atualizar o perfil.' };
  }
}