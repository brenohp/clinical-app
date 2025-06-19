// app/(dashboard)/settings/users/[id]/edit/_components/EditUserForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // 1. Importar o hook useSession
import { updateUser } from '../../../actions';
import { DeleteUserButton } from '../../../_components/DeleteUserButton'; // 2. Importar o nosso novo botão

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type EditUserFormProps = {
  user: UserData;
};

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const { data: session } = useSession(); // 3. Obter os dados da sessão do usuário logado
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Salvando alterações...');

    const formData = new FormData(event.currentTarget);
    const result = await updateUser(user.id, formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setTimeout(() => {
        router.push('/settings/users');
        router.refresh();
      }, 1000);
    } else {
      toast.error(result.message, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* ... (os campos do formulário continuam os mesmos) ... */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-primary">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-primary">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={user.email}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-brand-primary">Função</label>
          <select
            id="role"
            name="role"
            defaultValue={user.role}
            disabled={isSubmitting}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="USER">Usuário (Profissional)</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <div className='text-xs text-gray-500 italic'>
            Para alterar a senha, um fluxo de &quot;Esqueci minha senha&quot; ou uma seção dedicada no perfil do usuário é recomendado por segurança.
        </div>
      </div>

      {/* AJUSTE: Rodapé do formulário agora tem os dois botões */}
      <div className="mt-8 flex justify-between items-center">
        {/* 4. Botão de Excluir alinhado à esquerda */}
        <DeleteUserButton 
            userId={user.id} 
            currentUserId={session?.user?.id || ''} 
        />

        {/* Botão de Salvar alinhado à direita */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-accent text-white py-2.5 px-6 rounded-md shadow-sm font-medium hover:brightness-95 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}