// app/(dashboard)/appointments/page.tsx

import Link from 'next/link';
import prisma from '@/lib/prisma';
// import { DeleteAppointmentButton } from './_components/DeleteAppointmentButton'; // REMOVIDO
import { PageHeader } from '@/components/layout/PageHeader';
import { PlusCircle } from 'lucide-react';

const statusStyles: { [key: string]: string } = {
  AGENDADA: 'bg-blue-100 text-blue-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  REALIZADA: 'bg-purple-100 text-purple-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

export default async function AppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      appointmentDate: 'desc',
    },
  });

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Agenda de Consultas"
        description="Visualize e gerencie todos os agendamentos."
      >
        <Link
          href="/appointments/new"
          className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200 flex-shrink-0"
        >
          <PlusCircle size={20} />
          <span className="font-medium whitespace-nowrap">Agendar Consulta</span>
        </Link>
      </PageHeader>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-accent-light">
            <thead className="bg-brand-accent-light/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Médico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Data e Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-accent-light/50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-brand-accent-light/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">
                      {appointment.patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">
                      {appointment.doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">
                      {new Date(appointment.appointmentDate).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusStyles[appointment.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/appointments/${appointment.id}/edit`} className="text-brand-accent hover:text-brand-primary hover:underline">
                        Editar
                      </Link>
                      {/* O botão de exclusão foi removido daqui */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}