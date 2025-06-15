// app/(dashboard)/patients/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type PatientData = {
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email?: string | null;
};

export async function createPatient(formData: FormData) {
  const data: PatientData = {
    name: formData.get('name') as string,
    cpf: formData.get('cpf') as string,
    birthDate: formData.get('birthDate') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  if (!data.name || !data.cpf || !data.birthDate || !data.phone) {
    return { success: false, message: 'Todos os campos, exceto email, são obrigatórios.'};
  }

  try {
    await prisma.patient.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate), 
      },
    });

    revalidatePath('/patients'); 
    return { success: true, message: 'Paciente cadastrado com sucesso!' };

  } catch (error: unknown) {
    console.error('Erro ao cadastrar paciente:', error);
    const prismaError = error as { code?: string, meta?: { target?: string[] }};
    if (prismaError?.code === 'P2002' && prismaError?.meta?.target?.includes('cpf')) {
        return { success: false, message: 'Este CPF já está cadastrado no sistema.' };
    }
    return { success: false, message: 'Não foi possível cadastrar o paciente.' };
  }
}

// ========================================================================
// A LÓGICA DE ATUALIZAÇÃO FOI TOTALMENTE ALTERADA AQUI
// ========================================================================
export async function updatePatient(patientId: string, formData: FormData) {
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
        id: patientId,
      },
      data: data,
    });

    revalidatePath('/patients');
    revalidatePath(`/patients/${patientId}/edit`);

    return { success: true, message: 'Paciente atualizado com sucesso!' };

  } catch (error: unknown) {
    console.error('Erro ao atualizar paciente:', error);
    // Tratamento para erro de CPF duplicado na atualização
    const prismaError = error as { code?: string, meta?: { target?: string[] }};
    if (prismaError?.code === 'P2002' && prismaError?.meta?.target?.includes('cpf')) {
        return { success: false, message: 'Este CPF já pertence a outro paciente.' };
    }
    return { success: false, message: 'Não foi possível atualizar o paciente.' };
  }
}


export async function deletePatient(patientId: string) {
  if (!patientId) {
    return { success: false, message: 'ID do paciente não fornecido.' };
  }

  try {
    const appointmentCount = await prisma.appointment.count({
      where: {
        patientId: patientId,
      },
    });

    if (appointmentCount > 0) {
      return { 
        success: false, 
        message: `Não é possível excluir. Este paciente possui ${appointmentCount} agendamento(s) vinculado(s). Por favor, remova os agendamentos primeiro.` 
      };
    }

    await prisma.patient.delete({
      where: {
        id: patientId,
      },
    });

    console.log('Paciente excluído com sucesso!');
    revalidatePath('/patients');
    return { success: true, message: 'Paciente excluído com sucesso.' };

  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    return { success: false, message: 'Ocorreu um erro inesperado ao tentar excluir o paciente.' };
  }
}