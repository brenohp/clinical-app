// src/app/(dashboard)/painel/page.tsx

// Removemos o 'use client'. Agora este é um Componente de Servidor.
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Briefcase, CalendarClock, CheckCircle, Users } from 'lucide-react';

// A função da página agora é 'async' para permitir a busca de dados
export default async function PainelPage() {
  // 1. Buscamos a sessão do usuário no lado do servidor
  const session = await getServerSession(authOptions);

  // 2. Definimos os períodos de tempo para as nossas consultas
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const next7Days = new Date();
  next7Days.setDate(todayStart.getDate() + 7);

  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(todayStart.getMonth() - 6);

  // 3. Executamos todas as consultas ao banco de dados em paralelo
  const [
    consultasHoje,
    proximasConsultas,
    consultasRealizadasMes,
    pacientesAtivosQuery,
  ] = await Promise.all([
    // Contagem de consultas para hoje
    prisma.appointment.count({
      where: { appointmentDate: { gte: todayStart, lte: todayEnd } },
    }),
    // Contagem de consultas para os próximos 7 dias
    prisma.appointment.count({
      where: { appointmentDate: { gte: todayStart, lte: next7Days } },
    }),
    // Contagem de consultas realizadas no mês atual
    prisma.appointment.count({
      where: {
        status: 'REALIZADA',
        appointmentDate: { gte: monthStart },
      },
    }),
    // Busca os IDs únicos de pacientes com consultas nos últimos 6 meses
    prisma.appointment.findMany({
        where: { appointmentDate: { gte: sixMonthsAgo } },
        select: { patientId: true },
        distinct: ['patientId'],
    }),
  ]);

  const pacientesAtivos = pacientesAtivosQuery.length;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-primary">
          Bem-vindo(a) de volta, <span className="text-brand-accent">{session?.user?.name}</span>!
        </h2>
        <p className="text-gray-600 mt-1">
          Este é o seu painel de controle. Aqui estão as informações mais recentes da clínica.
        </p>
      </div>
      
      {/* Cards de Estatísticas com dados dinâmicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Consultas Hoje */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Consultas Hoje</p>
            <p className="text-3xl font-bold text-brand-accent">{consultasHoje}</p> 
          </div>
          <div className="bg-brand-accent-light/50 p-3 rounded-full">
            <Briefcase className="text-brand-accent" size={24} />
          </div>
        </div>

        {/* Card 2: Próximas Consultas (7d) */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Próximas Consultas (7d)</p>
            <p className="text-3xl font-bold text-brand-accent">{proximasConsultas}</p> 
          </div>
          <div className="bg-brand-accent-light/50 p-3 rounded-full">
            <CalendarClock className="text-brand-accent" size={24} />
          </div>
        </div>

        {/* Card 3: Consultas Realizadas (Mês) */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Realizadas (Mês)</p>
            <p className="text-3xl font-bold text-brand-accent">{consultasRealizadasMes}</p> 
          </div>
          <div className="bg-brand-accent-light/50 p-3 rounded-full">
            <CheckCircle className="text-brand-accent" size={24} />
          </div>
        </div>

        {/* Card 4: Pacientes Ativos */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Pacientes Ativos</p>
            <p className="text-3xl font-bold text-brand-accent">{pacientesAtivos}</p> 
          </div>
          <div className="bg-brand-accent-light/50 p-3 rounded-full">
            <Users className="text-brand-accent" size={24} />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow">
        <h3 className="text-xl font-semibold text-brand-primary">Próximos Agendamentos</h3>
        {/* Futuramente, esta seção também será dinâmica */}
        <p className="mt-2 text-gray-500">Nenhum agendamento para hoje.</p>
      </div>
    </>
  );
}