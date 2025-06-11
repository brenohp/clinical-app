// app/(dashboard)/appointments/_components/DeleteAppointmentButton.tsx
'use client';

import { deleteAppointment } from '../actions';

export function DeleteAppointmentButton({ appointmentId }: { appointmentId: string }) {
  
  const deleteAppointmentWithId = deleteAppointment.bind(null, appointmentId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const confirmed = confirm('Você tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.');
    if (!confirmed) {
      event.preventDefault(); // Cancela o envio do formulário se o usuário não confirmar
    }
  };

  return (
    <form action={deleteAppointmentWithId} onSubmit={handleSubmit} className="inline">
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 hover:underline ml-4 font-medium"
      >
        Excluir
      </button>
    </form>
  );
}