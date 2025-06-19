// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Iniciando o processo de seed...`);

  // 1. Criar a Clínica primeiro
  const clinic = await prisma.clinic.create({
    data: {
      name: 'Clínica Padrão',
    },
  });
  console.log(`Clínica criada com o ID: ${clinic.id}`);

  // 2. Criar o Usuário Administrador e associá-lo à clínica
  const hashedPassword = await bcrypt.hash('#Breno2521', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
      clinicId: clinic.id, // Associando o usuário à clínica
    },
  });
  console.log(`Usuário Admin criado: ${adminUser.email}`);

  console.log(`Seed finalizado com sucesso.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });