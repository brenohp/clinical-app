// app/(dashboard)/settings/services/[id]/edit/_components/EditServiceForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { updateServiceType } from '../../../_actions/service-actions';
// NOVO: Importando o botão de exclusão
import { DeleteServiceButton } from '../../../_components/DeleteServiceButton'; 

type PlainService = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number | null;
  isActive: boolean;
};

type EditServiceFormProps = {
  service: PlainService;
};

export function EditServiceForm({ service }: EditServiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Salvando alterações...');

    const formData = new FormData(event.currentTarget);
    const result = await updateServiceType(service.id, formData);

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
    <div className="mt-6 bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... (os campos do formulário continuam os mesmos) ... */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-primary">Nome do Serviço</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={service.name}
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
            defaultValue={service.description || ''}
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
              defaultValue={service.durationMinutes}
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
              defaultValue={service.price ? String(service.price).replace('.', ',') : ''}
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
              defaultChecked={service.isActive}
              className="h-4 w-4 rounded border-gray-300 text-brand-accent focus:ring-brand-accent"
              disabled={isLoading}
          />
          <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-brand-primary">
              Serviço Ativo
          </label>
        </div>

        {/* AJUSTE: Rodapé do formulário agora tem os dois botões */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <DeleteServiceButton serviceId={service.id} />
          </div>
          <button
            type="submit"
            className="bg-brand-accent text-white py-2.5 px-6 rounded-md shadow-sm font-medium hover:brightness-95 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}