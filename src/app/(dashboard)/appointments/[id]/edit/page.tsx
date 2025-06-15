import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { EditAppointmentForm } from './_components/EditAppointmentForm';

// A ÚNICA MUDANÇA É A FORMA COMO 'id' É EXTRAÍDO AQUI:
export default async function EditAppointmentPage({ params: { id } }: { params: { id: string } }) {
  
  const [appointment, patients, doctors] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id: id }, // Usando o 'id' desestruturado
      include: { patient: true }
    }),
    prisma.patient.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Editar Agendamento"
        description={`Editando consulta de ${appointment.patient.name}`}
        backHref="/appointments"
      />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <EditAppointmentForm 
          appointment={appointment}
          patients={patients}
          doctors={doctors}
        />
      </div>
    </div>
  );
}