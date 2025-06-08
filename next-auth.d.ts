// next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  /**
  * Estende a interface User padrão para incluir a propriedade 'role'.
  */
  interface User {
    role?: string | null
  }

  /**
  * Estende a interface Session padrão para incluir o nosso User customizado.
  */
  interface Session {
    user: User
  }
}