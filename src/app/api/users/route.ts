// src/app/api/users/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// FUNÇÃO GET (JÁ EXISTENTE) - Para listar usuários
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ message: 'Não autorizado' }), { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(users);
  } catch {
    return new NextResponse(JSON.stringify({ message: 'Erro ao buscar usuários' }), { status: 500 });
  }
}


// NOVA FUNÇÃO POST - Para criar um novo usuário
export async function POST(request: Request) {
  // 1. Segurança: Apenas admins podem criar usuários
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ message: 'Não autorizado' }), { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // 2. Validação: Verifica se os campos essenciais foram enviados
    if (!name || !email || !password) {
      return new NextResponse(JSON.stringify({ message: 'Nome, email e senha são obrigatórios' }), { status: 400 });
    }

    // 3. Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Este email já está em uso' }), { status: 409 }); // 409 Conflict
    }

    // 4. Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Cria o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // 'USER' ou 'ADMIN'
      },
      // Retorna o usuário criado sem a senha
      select: { id: true, name: true, email: true, role: true }
    });

    return NextResponse.json(newUser, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return new NextResponse(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
  }
}