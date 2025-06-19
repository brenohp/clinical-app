// app/settings/clinic/new/page.tsx
'use client'; // <-- PASSO MAIS IMPORTANTE: Converte para Componente de Cliente

import { PageHeader } from "@/components/layout/PageHeader";
import { createClinicUnit } from "../_actions/clinic-actions";
import { useRouter } from "next/navigation"; // Importa o hook de roteamento
import toast from "react-hot-toast"; // Importa o toast

export default function NewClinicUnitPage() {
  const router = useRouter();

  // Função para lidar com o envio do formulário no lado do cliente
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o recarregamento padrão da página
    const formData = new FormData(event.currentTarget);

    // Chama a server action e espera a resposta
    const result = await createClinicUnit(formData);

    // Exibe o toast com base na resposta
    if (result.success) {
      toast.success(result.message);
      router.push('/settings/clinic'); // Redireciona para a lista
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Nova Unidade"
        description="Preencha os dados do novo endereço de atendimento."
        backHref="/settings/clinic"
      />

      <div className="p-4 md:p-8">
        {/* O formulário agora usa onSubmit para chamar nossa função de cliente */}
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white p-8 rounded-lg shadow">
          {/* ... (todos os seus campos de input continuam aqui, sem alterações) ... */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Unidade</label>
            <input type="text" name="name" id="name" required placeholder="Ex: Consultório Principal, Unidade Centro" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
            <input type="text" name="zipCode" id="zipCode" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
            <input type="text" name="address" id="address" required placeholder="Ex: Av. Brasil, 123 - Sala 45" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input type="text" name="city" id="city" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
              <input type="text" name="state" id="state" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (Opcional)</label>
            <input type="text" name="phone" id="phone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-brand-accent text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors font-semibold">
              Salvar Unidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}