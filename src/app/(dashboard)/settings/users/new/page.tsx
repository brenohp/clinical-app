// app/(dashboard)/configuracoes/usuarios/new/page.tsx

'use client'; 

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Para redirecionar o usuário
import toast from 'react-hot-toast';         // Para as notificações
import { PageHeader } from '@/components/layout/PageHeader';

export default function NovoUsuarioPage() {
  const router = useRouter();

  // Estados para o formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  
  // Novo estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(false);

  // A nova função handleSubmit com a lógica de API
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Criando usuário...');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Usuário criado com sucesso!', { id: toastId });
        router.push('/settings/users'); // Redireciona para a lista
        router.refresh(); // Força a atualização dos dados na página de lista
      } else {
        // Exibe a mensagem de erro que vem da nossa API
        toast.error(data.message || 'Erro ao criar usuário.', { id: toastId });
      }
    } catch (error) {
      console.error('Falha na requisição:', error);
      toast.error('Não foi possível se conectar ao servidor.', { id: toastId });
    } finally {
      // Garante que o estado de loading seja falso no final
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Criar Novo Usuário"
        description="Preencha os dados para cadastrar um novo profissional."
        backHref="/settings/users"
      />

      <main className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Os campos agora são desabilitados durante o carregamento */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-primary">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-brand-primary">
              Função
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="USER">Usuário (Profissional)</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brand-accent text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {/* O texto do botão muda durante o carregamento */}
              {isLoading ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}