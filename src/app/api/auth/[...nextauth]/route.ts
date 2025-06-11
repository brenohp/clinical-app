// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth"; // Importa o tipo NextAuthOptions
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Exportamos as opções para que possam ser usadas em outros lugares (como no middleware)
export const authOptions: NextAuthOptions = {
  // 1. Estratégia de Sessão
  session: {
    strategy: "jwt",
  },

  // 2. Provedores de Autenticação (sem mudanças aqui)
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (isPasswordCorrect) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],

  // 3. PÁGINAS CUSTOMIZADAS (A CORREÇÃO PRINCIPAL)
  pages: {
    signIn: "/login", // Informa ao NextAuth que a nossa página de login está em /login
    error: "/login", // Em caso de erro (ex: falha na autenticação), redireciona para o login
  },

  // 4. CALLBACKS (ESSENCIAL PARA PROPAGAR DADOS PARA O TOKEN)
  callbacks: {
    // Chamado na criação/atualização do JWT
    jwt: async ({ token, user }) => {
      // Se o objeto 'user' existir (no login inicial), adicionamos os dados ao token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Chamado para criar/atualizar a sessão a partir do token
    session: async ({ session, token }) => {
      // Adicionamos os dados do token ao objeto da sessão, para que fique acessível no cliente
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  // 5. Chave Secreta
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };