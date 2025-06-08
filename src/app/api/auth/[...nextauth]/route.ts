// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Nosso cliente Prisma singleton
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // 1. Estratégia de Sessão
  session: {
    strategy: "jwt",
  },

  // 2. Provedores de Autenticação
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Se as credenciais não forem fornecidas, retorna nulo
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Busca o usuário no banco de dados pelo email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Se o usuário não for encontrado, retorna nulo
        if (!user) {
          return null;
        }

        // Compara a senha fornecida com a senha "hasheada" no banco
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Se a senha estiver correta, retorna o objeto do usuário
        if (isPasswordCorrect) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        // Se a senha estiver incorreta, retorna nulo
        return null;
      },
    }),
  ],

  // 3. Chave Secreta
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };