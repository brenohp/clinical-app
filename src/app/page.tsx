// src/app/page.tsx
'use client'

import Link from 'next/link';
import { useSession } from 'next-auth/react';

// DEFINIÇÃO DO COMPONENTE QUE ESTAVA FALTANDO
const ActionButton = () => {
  const { status } = useSession();

  // Se o usuário já estiver logado, o botão leva para o Dashboard
  if (status === 'authenticated') {
    return (
      <Link href="/painel" className="rounded-md bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
        Acessar Painel
      </Link>
    );
  }

  // Se não, o botão padrão leva para a página de Login
  return (
    <Link href="/login" className="rounded-md bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
      Acessar o Sistema
    </Link>
  );
};


// O restante da sua página, agora com o layout corrigido
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      {/* Cabeçalho */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-brand-primary">Clinical App</span>
            </a>
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <ActionButton />
          </div>
        </nav>
      </header>

      {/* Seção Principal (Hero) */}
      <main className="relative isolate flex-grow px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-primary sm:text-6xl">
              Gestão Simplificada para seu Consultório
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Otimize seus agendamentos, gerencie seus pacientes e tenha o controle total da sua clínica com uma ferramenta moderna e intuitiva.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ActionButton />
              <a href="#" className="text-sm font-semibold leading-6 text-brand-primary">
                Saiba mais <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="text-center p-4 border-t">
        <p className="text-center text-gray-500 text-xs">
          &copy;{new Date().getFullYear()} ClinicalApp. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}