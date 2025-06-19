import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { Users, Building, CreditCard, UserCircle, Edit } from 'lucide-react';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Renomeado para SettingsPage para clareza
export default async function SettingsPage() { 
  const session = await getServerSession(authOptions);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          Configurações
        </h1>
        <p className="text-brand-accent mt-1">
          Gerencie seu perfil e as funcionalidades do sistema.
        </p>
      </header>

      {/* Seção de Perfil */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-brand-primary mb-4 pb-2 border-b border-gray-200">
          Meu Perfil
        </h2>
        <div className="mt-4 p-6 bg-white rounded-lg shadow-md flex items-center justify-between">
            <div className='flex items-center gap-4'>
                <span className='bg-brand-accent-light p-4 rounded-full'>
                    <UserCircle size={32} className='text-brand-accent'/>
                </span>
                <div>
                    <p className="text-lg font-bold text-brand-primary">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
            </div>
            {/* O BOTÃO AGORA É UM LINK FUNCIONAL */}
            <Link
                href="/settings/profile" // Aponta para a página de perfil que criamos
                className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200"
            >
                <Edit size={16} />
                <span className="font-medium">Editar Perfil</span>
            </Link>
        </div>
      </section>

      {/* Seção de Administração */}
      {session?.user.role === 'ADMIN' && (
        <section>
          <h2 className="text-2xl font-semibold text-brand-primary mb-4 pb-2 border-b border-gray-200">
            Administração
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* Card de Gerenciar Usuários */}
            <Link 
              href="/settings/users" // Rota corrigida
              className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="bg-brand-accent-light p-3 rounded-full">
                  <Users className="text-brand-accent" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-accent transition-colors">
                  IR &rarr;
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-primary">Gerenciar Usuários</h3>
                <p className="text-sm text-gray-600 mt-1">Adicione, edite e gerencie os profissionais.</p>
              </div>
            </Link>

            {/* Card 2: Dados da Clínica */}
            <Link
              href="/settings/clinic"
              className="group block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="bg-brand-accent-light p-3 rounded-full">
                  <Building className="text-brand-accent" size={24} />
                </span>
                <span className="text-xs font-semibold text-gray-400 group-hover:text-brand-accent transition-colors">
                  IR &rarr;
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-primary">Dados da Clínica</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gerencie unidades, agendas e serviços.
                </p>
              </div>
            </Link>
            
            {/* Card 3: Faturamento (Placeholder) */}
            <div className="group block p-6 bg-white rounded-lg shadow-md opacity-60 cursor-not-allowed">
              <div className="flex items-start justify-between">
                  <span className="bg-gray-200 p-3 rounded-full">
                      <CreditCard className="text-gray-500" size={24} />
                  </span>
              </div>
              <div className="mt-4">
                  <h3 className="text-lg font-bold text-gray-500">Faturamento</h3>
                  <p className="text-sm text-gray-600 mt-1">Gerencie planos e pagamentos.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}