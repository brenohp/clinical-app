// app/(dashboard)/patients/DeleteButton.tsx
'use client'; // Essencial: Transforma este em um Componente de Cliente

import { deletePatient } from '../actions';

// O componente recebe o ID do paciente como propriedade
export function DeleteButton({ patientId }: { patientId: string }) {

  // Prepara a action, "amarrando" o ID a ela
  const deletePatientWithId = deletePatient.bind(null, patientId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Pede a confirmação ao usuário
    const confirmed = confirm('Você tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.');

    // Se o usuário clicar em "Cancelar", impede o envio do formulário
    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <form action={deletePatientWithId} onSubmit={handleSubmit} className="inline">
      <button
        type="submit"
        className="text-red-600 hover:text-red-800 hover:underline ml-4 font-medium"
      >
        Excluir
      </button>
    </form>
  );
}