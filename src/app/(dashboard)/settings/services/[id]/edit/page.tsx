// app/(dashboard)/settings/services/[id]/edit/page.tsx

import { PageHeader } from "@/components/layout/PageHeader";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditServiceForm } from "./_components/EditServiceForm";

export default async function EditServicePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  
  const service = await prisma.serviceType.findUnique({
    where: { id: params.id },
  });

  if (!service) {
    notFound();
  }

  // AJUSTE: Criamos um objeto "simples" com dados serializáveis
  const plainService = {
    ...service,
    // Convertemos o Decimal para um número (ou null se não existir)
    price: service.price ? service.price.toNumber() : null,
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Editar Serviço"
        description={`Você está editando o serviço: "${service.name}"`}
        backHref="/settings/services"
      />
      {/* Passamos o objeto simples para o formulário de cliente */}
      <EditServiceForm service={plainService} />
    </div>
  );
}