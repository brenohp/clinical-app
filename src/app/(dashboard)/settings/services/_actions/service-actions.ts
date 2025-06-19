// app/(dashboard)/settings/services/_actions/service-actions.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createServiceType(formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.clinicId) {
      return { success: false, message: 'Não autorizado.' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const durationMinutes = parseInt(formData.get('durationMinutes') as string);
    const priceStr = formData.get('price') as string;
    const isActive = formData.get('isActive') === 'on'; 

    if (!name || isNaN(durationMinutes)) {
      return { success: false, message: 'Nome e Duração são obrigatórios.' };
    }

    const price = priceStr ? parseFloat(priceStr.replace(',', '.')) : null;

    await prisma.serviceType.create({
      data: {
        name,
        description,
        durationMinutes,
        price,
        isActive,
        clinicId: session.user.clinicId,
      },
    });

    revalidatePath('/settings/services');
    return { success: true, message: 'Serviço criado com sucesso!' };

  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return { success: false, message: 'Falha ao criar o serviço.' };
  }
}


// --- NOVA FUNÇÃO ADICIONADA ABAIXO ---

export async function updateServiceType(serviceId: string, formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.clinicId) {
      return { success: false, message: 'Não autorizado.' };
    }

    // Validação de segurança: garante que o serviço pertence à clínica do usuário
    const service = await prisma.serviceType.findUnique({ where: { id: serviceId } });
    if (!service || service.clinicId !== session.user.clinicId) {
      return { success: false, message: 'Serviço não encontrado ou não autorizado.' };
    }

    // Extrai e converte os dados do formulário
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const durationMinutes = parseInt(formData.get('durationMinutes') as string);
    const priceStr = formData.get('price') as string;
    const isActive = formData.get('isActive') === 'on';

    if (!name || isNaN(durationMinutes)) {
      return { success: false, message: 'Nome e Duração são obrigatórios.' };
    }

    const price = priceStr ? parseFloat(priceStr.replace(',', '.')) : null;

    await prisma.serviceType.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        durationMinutes,
        price,
        isActive,
      },
    });

    revalidatePath('/settings/services');
    revalidatePath(`/settings/services/${serviceId}/edit`);
    return { success: true, message: 'Serviço atualizado com sucesso!' };

  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return { success: false, message: 'Falha ao atualizar o serviço.' };
  }
}