// app/settings/clinic/_components/DeleteUnitButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { deleteClinicUnit } from '../_actions/clinic-actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type DeleteUnitButtonProps = {
  unitId: string;
};

export function DeleteUnitButton({ unitId }: DeleteUnitButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      const result = await deleteClinicUnit(unitId);

      if (result.success) {
        toast.success(result.message);
        router.push('/settings/clinic');
        router.refresh(); 
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <button
      type="button" // <-- ESTA É A CORREÇÃO CRUCIAL
      onClick={handleDelete}
      className="p-2 text-red-600 rounded-md hover:bg-red-100 hover:text-red-800 transition-colors"
      aria-label="Excluir unidade"
    >
      <Trash2 size={16} />
    </button>
  );
}