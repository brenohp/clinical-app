// src/app/api/users/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
// Ajuste o caminho se suas authOptions estiverem em outro lugar
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

const prisma = new PrismaClient();

export async function GET() { // <-- MUDANÇA FINAL AQUI
  // 1. Proteger a rota: Apenas admins podem listar usuários
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ message: 'Não autorizado' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Buscar usuários no banco de dados
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Erro ao buscar usuários' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}