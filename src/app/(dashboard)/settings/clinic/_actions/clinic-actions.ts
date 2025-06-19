// app/(dashboard)/settings/clinic/_actions/clinic-actions.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation'; // <-- LINHA REMOVIDA

// ... resto do arquivo sem alterações ...
interface SessionUser {
    clinicId?: string | null;
}

export async function createClinicUnit(formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    if (!user?.clinicId) {
      return { success: false, message: 'Não autorizado.' };
    }
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zipCode') as string;
    const phone = formData.get('phone') as string;
    await prisma.clinicUnit.create({
      data: { name, address, city, state, zipCode, phone: phone || null, clinicId: user.clinicId },
    });
    revalidatePath('/settings/clinic');
    return { success: true, message: 'Unidade criada com sucesso!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Falha ao criar a unidade.' };
  }
}

export async function updateClinicUnit(unitId: string, formData: FormData): Promise<{ success: boolean; message: string; }> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    if (!user?.clinicId) {
      return { success: false, message: 'Não autorizado.' };
    }
    const unit = await prisma.clinicUnit.findUnique({ where: { id: unitId } });
    if (!unit || unit.clinicId !== user.clinicId) {
      return { success: false, message: 'Não autorizado a editar esta unidade.' };
    }
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const zipCode = formData.get('zipCode') as string;
    const phone = formData.get('phone') as string;
    await prisma.clinicUnit.update({
      where: { id: unitId },
      data: { name, address, city, state, zipCode, phone: phone || null },
    });
    revalidatePath('/settings/clinic');
    return { success: true, message: 'Unidade atualizada com sucesso!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Falha ao atualizar a unidade.' };
  }
}

export async function deleteClinicUnit(unitId: string): Promise<{ success: boolean; message: string; }> {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    if (!user?.clinicId) {
      return { success: false, message: 'Não autorizado.' };
    }
    const unit = await prisma.clinicUnit.findUnique({
      where: { id: unitId },
    });
    if (!unit || unit.clinicId !== user.clinicId) {
      return { success: false, message: 'Não autorizado a excluir esta unidade.' };
    }
    await prisma.clinicUnit.delete({
      where: { id: unitId },
    });
    revalidatePath('/settings/clinic');
    return { success: true, message: 'Unidade excluída com sucesso!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Ocorreu um erro no servidor.' };
  }
}