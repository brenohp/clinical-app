// app/(dashboard)/settings/users/new/page.tsx
'use client'; 

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { createUser } from '../actions'; // Importa a nossa nova Server Action

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // A função handleSubmit agora chama a Server Action
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Criando usuário...');

    const formData = new FormData(event.currentTarget);
    const result = await createUser(formData); // Usa a Server Action

    if (result.success) {
      toast.success(result.message, { id: toastId });
      router.push('/settings/users');
      router.refresh();
    } else {
      toast.error(result.message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Criar Novo Usuário"
        description="Preencha os dados para cadastrar um novo profissional."
        backHref="/settings/users"
      />

      {/* AJUSTE: O formulário agora está dentro de uma div com largura máxima */}
      <div className="mt-6 bg-white p-6 md:p-8 rounded-lg shadow-md max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name" // Adicionado o atributo name
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email" // Adicionado o atributo name
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-primary">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password" // Adicionado o atributo name
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-brand-primary">
              Função
            </label>
            <select
              id="role"
              name="role" // Adicionado o atributo name
              defaultValue="USER" // Valor padrão
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="USER">Usuário (Profissional)</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-brand-accent text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}