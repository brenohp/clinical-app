// app/(dashboard)/appointments/_components/CalendarView.tsx
'use client';

import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, SlotInfo, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
// GARANTIA 1: Importando o locale 'pt-BR' da maneira correta
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import type { Appointment, Patient, User } from '@prisma/client';
import { NewAppointmentModal } from './NewAppointmentModal';
import { EditAppointmentModal } from '../[id]/edit/_components/EditAppointmentModal';

// GARANTIA 2: Configurando o 'localizer' para usar o idioma português
const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

// ... (o resto do seu componente continua aqui)
type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: User;
};

type CalendarViewProps = {
  appointments: AppointmentWithRelations[];
  patients: Patient[];
  doctors: User[];
};

export function CalendarView({ appointments, patients, doctors }: CalendarViewProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithRelations | null>(null);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (slotInfo.action === 'click' || slotInfo.action === 'select') {
      setSelectedSlot(slotInfo);
      setIsNewModalOpen(true);
    }
  };

  const handleSelectEvent = (event: { resource: AppointmentWithRelations }) => {
    setSelectedAppointment(event.resource);
    setIsEditModalOpen(true);
  };

  const closeAllModals = () => {
    setIsNewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedSlot(null);
    setSelectedAppointment(null);
  };

  const handleDrillDown = useCallback((newDate: Date) => {
    setDate(newDate);
    setView(Views.DAY);
  }, [setView, setDate]);

  const events = appointments.map((appointment) => {
    const start = new Date(appointment.appointmentDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000); 
    return {
      title: `${appointment.patient.name} - Dr(a). ${appointment.doctor.name}`,
      start,
      end,
      resource: appointment,
    };
  });

  // GARANTIA 3: Passando as mensagens traduzidas para o componente
  const messages = {
    allDay: 'Dia todo',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período.',
    showMore: (total: number) => `+ Ver mais (${total})`
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md h-[600px] md:h-[700px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture='pt-BR' // GARANTIA 4: Passando a cultura para o componente
          messages={messages}
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          onDrillDown={handleDrillDown}
          step={30}
          timeslots={1}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
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