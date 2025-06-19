// app/(dashboard)/settings/users/_components/DeleteUserButton.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteUser } from '../actions';

type DeleteUserButtonProps = {
  userId: string;
  currentUserId: string; // Passaremos o ID do usuário logado para comparação
};

export function DeleteUserButton({ userId, currentUserId }: DeleteUserButtonProps) {
  const router = useRouter();
  const isDeletingSelf = userId === currentUserId;

  const handleDelete = async () => {
    // Dupla verificação no cliente para uma melhor experiência do usuário
    if (isDeletingSelf) {
      toast.error("Você não pode excluir sua própria conta.");
      return;
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      const result = await deleteUser(userId);

      if (result.success) {
        toast.success(result.message);
        router.push('/settings/users');
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
      disabled={isDeletingSelf} // Desabilita o botão se for o próprio usuário
      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
      aria-label="Excluir usuário"
      title={isDeletingSelf ? "Não é possível excluir a própria conta" : "Excluir usuário"}
    >
      <Trash2 size={16} />
      Excluir Usuário
    </button>
  );
}