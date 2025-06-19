// app/(dashboard)/appointments/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createAppointment(formData: FormData) {
  // ... (código existente sem alterações)
  const patientId = formData.get('patientId') as string;
  const doctorId = formData.get('doctorId') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const notes = formData.get('notes') as string;

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
    return { success: true, message: 'Agendamento criado com sucesso!' };

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return { success: false, message: 'Não foi possível criar o agendamento.' };
  }
}


export async function updateAppointment(appointmentId: string, formData: FormData) {
  // ... (código existente sem alterações)
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

    return { success: true, message: 'Agendamento atualizado com sucesso!' };

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return { success: false, message: 'Não foi possível atualizar o agendamento.' };
  }
}

// AJUSTE: A função de exclusão agora retorna um objeto de status para o toast
export async function deleteAppointment(appointmentId: string): Promise<{ success: boolean; message: string; }> {
  if (!appointmentId) {
    return { success: false, message: 'ID do agendamento não fornecido.' };
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    revalidatePath('/appointments');
    return { success: true, message: 'Agendamento excluído com sucesso.' };

  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    return { success: false, message: 'Não foi possível excluir o agendamento.' };
  }
}