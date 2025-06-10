// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // withAuth "aumenta" sua requisição com o token do usuário.
  // Ele já lida com o redirecionamento se o usuário não estiver logado.
);

// Aplica o middleware do NextAuth a rotas específicas
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas, exceto as que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (ícone do site)
     *
     * E também exclui a página de login para evitar um loop de redirecionamento.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}