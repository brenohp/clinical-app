// app/(dashboard)/appointments/new/_components/NewAppointmentForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import type { Patient, User } from '@prisma/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createAppointment } from '../../actions';

type NewAppointmentFormProps = {
  patients: Patient[];
  doctors: User[];
};

export function NewAppointmentForm({ patients, doctors }: NewAppointmentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Criando agendamento...');
    
    const formData = new FormData(event.currentTarget);
    const result = await createAppointment(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setTimeout(() => {
        router.push('/appointments');
        router.refresh();
      }, 1000);
    } else {
      toast.error(result.message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-brand-primary">Paciente</label>
          <select 
            id="patientId" 
            name="patientId" 
            required 
            defaultValue="" 
            disabled={isLoading} 
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
          >
            <option value="" disabled>Selecione um paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="doctorId" className="block text-sm font-medium text-brand-primary">Médico/Profissional</label>
          <select 
            id="doctorId" 
            name="doctorId" 
            required 
            defaultValue="" 
            disabled={isLoading} 
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
          >
            <option value="" disabled>Selecione um profissional</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-brand-primary">Data</label>
            <input type="date" id="date" name="date" required disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"/>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-brand-primary">Hora</label>
            <input type="time" id="time" name="time" required disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"/>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-brand-primary">Anotações (Opcional)</label>
          <textarea id="notes" name="notes" rows={4} disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"></textarea>
        </div>
      </div>
      <div className="mt-8">
        <button type="submit" disabled={isLoading} className="w-full bg-brand-accent text-white py-2.5 px-4 rounded-md shadow-sm font-medium hover:brightness-95 disabled:bg-gray-400">
          {isLoading ? 'Salvando...' : 'Salvar Agendamento'}
        </button>
      </div>
    </form>
  );
}