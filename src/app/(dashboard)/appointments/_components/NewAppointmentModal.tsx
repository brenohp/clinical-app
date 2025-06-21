// app/(dashboard)/appointments/_components/NewAppointmentModal.tsx
'use client';

// ... (imports sem alterações)
import { Fragment, useState, FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import type { Patient, User } from '@prisma/client';
import { SlotInfo } from 'react-big-calendar';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createAppointment } from '../actions';

// ... (type ModalProps sem alterações)
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  doctors: User[];
  selectedSlot: SlotInfo | null;
};

export function NewAppointmentModal({ isOpen, onClose, patients, doctors, selectedSlot }: ModalProps) {
  // ... (toda a lógica do componente sem alterações)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatTime = (date: Date) => date.toTimeString().slice(0, 5);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Criando agendamento...');
    
    const formData = new FormData(event.currentTarget);
    const result = await createAppointment(formData);

    if (result.success) {
      toast.success(result.message, { id: toastId });
      router.refresh(); 
      onClose(); 
    } else {
      toast.error(result.message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      {/* AJUSTE: O z-index foi aumentado para z-50 para garantir que o modal fique na frente de tudo */}
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ... (o resto do código do modal continua exatamente o mesmo) ... */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-brand-primary flex justify-between items-center">
                  Agendar Nova Consulta
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                    <X size={20} className="text-gray-500"/>
                  </button>
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="patientId" className="block text-sm font-medium text-brand-primary">Paciente</label>
                      <select id="patientId" name="patientId" required defaultValue="" disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50">
                        <option value="" disabled>Selecione um paciente</option>
                        {patients.map((patient) => (
                          <option key={patient.id} value={patient.id}>{patient.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="doctorId" className="block text-sm font-medium text-brand-primary">Médico/Profissional</label>
                      <select id="doctorId" name="doctorId" required defaultValue="" disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50">
                        <option value="" disabled>Selecione um profissional</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-brand-primary">Data</label>
                        <input type="date" id="date" name="date" required disabled={isLoading} 
                          defaultValue={selectedSlot ? formatDate(selectedSlot.start) : ''}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"/>
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-brand-primary">Hora</label>
                        <input type="time" id="time" name="time" required disabled={isLoading} 
                          defaultValue={selectedSlot ? formatTime(selectedSlot.start) : ''}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"/>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-brand-primary">Anotações (Opcional)</label>
                      <textarea id="notes" name="notes" rows={4} disabled={isLoading} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-accent-light rounded-md text-brand-primary focus:outline-none focus:ring-brand-accent focus:border-brand-accent disabled:opacity-50"></textarea>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={isLoading} className="bg-brand-accent text-white py-2.5 px-6 rounded-md shadow-sm font-medium hover:brightness-95 disabled:bg-gray-400">
                      {isLoading ? 'Salvando...' : 'Salvar Agendamento'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}