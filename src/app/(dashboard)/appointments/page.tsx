// app/(dashboard)/appointments/page.tsx

import prisma from '@/lib/prisma';
import { AgendaView } from './_components/CalendarView'; 

export default async function AppointmentsPage() {
  const [appointments, patients, doctors] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    }),
    prisma.patient.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return <AgendaView appointments={appointments} patients={patients} doctors={doctors} />;
}