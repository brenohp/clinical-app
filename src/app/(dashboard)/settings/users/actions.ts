// app/(dashboard)/settings/users/actions.ts
'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs'; // Importe o bcrypt

// --- NOVA FUNÇÃO ADICIONADA ---
export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!name || !email || !password || !role) {
    return { success: false, message: 'Todos os campos são obrigatórios.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Este email já está em uso.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        clinicId: session?.user?.clinicId, // Associa à clínica do admin logado
      },
    });

    revalidatePath('/settings/users');
    return { success: true, message: 'Usuário criado com sucesso!' };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: 'Não foi possível criar o usuário.' };
  }
}


// ... (suas funções updateUser e deleteUser continuam aqui sem alterações)
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