// src/components/layout/PageHeader.tsx

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

// Definimos as propriedades que nosso componente pode receber
type PageHeaderProps = {
  title: string;
  description?: string; // Descrição é opcional
  backHref?: string;    // Link de "voltar" é opcional
  children?: ReactNode; // 'children' para botões de ação (ex: Adicionar)
};

export function PageHeader({ title, description, backHref, children }: PageHeaderProps) {
  return (
    <>
      {/* O link de "voltar" só aparece se a prop 'backHref' for fornecida */}
      {backHref && (
        <Link 
          href={backHref} 
          className="flex items-center gap-2 text-brand-accent hover:text-brand-primary mb-4 w-fit"
        >
          <ArrowLeft size={20} />
          Voltar
        </Link>
      )}

      <header className="flex justify-between items-center mb-6">
        {/* Título e Descrição */}
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            {title}
          </h1>
          {/* A descrição só aparece se for fornecida */}
          {description && (
            <p className="text-brand-accent mt-1">
              {description}
            </p>
          )}
        </div>
        
        {/* Espaço para os botões de ação (children) */}
        <div>
          {children}
        </div>
      </header>
    </>
  );
}