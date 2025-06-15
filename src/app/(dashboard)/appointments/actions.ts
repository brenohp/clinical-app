// app/(dashboard)/appointments/actions.ts
'use server';

import prisma from '@/lib/prisma'; // Reutilizando nosso cliente Prisma
import { revalidatePath } from 'next/cache';

export async function createAppointment(formData: FormData) {
  // 1. Extrair os dados do formulário
  const patientId = formData.get('patientId') as string;
  const doctorId = formData.get('doctorId') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const notes = formData.get('notes') as string;

  // Validação simples
  if (!patientId || !doctorId || !date || !time) {
    return { success: false, message: 'Paciente, médico, data e hora são obrigatórios.' };
  }

  const appointmentDate = new Date(`${date}T${time}:00.000Z`);
  
  try {
    await prisma.appointment.create({
      data: {
        patientId: patientId,
        doctorId: doctorId,
        appointmentDate: appointmentDate,
        notes: notes,
        status: 'AGENDADA',
      },
    });

    revalidatePath('/appointments');
    // Em vez de redirecionar, retorna uma mensagem de sucesso
    return { success: true, message: 'Agendamento criado com sucesso!' };

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    // Em vez de lançar um erro, retorna uma mensagem de falha
    return { success: false, message: 'Não foi possível criar o agendamento.' };
  }
}


export async function updateAppointment(appointmentId: string, formData: FormData) {
  // 1. Extrair os dados do formulário
  const patientId = formData.get('patientId') as string;
  const doctorId = formData.get('doctorId') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const status = formData.get('status') as string;
  const notes = formData.get('notes') as string;

  if (!patientId || !doctorId || !date || !time || !status) {
    return { success: false, message: 'Todos os campos, exceto anotações, são obrigatórios.' };
  }
  
  const appointmentDate = new Date(`${date}T${time}:00.000Z`);

  try {
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        patientId,
        doctorId,
        appointmentDate,
        status,
        notes,
      },
    });

    revalidatePath('/appointments');
    revalidatePath(`/appointments/${appointmentId}/edit`);

    // Em vez de redirecionar, retorna uma mensagem de sucesso
    return { success: true, message: 'Agendamento atualizado com sucesso!' };

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    // Em vez de lançar um erro, retorna uma mensagem de falha
    return { success: false, message: 'Não foi possível atualizar o agendamento.' };
  }
}

export async function deleteAppointment(appointmentId: string) {
  // Validação de segurança (será implementada com a sessão)
  // if (!session?.user) { throw new Error('Acesso negado'); }

  if (!appointmentId) {
    throw new Error('ID do agendamento não fornecido.');
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    throw new Error('Não foi possível excluir o agendamento.');
  }

  // Limpa o cache da página de listagem para que o agendamento removido desapareça
  revalidatePath('/appointments');
}