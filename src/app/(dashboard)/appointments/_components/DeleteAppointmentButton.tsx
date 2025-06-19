// app/(dashboard)/appointments/_components/DeleteAppointmentButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteAppointment } from '../actions';

type DeleteButtonProps = {
  appointmentId: string;
};

export function DeleteAppointmentButton({ appointmentId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      const result = await deleteAppointment(appointmentId);

      if (result.success) {
        toast.success(result.message);
        router.push('/appointments');
        router.refresh();
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