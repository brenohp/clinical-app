// app/(dashboard)/appointments/_components/DeleteAppointmentButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteAppointment } from '../actions';

type DeleteButtonProps = {
  appointmentId: string;
  // AJUSTE: Adicionamos um callback opcional
  onSuccess?: () => void;
};

export function DeleteAppointmentButton({ appointmentId, onSuccess }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      const result = await deleteAppointment(appointmentId);

      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Apenas atualiza os dados do servidor
        // AJUSTE: Se a função onSuccess existir, chame-a
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
      aria-label="Excluir agendamento"
    >
      <Trash2 size={16} />
      Excluir Agendamento
    </button>
  );
}