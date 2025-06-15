import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { EditPatientForm } from './_components/EditPatientForm';

const prisma = new PrismaClient();

// A ÚNICA MUDANÇA É A FORMA COMO 'id' É EXTRAÍDO AQUI:
export default async function EditPatientPage({ params: { id } }: { params: { id: string } }) {
  
  const patient = await prisma.patient.findUnique({
    where: {
      id: id, // Usando o 'id' desestruturado
    },
  });

  if (!patient) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Editar Paciente"
        description={patient.name}
        backHref="/patients"
      />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <EditPatientForm patient={patient} />
      </div>
    </div>
  );
}