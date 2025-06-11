// app/(dashboard)/patients/actions.ts
'use server'; // Essencial para definir que todas as funções aqui são Server Actions

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

// Define um tipo para os dados do paciente para garantir a tipagem
type PatientData = {
  name: string;
  cpf: string;
  birthDate: string; // Vem como string do formulário
  phone: string;
  email?: string | null; // Email é opcional
};

export async function createPatient(formData: FormData) {
  const data: PatientData = {
    name: formData.get('name') as string,
    cpf: formData.get('cpf') as string,
    birthDate: formData.get('birthDate') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  try {
    await prisma.patient.create({
      data: {
        ...data,
        // O campo 'birthDate' no DB é DateTime, então convertemos a string
        birthDate: new Date(data.birthDate), 
      },
    });

    console.log('Paciente cadastrado com sucesso!');

  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    // Em um app real, você retornaria uma mensagem de erro para a UI
    throw new Error('Não foi possível cadastrar o paciente.');
  }

  // Limpa o cache da página de listagem de pacientes (que criaremos no futuro)
  revalidatePath('/patients'); 

  // Redireciona o usuário para a página de listagem após o sucesso
  redirect('/patients');
}

export async function updatePatient(patientId: string, formData: FormData) {
  // AINDA NÃO TEMOS O CÓDIGO DE AUTENTICAÇÃO, MAS A LÓGICA SERIA AQUI:
  // const session = await auth();
  // if (!session?.user || session.user.role !== 'ADMIN') {
  //   throw new Error('Acesso não autorizado.');
  // }

  const data = {
    name: formData.get('name') as string,
    cpf: formData.get('cpf') as string,
    birthDate: new Date(formData.get('birthDate') as string),
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  try {
    await prisma.patient.update({
      where: {
        id: patientId, // Usa o ID para saber qual paciente atualizar
      },
      data: data, // Usa os novos dados do formulário
    });

    console.log('Paciente atualizado com sucesso!');

  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    throw new Error('Não foi possível atualizar o paciente.');
  }

  // Limpa o cache das páginas de pacientes para garantir que a lista seja atualizada
  revalidatePath('/patients');
  revalidatePath(`/patients/${patientId}/edit`);

  // Redireciona o usuário de volta para a lista
  redirect('/patients');
}

export async function deletePatient(patientId: string) {
  // AINDA NÃO TEMOS O CÓDIGO DE AUTENTICAÇÃO, MAS A LÓGICA SERIA AQUI:
  // const session = await auth();
  // if (!session?.user || session.user.role !== 'ADMIN') {
  //   throw new Error('Acesso não autorizado.');
  // }
  
  try {
    await prisma.patient.delete({
      where: {
        id: patientId,
      },
    });
    console.log('Paciente excluído com sucesso!');

  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    throw new Error('Não foi possível excluir o paciente.');
  }

  // Limpa o cache da página de listagem para que o paciente removido desapareça
  revalidatePath('/patients');
}