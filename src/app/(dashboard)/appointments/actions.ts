// app/(dashboard)/appointments/actions.ts
'use server';

import prisma from '@/lib/prisma'; // Reutilizando nosso cliente Prisma
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createAppointment(formData: FormData) {
  // 1. Extrair os dados do formulário
  const patientId = formData.get('patientId') as string;
  const doctorId = formData.get('doctorId') as string;
  const date = formData.get('date') as string; // Vem como "AAAA-MM-DD"
  const time = formData.get('time') as string; // Vem como "HH:MM"
  const notes = formData.get('notes') as string;

  // Validação simples (em um projeto real, usaríamos Zod aqui)
  if (!patientId || !doctorId || !date || !time) {
    throw new Error('Paciente, médico, data e hora são obrigatórios.');
  }

  // 2. Combinar data e hora em um único objeto Date do JavaScript
    const appointmentDate = new Date(`${date}T${time}:00.000Z`);
  // 3. Salvar no banco de dados usando Prisma
  try {
    await prisma.appointment.create({
      data: {
        patientId: patientId,
        doctorId: doctorId,
        appointmentDate: appointmentDate,
        notes: notes,
        status: 'AGENDADA', // Status padrão para novos agendamentos
      },
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw new Error('Não foi possível criar o agendamento.');
  }

  // 4. Revalidar o cache e redirecionar
  revalidatePath('/appointments'); // Avisa o Next.js para atualizar a lista de agendamentos
  redirect('/appointments');      // Envia o usuário de volta para a lista
}

export async function updateAppointment(appointmentId: string, formData: FormData) {
  // Validação de segurança (será implementada com a sessão)
  // if (!session?.user) { throw new Error('Acesso negado'); }

  // 1. Extrair os dados do formulário
  const patientId = formData.get('patientId') as string;
  const doctorId = formData.get('doctorId') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const status = formData.get('status') as string; // Novo campo para o status
  const notes = formData.get('notes') as string;

  if (!patientId || !doctorId || !date || !time || !status) {
    throw new Error('Todos os campos, exceto anotações, são obrigatórios.');
  }
  
  // 2. Combina data e hora em um objeto Date UTC (mesma lógica da criação)
  const appointmentDate = new Date(`${date}T${time}:00.000Z`);

  // 3. Atualiza o registro no banco de dados
  try {
    await prisma.appointment.update({
      where: {
        id: appointmentId, // A cláusula 'where' diz ao Prisma qual registro atualizar
      },
      data: {
        patientId: patientId,
        doctorId: doctorId,
        appointmentDate: appointmentDate,
        status: status,
        notes: notes,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    throw new Error('Não foi possível atualizar o agendamento.');
  }

  // 4. Revalida o cache e redireciona
  revalidatePath('/appointments');
  revalidatePath(`/appointments/${appointmentId}/edit`);
  redirect('/appointments');
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