// app/(dashboard)/patients/[id]/edit/_components/EditPatientForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import type { Patient } from '@prisma/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { updatePatient } from '@/app/(dashboard)/patients/actions';

type EditPatientFormProps = {
  patient: Patient;
};

export function EditPatientForm({ patient }: EditPatientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Salvando alterações...');
    
    const formData = new FormData(event.currentTarget);
    const result = await updatePatient(patient.id, formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      setTimeout(() => {
        router.push('/patients');
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-primary">Nome Completo</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={patient.name}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-brand-primary">CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            defaultValue={patient.cpf}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-brand-primary">Data de Nascimento</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            defaultValue={patient.birthDate.toISOString().split('T')[0]}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand-primary">Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={patient.phone}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-primary">Email (Opcional)</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={patient.email ?? ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary placeholder-gray-400 focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-brand-accent text-white py-2.5 px-4 border border-transparent rounded-md shadow-sm font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}