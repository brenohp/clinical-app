// app/(dashboard)/appointments/[id]/edit/_components/EditAppointmentForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import type { Appointment, Patient, User } from '@prisma/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { updateAppointment } from '../../../actions';
// NOVO: Importando o botão de exclusão que criamos
import { DeleteAppointmentButton } from '../../../_components/DeleteAppointmentButton';

type EditAppointmentFormProps = {
  appointment: Appointment;
  patients: Patient[];
  doctors: User[];
};

export function EditAppointmentForm({ appointment, patients, doctors }: EditAppointmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appointmentDateForInput = new Date(appointment.appointmentDate).toISOString().split('T')[0];
  const appointmentTimeForInput = new Date(appointment.appointmentDate).toTimeString().slice(0, 5);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Salvando alterações...');
    
    const formData = new FormData(event.currentTarget);
    const result = await updateAppointment(appointment.id, formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setTimeout(() => {
        router.push('/appointments');
        router.refresh();
      }, 1000);
    } else {
      toast.error(result.message, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* ... (o resto do formulário continua o mesmo) ... */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-brand-primary">Paciente</label>
          <select id="patientId" name="patientId" defaultValue={appointment.patientId} required disabled={isSubmitting} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-brand-primary">Médico/Profissional</label>
          <select id="doctorId" name="doctorId" defaultValue={appointment.doctorId} required disabled={isSubmitting} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-brand-primary">Data</label>
            <input type="date" id="date" name="date" defaultValue={appointmentDateForInput} required disabled={isSubmitting} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-brand-primary">Hora</label>
            <input type="time" id="time" name="time" defaultValue={appointmentTimeForInput} required disabled={isSubmitting} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-brand-primary">Status</label>
          <select id="status" name="status" defaultValue={appointment.status} required disabled={isSubmitting} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
            <option value="AGENDADA">Agendada</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="REALIZADA">Realizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-brand-primary">Anotações (Opcional)</label>
          <textarea id="notes" name="notes" rows={4} defaultValue={appointment.notes ?? ''} disabled={isSubmitting} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md disabled:opacity-50 focus:outline-none focus:ring-brand-accent focus:border-brand-accent"></textarea>
        </div>
      </div>
      
      {/* AJUSTE: Rodapé do formulário agora tem os dois botões */}
      <div className="mt-8 flex justify-between items-center">
        {/* Botão de Excluir alinhado à esquerda */}
        <DeleteAppointmentButton appointmentId={appointment.id} />

        {/* Botão de Salvar alinhado à direita */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-brand-accent text-white py-2.5 px-6 rounded-md shadow-sm font-medium hover:brightness-95 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}