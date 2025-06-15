// app/(dashboard)/patients/page.tsx

import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { DeleteButton } from './_components/DeleteButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlusCircle } from 'lucide-react';

const prisma = new PrismaClient();

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
        <Link
          href="/patients/new"
          className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200"
        >
          <PlusCircle size={20} />
          {/* A classe whitespace-nowrap é adicionada aqui para garantir que o texto não quebre */}
          <span className="font-medium whitespace-nowrap">Cadastrar Paciente</span>
        </Link>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-accent-light">
            <thead className="bg-brand-accent-light/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">CPF</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Data de Nasc.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Ações</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{patient.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{patient.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">
                      {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/patients/${patient.id}/edit`} className="text-brand-accent hover:text-brand-primary hover:underline">
                        Editar
                      </Link>
                      <DeleteButton patientId={patient.id} />
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