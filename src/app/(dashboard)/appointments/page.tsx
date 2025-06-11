// app/(dashboard)/appointments/page.tsx
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeleteAppointmentButton } from './_components/DeleteAppointmentButton';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-primary">
          Gestão de Consultas
        </h1>
        <Link
          href="/appointments/new"
          className="bg-brand-accent text-white py-2 px-4 rounded-md shadow-sm hover:brightness-95"
        >
          Agendar Nova Consulta
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* 1. Adicionamos esta div com a classe de overflow */}
        <div className="overflow-x-auto">
          {/* 2. A tabela agora está dentro da div */}
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
                      <DeleteAppointmentButton appointmentId={appointment.id} />
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