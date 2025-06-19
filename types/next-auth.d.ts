// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      clinicId: string | null; // <-- ALTERADO para ser nulo
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    clinicId: string | null; // <-- ALTERADO para ser nulo
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    clinicId: string | null; // <-- ALTERADO para ser nulo
  }
}