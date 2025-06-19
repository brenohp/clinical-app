// app/settings/clinic/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Building, PlusCircle, Edit } from "lucide-react"; // AJUSTE: Ícone de Edição importado
import Link from "next/link";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  clinicId?: string | null;
}

export default async function ClinicPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;

  if (!user?.clinicId) {
    return (
      <div>
        <PageHeader
          title="Gestão da Clínica"
          description="Gerencie as unidades (endereços de atendimento) da sua clínica."
          backHref="/settings"
        />
        <div className="p-4 md:p-8">
          <p>Erro: Usuário não está associado a uma clínica.</p>
        </div>
      </div>
    )
  }

  const units = await prisma.clinicUnit.findMany({
    where: {
      clinicId: user.clinicId,
    },
    orderBy: {
      name: 'asc',
    }
  });

  return (
    <div>
      <PageHeader
        title="Gestão da Clínica"
        description="Gerencie as unidades (endereços de atendimento) da sua clínica."
        backHref="/settings"
      >
        {/* AJUSTE: Botão envolvido por uma div para garantir o espaçamento */}
        <div className="ml-4 flex-shrink-0">
          <Link
            href="/settings/clinic/new"
            className="flex items-center gap-2 bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors duration-200"
          >
            <PlusCircle size={20} />
            <span className="font-medium whitespace-nowrap">Adicionar Unidade</span>
          </Link>
        </div>
      </PageHeader>

      <div className="p-4 md:p-8">
        {units.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg bg-gray-50">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma unidade encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">Comece cadastrando o primeiro endereço de atendimento.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden bg-white">
            <ul role="list" className="divide-y divide-gray-200">
              {/* AJUSTE: Mapeamento da lista agora inclui o link de edição */}
              {units.map((unit) => (
                <li key={unit.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-brand-primary">{unit.name}</p>
                    <p className="text-sm text-gray-600">{unit.address}, {unit.city} - {unit.state}</p>
                  </div>
                  <div>
                    <Link 
                      href={`/settings/clinic/${unit.id}/edit`}
                      className="flex items-center gap-2 text-brand-accent hover:text-brand-primary p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <Edit size={16} />
                      <span className="text-sm font-medium">Editar</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}