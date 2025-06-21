// app/(dashboard)/appointments/_components/EditAppointmentModal.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import type { Appointment, Patient, User } from '@prisma/client';
import { EditAppointmentForm } from '../_components/EditAppointmentForm';

type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: User;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithRelations | null;
  patients: Patient[];
  doctors: User[];
};

export function EditAppointmentModal({ isOpen, onClose, appointment, patients, doctors }: ModalProps) {
  if (!appointment) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ... (código do transition e dialog sem alterações) ... */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-brand-primary flex justify-between items-center">
                  Editar Agendamento
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                    <X size={20} className="text-gray-500"/>
                  </button>
                </Dialog.Title>
                <div className="mt-4">
                  {/* AJUSTE: Passando a função 'onClose' do modal para o 'onSuccess' do formulário */}
                  <EditAppointmentForm 
                    appointment={appointment}
                    patients={patients}
                    doctors={doctors}
                    onSuccess={onClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}