// app/(dashboard)/settings/profile/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { updateProfile } from '../actions';

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession(); // Hook para pegar a sessão no cliente

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quando a sessão carregar, preenche o campo nome
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Atualizando perfil...');
    
    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      // Limpa os campos de senha após o sucesso
      setPassword('');
      setPasswordConfirmation('');
      // Força a atualização da sessão do NextAuth para refletir o novo nome
      await updateSession({ name: name });
    } else {
      toast.error(result.message, { id: toastId });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Editar Perfil"
        description="Atualize seus dados pessoais e de acesso."
        backHref="/settings"
      />

      <main className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            />
          </div>

          {/* Campo Email (somente leitura) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={session?.user?.email ?? 'Carregando...'}
              readOnly // O email não pode ser alterado
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>

          <hr/>

          <p className="text-sm text-gray-600">Deixe os campos abaixo em branco se não quiser alterar sua senha.</p>
          
          {/* Campo Nova Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-primary">
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            />
          </div>
          
          {/* Campo Confirmação de Senha */}
          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-brand-primary">
              Confirme a Nova Senha
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brand-accent text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors duration-200 font-semibold disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}