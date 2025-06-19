// app/(dashboard)/settings/clinic/[unitId]/edit/_components/EditUnitForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { updateClinicUnit } from '../_actions/clinic-actions'; 
import { DeleteUnitButton } from '../_components/DeleteUnitButton'; 
import type { ClinicUnit } from '@prisma/client';

// ... resto do componente sem alterações ...
export function EditUnitForm({ unit }: { unit: ClinicUnit }) {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await updateClinicUnit(unit.id, formData);

    if (result.success) {
      toast.success(result.message);
      router.push('/settings/clinic');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 bg-white p-8 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Unidade</label>
        <input type="text" name="name" id="name" required defaultValue={unit.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
      </div>
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">CEP</label>
        <input type="text" name="zipCode" id="zipCode" required defaultValue={unit.zipCode} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
        <input type="text" name="address" id="address" required defaultValue={unit.address} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
          <input type="text" name="city" id="city" required defaultValue={unit.city} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
          <input type="text" name="state" id="state" required defaultValue={unit.state} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone (Opcional)</label>
        <input type="text" name="phone" id="phone" defaultValue={unit.phone || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
      </div>

      <div className="flex justify-between items-center pt-4">
        <div>
          <DeleteUnitButton unitId={unit.id} />
        </div>
        <button
          type="submit"
          className="bg-brand-accent text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors font-semibold"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  )
}