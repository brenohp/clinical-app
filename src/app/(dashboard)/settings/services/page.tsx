// app/(dashboard)/settings/services/page.tsx

import { getServerSession } from "next-auth";
import Link from 'next/link';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlusCircle } from "lucide-react";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.clinicId) {
    return <p className="p-4">Usuário não associado a uma clínica.</p>;
  }

  const services = await prisma.serviceType.findMany({
    where: {
      clinicId: session.user.clinicId,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Gestão de Serviços"
        description="Gerencie os tipos de consulta e procedimentos oferecidos."
        backHref="/settings"
      >
        <div className="ml-4 flex-shrink-0">
          <Link
            href="/settings/services/new"
            className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200"
          >
            <PlusCircle size={20} />
            <span className="font-medium whitespace-nowrap">Adicionar Serviço</span>
          </Link>
        </div>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-accent-light">
            <thead className="bg-brand-accent-light/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Nome do Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Duração (min)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Preço Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-accent uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-brand-accent uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-accent-light/50">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum serviço cadastrado.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-brand-accent-light/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">{service.durationMinutes} min</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-accent">
                      {service.price ? `R$ ${service.price.toFixed(2).replace('.', ',')}` : 'Não definido'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {service.isActive ? 'Ativo' : 'Inativo'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Link 
                        href={`/settings/services/${service.id}/edit`} 
                        className="text-brand-accent hover:text-brand-primary hover:underline"
                      >
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
    </div>
  );
}