// app/(dashboard)/patients/page.tsx

import prisma from '@/lib/prisma'; 
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlusCircle, Edit } from 'lucide-react';

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Lista de Pacientes"
        description="Gerencie todos os pacientes cadastrados no sistema."
      >
        <div className="ml-4 flex-shrink-0">
            <Link
                href="/patients/new"
                className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200"
            >
                <PlusCircle size={20} />
                <span className="font-medium whitespace-nowrap">Cadastrar Paciente</span>
            </Link>
        </div>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          {/* AJUSTE: Adicionada a classe table-fixed */}
          <table className="min-w-full divide-y divide-brand-accent-light table-fixed">
            <thead className="bg-brand-accent-light/30">
              <tr>
                {/* AJUSTE: Adicionadas larguras explícitas para cada coluna */}
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider w-1/3">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider w-1/4">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider w-1/5">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider w-1/5">Data de Nasc.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-brand-accent uppercase tracking-wider w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-accent-light/50">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum paciente cadastrado.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-brand-accent-light/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary truncate">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{patient.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{patient.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">
                      {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end">
                        <Link 
                          href={`/patients/${patient.id}/edit`} 
                          className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-primary p-2 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <Edit size={16} />
                          <span>Editar</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}