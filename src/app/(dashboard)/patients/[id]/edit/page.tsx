// app/(dashboard)/patients/[id]/edit/page.tsx

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { updatePatient } from '@/app/(dashboard)/patients/actions'; // Ajuste o caminho se necessário

const prisma = new PrismaClient();

// A página agora recebe 'params', que contém o ID da URL
export default async function EditPatientPage({ params }: { params: { id: string } }) {
  
  // 1. Busca os dados do paciente específico usando o ID da URL
  const patient = await prisma.patient.findUnique({
    where: {
      id: params.id,
    },
  });

  // 2. Se nenhum paciente for encontrado com esse ID, mostra uma página 404
  if (!patient) {
    notFound();
  }

  // 3. Prepara a action de update, "amarrando" o ID do paciente a ela
  const updatePatientWithId = updatePatient.bind(null, patient.id);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-brand-primary mb-6">
        Editar Paciente: {patient.name}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        {/* O formulário agora chama a action preparada com o ID */}
        <form action={updatePatientWithId}>
          <div className="space-y-5">
            {/* Os campos agora usam 'defaultValue' para serem pré-preenchidos */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-primary">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={patient.name}
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
              />
            </div>
            
            {/* ... outros campos ... */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-brand-primary">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                defaultValue={patient.cpf}
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
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
                // Formata a data para o formato YYYY-MM-DD que o input type="date" exige
                defaultValue={patient.birthDate.toISOString().split('T')[0]}
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
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
                defaultValue={patient.phone}
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
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
                defaultValue={patient.email ?? ''} // Usa '' se o email for nulo
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-brand-accent text-white py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}