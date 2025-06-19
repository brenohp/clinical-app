// app/(dashboard)/settings/services/new/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { createServiceType } from '../_actions/service-actions';

export default function NewServicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Cadastrando serviço...');

    const formData = new FormData(event.currentTarget);
    const result = await createServiceType(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      router.push('/settings/services');
      router.refresh();
    } else {
      toast.error(result.message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Adicionar Novo Serviço"
        description="Preencha os dados do tipo de consulta ou procedimento."
        backHref="/settings/services"
      />

      <div className="mt-6 bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-primary">Nome do Serviço</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Ex: Primeira Consulta, Retorno, Aplicação de Botox"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-primary">Descrição (Opcional)</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-brand-primary">Duração (em minutos)</label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                required
                placeholder="Ex: 30"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-brand-primary">Preço Base (R$) (Opcional)</label>
              <input
                type="text"
                id="price"
                name="price"
                placeholder="Ex: 250,00"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={true}
                className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
                disabled={isLoading}
            />
            <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-brand-primary">
                Serviço Ativo
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-brand-accent text-white py-2.5 px-6 rounded-md shadow-sm font-medium hover:brightness-95 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}