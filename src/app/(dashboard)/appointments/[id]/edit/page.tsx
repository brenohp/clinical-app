// app/(dashboard)/appointments/[id]/edit/page.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateAppointment } from '../../actions';
import { PageHeader } from '@/components/layout/PageHeader'; // 1. Importa o componente

export default async function EditAppointmentPage({ params }: { params: { id: string } }) {

  // A lógica para buscar os dados continua a mesma
  const [appointment, patients, doctors] = await Promise.all([
    prisma.appointment.findUnique({
      where: { id: params.id },
    }),
    prisma.patient.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!appointment) {
    notFound();
  }

  const updateAppointmentWithId = updateAppointment.bind(null, appointment.id);
  const appointmentDateForInput = new Date(appointment.appointmentDate).toISOString().split('T')[0];
  const appointmentTimeForInput = new Date(appointment.appointmentDate).toTimeString().slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      {/* 2. O h1 antigo é substituído pelo PageHeader */}
      <PageHeader
        title="Editar Agendamento"
        backHref="/appointments" // Define para onde o botão "Voltar" deve apontar
      />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <form action={updateAppointmentWithId}>
          {/* O conteúdo do formulário permanece exatamente o mesmo */}
          <div className="space-y-5">
            {/* Seleção de Paciente */}
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-brand-primary">Paciente</label>
              <select id="patientId" name="patientId" defaultValue={appointment.patientId} required className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md ...">
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient.name}</option>
                ))}
              </select>
            </div>

            {/* Seleção de Médico */}
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-brand-primary">Médico/Profissional</label>
              <select id="doctorId" name="doctorId" defaultValue={appointment.doctorId} required className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md ...">
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-brand-primary">Data</label>
                <input type="date" id="date" name="date" defaultValue={appointmentDateForInput} required className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md ..."/>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-brand-primary">Hora</label>
                <input type="time" id="time" name="time" defaultValue={appointmentTimeForInput} required className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md ..."/>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-brand-primary">Status</label>
              <select id="status" name="status" defaultValue={appointment.status} required className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md ...">
                <option value="AGENDADA">Agendada</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            {/* Anotações */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-brand-primary">Anotações (Opcional)</label>
              <textarea id="notes" name="notes" rows={4} defaultValue={appointment.notes ?? ''} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md ..."></textarea>
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className="w-full bg-brand-accent text-white py-2.5 px-4 rounded-md shadow-sm font-medium hover:brightness-95">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}