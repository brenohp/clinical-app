// app/(dashboard)/patients/_components/DeletePatientButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deletePatient } from '../../../actions'; // Importando da sua estrutura de arquivos

type DeletePatientButtonProps = {
  patientId: string;
};

export function DeletePatientButton({ patientId }: DeletePatientButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      const result = await deletePatient(patientId);

      if (result.success) {
        toast.success(result.message);
        router.push('/patients');
        router.refresh();
      } else {
        // Mostra a mensagem de erro específica vinda da action
        // (ex: "Não é possível excluir. Este paciente possui X agendamentos")
        toast.error(result.message, { duration: 5000 });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
      aria-label="Excluir paciente"
    >
      <Trash2 size={16} />
      Excluir Paciente
    </button>
  );
}