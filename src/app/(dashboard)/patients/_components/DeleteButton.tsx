// app/(dashboard)/patients/_components/DeleteButton.tsx
'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { deletePatient } from '../actions';

export function DeleteButton({ patientId }: { patientId: string }) {
  // O hook useTransition nos dá um estado 'isPending' para o carregamento
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (window.confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
      // Envolvemos a chamada da action em startTransition
      startTransition(async () => {
        // A action agora retorna um objeto com 'success' e 'message'
        const result = await deletePatient(patientId);

        if (result.success) {
          toast.success(result.message);
        } else {
          // Exibe a mensagem de erro específica vinda do backend
          toast.error(result.message, {
            duration: 6000, // Mostra o toast de erro por mais tempo
          });
        }
      });
    }
  };

  return (
    // Trocamos o <form> por um <button> com onClick
    <button
      onClick={handleClick}
      disabled={isPending}
      className="ml-4 text-red-600 hover:text-red-800 hover:underline font-medium disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
    >
      {isPending ? 'Excluindo...' : 'Excluir'}
    </button>
  );
}