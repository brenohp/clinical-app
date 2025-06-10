// app/(dashboard)/patients/page.tsx

import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-primary">Lista de Pacientes</h1>
        <Link
          href="/patients/new"
          className="bg-brand-accent text-white py-2 px-4 rounded-md shadow-sm hover:brightness-95"
        >
          Cadastrar Novo Paciente
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-brand-accent-light">
          <thead className="bg-brand-accent-light/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">CPF</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Data de Nasc.</th>
              {/* NOVA COLUNA DE AÇÕES */}
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
                  {/* NOVO LINK DE EDIÇÃO */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/patients/${patient.id}/edit`} className="text-brand-accent hover:text-brand-primary hover:underline">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}