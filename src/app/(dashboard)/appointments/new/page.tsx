// app/(dashboard)/appointments/new/page.tsx

import prisma from '@/lib/prisma';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { NewAppointmentForm } from './_components/NewAppointmentForm'; // 1. Importa o nosso novo formulário

export default async function NewAppointmentPage() {
  // A busca de dados no servidor continua a mesma
  const [patients, doctors] = await Promise.all([
    prisma.patient.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // A lógica para o estado vazio também continua a mesma
  if (patients.length === 0 || doctors.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <PageHeader
          title="Agendar Nova Consulta"
          backHref="/appointments"
        />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-brand-primary">
            Você precisa ter ao menos um paciente e um médico cadastrados para poder agendar uma consulta.
          </p>
          {patients.length === 0 && (
            <Link href="/patients/new" className="mt-4 inline-block bg-brand-accent text-white py-2 px-4 rounded-md hover:brightness-95">
              Cadastrar Paciente
            </Link>
          )}
        </div>
      </div>
    );
  }

  // O retorno principal agora está muito mais limpo
  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Agendar Nova Consulta"
        description="Preencha os dados para criar um novo agendamento."
        backHref="/appointments"
      />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        {/* 2. Apenas renderizamos o formulário, passando os dados que buscamos */}
        <NewAppointmentForm patients={patients} doctors={doctors} />
      </div>
    </div>
  );
}