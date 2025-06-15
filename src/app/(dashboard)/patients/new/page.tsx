// app/(dashboard)/patients/new/page.tsx
'use client'; 

import { useState, FormEvent } from 'react'; // 1. Importamos o FormEvent
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createPatient } from '../actions';
import { PageHeader } from '@/components/layout/PageHeader';

export default function NewPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 2. A função agora recebe o evento do formulário, como é o padrão do onSubmit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o recarregamento padrão da página
    setIsLoading(true);
    const toastId = toast.loading('Cadastrando paciente...');

    // 3. Criamos o FormData a partir do evento do formulário
    const formData = new FormData(event.currentTarget);
    const result = await createPatient(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setTimeout(() => {
        router.push('/patients');
        router.refresh();
      }, 1000);
    } else {
      toast.error(result.message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Cadastrar Novo Paciente"
        description="Preencha os dados para criar um novo cadastro."
        backHref="/patients"
      />

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        {/* 4. Trocamos 'action' por 'onSubmit' */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* O resto do formulário e dos inputs continua exatamente o mesmo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-brand-primary">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-brand-primary">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-brand-primary">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
                Email (Opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-brand-accent text-white py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}