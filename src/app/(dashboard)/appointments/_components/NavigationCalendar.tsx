// app/(dashboard)/appointments/_components/NavigationCalendar.tsx
'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

// NOVO: Importando a função 'format' para formatar os dias da semana
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type NavigationCalendarProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export function NavigationCalendar({ selectedDate, onDateChange }: NavigationCalendarProps) {
  return (
    <div className="react-calendar-wrapper mt-6 bg-white p-2 rounded-lg shadow-md">
      <Calendar
        onChange={(value) => onDateChange(value as Date)}
        value={selectedDate}
        locale="pt-BR"
        className="!border-none"
        // NOVO: Prop para formatar os dias da semana para uma única letra
        formatShortWeekday={(locale, date) => format(date, 'E', { locale: ptBR }).charAt(0)}
      />
    </div>
  );
}