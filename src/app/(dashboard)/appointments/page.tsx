// app/(dashboard)/appointments/page.tsx

import Link from 'next/link';
import prisma from '@/lib/prisma';
import { PlusCircle } from 'lucide-react';
import { CalendarView } from './_components/CalendarView';

export default async function AppointmentsPage() {
  const [appointments, patients, doctors] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    }),
    prisma.patient.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    // AJUSTE: O container principal agora é um flex container com um gap
    <div className="flex h-full gap-6">

      {/* --- COLUNA ESQUERDA --- */}
      <div className="w-72 flex-shrink-0">
        <Link
            href="/appointments/new"
            className="flex w-full items-center justify-center gap-2 bg-brand-accent text-white py-3 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200"
        >
            <PlusCircle size={20} />
            <span className="font-semibold">Nova Consulta</span>
        </Link>
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            {/* O calendário pequeno de navegação entrará aqui no próximo passo */}
            <p className="text-center text-gray-500">Calendário Pequeno</p>
        </div>
         <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-brand-primary">Tarefas do dia</h3>
            <p className="text-center text-sm text-gray-400 mt-4">Nenhuma tarefa agendada.</p>
        </div>
      </div>

      {/* --- COLUNA CENTRAL (CONTEÚDO PRINCIPAL) --- */}
      <div className="flex-1">
        {/* Mantemos nosso componente de calendário aqui por enquanto */}
        <CalendarView 
          appointments={appointments} 
          patients={patients}
          doctors={doctors}
        />
      </div>

      {/* --- COLUNA DIREITA --- */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-brand-primary">Próximos horários livres</h3>
            <p className="text-center text-sm text-gray-400 mt-4">Nenhum horário livre encontrado.</p>
        </div>
      </div>
    </div>
  );
}