// app/(dashboard)/settings/users/_components/DeleteUserButton.tsx
'use client';

import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { deleteUser } from '../actions'; // Importa a action do diretório pai

export function DeleteUserButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      startTransition(async () => {
        const result = await deleteUser(userId);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message, {
            duration: 6000,
          });
        }
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="ml-4 text-red-600 hover:text-red-800 hover:underline font-medium disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
    >
      {isPending ? 'Excluindo...' : 'Excluir'}
    </button>
  );
}