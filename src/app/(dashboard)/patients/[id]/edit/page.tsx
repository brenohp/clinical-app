// app/(dashboard)/patients/[id]/edit/page.tsx

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { updatePatient } from '@/app/(dashboard)/patients/actions';
import { PageHeader } from '@/components/layout/PageHeader'; // 1. Importa o componente

const prisma = new PrismaClient();

export default async function EditPatientPage({ params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!patient) {
    notFound();
  }

  const updatePatientWithId = updatePatient.bind(null, patient.id);

  return (
    <div className="p-4 md:p-8">
      {/* 2. Substitui o h1 pelo PageHeader */}
      <PageHeader
        title="Editar Paciente"
        description={patient.name} // Usa o nome do paciente como descrição
        backHref="/patients"
      />

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <form action={updatePatientWithId}>
          <div className="space-y-5">
            {/* Campo Nome */}
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
            
            {/* Campo CPF */}
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
            
            {/* Campo Data de Nascimento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-brand-primary">
                Data de Nascimento
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                defaultValue={patient.birthDate.toISOString().split('T')[0]}
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
              />
            </div>

            {/* Campo Telefone */}
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

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-primary">
                Email (Opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={patient.email ?? ''}
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