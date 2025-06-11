// src/middleware.ts
import { withAuth } from "next-auth/middleware"

// O withAuth já possui a lógica de redirecionar o usuário se ele não estiver logado.
// Não precisamos de configuração extra aqui por enquanto.
export default withAuth;

// Aqui definimos EXATAMENTE quais rotas devem exigir autenticação.
export const config = {
  matcher: [
    // Protege a página principal do dashboard
    '/painel',

    // Protege a página de pacientes e tudo que estiver dentro dela
    // ex: /patients, /patients/new, /patients/ID/edit
    '/patients/:path*', 
  ],
}