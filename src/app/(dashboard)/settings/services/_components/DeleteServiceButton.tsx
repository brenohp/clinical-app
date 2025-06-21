// app/(dashboard)/settings/services/_components/DeleteServiceButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteServiceType } from '../_actions/service-actions';

type DeleteButtonProps = {
  serviceId: string;
};

export function DeleteServiceButton({ serviceId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      const result = await deleteServiceType(serviceId);

      if (result.success) {
        toast.success(result.message);
        router.push('/settings/services');
        router.refresh();
      } else {
        toast.error(result.message, { duration: 5000 });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
      aria-label="Excluir serviço"
    >
      <Trash2 size={16} />
      Excluir Serviço
    </button>
  );
}