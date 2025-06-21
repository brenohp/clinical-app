// app/(dashboard)/appointments/_components/CalendarView.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay, isWithinInterval, startOfISOWeek, endOfISOWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import type { Appointment, Patient, User } from '@prisma/client';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { NavigationCalendar } from './NavigationCalendar';
import { NewAppointmentModal } from './NewAppointmentModal';
import { EditAppointmentModal } from '../[id]/edit/_components/EditAppointmentModal';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: User;
};

type AgendaViewProps = {
  appointments: AppointmentWithRelations[];
  patients: Patient[];
  doctors: User[];
};

const statusStyles: { [key: string]: string } = {
  AGENDADA: 'bg-blue-100 text-blue-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  REALIZADA: 'bg-purple-100 text-purple-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

export function AgendaView({ appointments, patients, doctors }: AgendaViewProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setIsNewModalOpen(true);
  };

  const handleSelectEvent = (event: { resource: AppointmentWithRelations }) => {
    setSelectedAppointment(event.resource);
    setIsEditModalOpen(true);
  };
  
  const closeAllModals = () => {
    setIsNewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleNavCalendarChange = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
    setView(Views.DAY);
  }, []);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return appointments.filter(app => isSameDay(new Date(app.appointmentDate), now));
      case 'week':
        const weekStart = startOfISOWeek(now);
        const weekEnd = endOfISOWeek(now);
        return appointments.filter(app => isWithinInterval(new Date(app.appointmentDate), { start: weekStart, end: weekEnd }));
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        return appointments.filter(app => isWithinInterval(new Date(app.appointmentDate), { start: monthStart, end: monthEnd }));
      case 'all':
      default:
        return [...appointments].sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
    }
  }, [appointments, filter]);
  
  const events = appointments.map((appointment) => {
    const start = new Date(appointment.appointmentDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000); 
    return { title: `${appointment.patient.name}`, start, end, resource: appointment };
  });

  const messages = {
    allDay: 'Dia todo', previous: '<', next: '>', today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda'
  };

  return (
    <>
      {/* AJUSTE: Removido 'h-full' e padding. O padding é gerenciado pelo layout principal */}
      <div className="flex gap-6">
        <div className="w-72 flex-shrink-0 space-y-6">
          <Link href="/appointments/new" className="flex w-full items-center justify-center gap-2 bg-brand-accent text-white py-3 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200">
            <PlusCircle size={20} />
            <span className="font-semibold">Nova Consulta</span>
          </Link>
          <NavigationCalendar 
            selectedDate={selectedDate} 
            onDateChange={handleNavCalendarChange} 
          />
          <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-brand-primary">Tarefas do dia</h3>
              <p className="text-center text-sm text-gray-400 mt-4">Nenhuma tarefa agendada.</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md h-[700px] flex-shrink-0">
              <Calendar
                  localizer={localizer}
                  events={events}
                  view={view}
                  date={selectedDate}
                  onView={setView}
                  onNavigate={(date) => setSelectedDate(date)}
                  messages={messages}
                  culture='pt-BR'
                  step={30}
                  timeslots={1}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
              />
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b flex items-center gap-4 flex-wrap">
                  <h3 className="text-lg font-semibold text-brand-primary mr-4">Lista de Agendamentos</h3>
                  <div className="flex items-center gap-2">
                      <button onClick={() => setFilter('all')} className={`text-sm px-3 py-1 rounded-full ${filter === 'all' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'}`}>Todos</button>
                      <button onClick={() => setFilter('today')} className={`text-sm px-3 py-1 rounded-full ${filter === 'today' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'}`}>Hoje</button>
                      <button onClick={() => setFilter('week')} className={`text-sm px-3 py-1 rounded-full ${filter === 'week' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'}`}>Esta Semana</button>
                      <button onClick={() => setFilter('month')} className={`text-sm px-3 py-1 rounded-full ${filter === 'month' ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'}`}>Este Mês</button>
                  </div>
              </div>
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-brand-accent-light">
                      <thead className="bg-brand-accent-light/30">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Paciente</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Médico</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Data e Hora</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-brand-accent uppercase tracking-wider">Ações</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-brand-accent-light/50">
                          {filteredAppointments.length === 0 ? (
                              <tr>
                                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nenhum agendamento para o filtro selecionado.</td>
                              </tr>
                          ) : (
                              filteredAppointments.map((appointment) => (
                                  <tr key={appointment.id} className="hover:bg-brand-accent-light/20">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">{appointment.patient.name}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{appointment.doctor.name}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{new Date(appointment.appointmentDate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[appointment.status] || 'bg-gray-100 text-gray-800'}`}>
                                              {appointment.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                          <Link href={`/appointments/${appointment.id}/edit`} className="text-brand-accent hover:text-brand-primary hover:underline">Editar</Link>
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>

        <div className="w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-brand-primary">Próximos horários livres</h3>
              <p className="text-center text-sm text-gray-400 mt-4">Nenhum horário livre.</p>
          </div>
        </div>
      </div>
      
      <NewAppointmentModal 
        isOpen={isNewModalOpen}
        onClose={closeAllModals}
        patients={patients}
        doctors={doctors}
        selectedSlot={selectedSlot}
      />
      <EditAppointmentModal
        isOpen={isEditModalOpen}
        onClose={closeAllModals}
        appointment={selectedAppointment}
        patients={patients}
        doctors={doctors}
      />
    </>
  );
}