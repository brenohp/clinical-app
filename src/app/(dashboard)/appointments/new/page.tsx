// app/(dashboard)/appointments/new/page.tsx

import prisma from '@/lib/prisma';
import { createAppointment } from '../actions';
import Link from 'next/link';

export default async function NewAppointmentPage() {
  const [patients, doctors] = await Promise.all([
    prisma.patient.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (patients.length === 0 || doctors.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-brand-primary mb-6">Agendar Nova Consulta</h1>
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

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-brand-primary mb-6">Agendar Nova Consulta</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        <form action={createAppointment}>
          <div className="space-y-5">
            {/* Seleção de Paciente */}
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-brand-primary">
                Paciente
              </label>
              <select
                id="patientId"
                name="patientId"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
                defaultValue="" // <-- CORREÇÃO APLICADA AQUI
              >
                {/* E o atributo 'selected' foi removido daqui */}
                <option value="" disabled>Selecione um paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seleção de Médico */}
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-brand-primary">
                Médico/Profissional
              </label>
              <select
                id="doctorId"
                name="doctorId"
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                required
                defaultValue="" // <-- CORREÇÃO APLICADA AQUI
              >
                {/* E o atributo 'selected' foi removido daqui */}
                <option value="" disabled>Selecione um profissional</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ... o resto do formulário continua igual ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-brand-primary">
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-brand-primary">
                  Hora
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-brand-primary">
                Anotações (Opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              ></textarea>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-brand-accent text-white py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium hover:brightness-95"
            >
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}