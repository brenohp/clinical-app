// app/settings/clinic/[unitId]/edit/page.tsx
import { PageHeader } from "@/components/layout/PageHeader";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditUnitForm } from "../../_components/EditUnitForm";

export default async function EditClinicUnitPage({
  params
}: {
  params: { unitId: string }
}) {

  const unit = await prisma.clinicUnit.findUnique({
    where: { id: params.unitId },
  });

  if (!unit) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Editar Unidade"
        description="Atualize os dados do endereço de atendimento."
        backHref="/settings/clinic"
      />

      <div className="p-4 md:p-8">
        <EditUnitForm unit={unit} />
      </div>
    </div>
  );
}