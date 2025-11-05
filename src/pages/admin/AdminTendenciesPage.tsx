import Button from "@/component/ui/Button";
import Input from "@/component/ui/Input";
import { establishmentService } from "@/api/establishment-service";
import { useQuery } from "@tanstack/react-query";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { useMemo, useState } from "react";
import { useTendencyApi } from "@/hooks/useTendencyApi.hook";
import PageHeader from "@/component/PageHeader";

export default function AdminTendenciesPage() {
  const { data: estResp } = useQuery({
    queryKey: ["establishments", { limit: 1000 }],
    queryFn: () =>
      establishmentService
        .getEstablishments("?limit=1000&page=1")
        .then((r) => r.data),
  });
  const establishments: Establishment[] = useMemo(
    () => estResp?.data ?? [],
    [estResp],
  );

  const {
    useListTendencies,
    useCreateOrUpdateTendency,
    useReorderTendencies,
    useRemoveTendency,
  } = useTendencyApi();
  const { data: tendenciesResp } = useListTendencies;
  const tendencies = tendenciesResp?.data ?? [];

  const [draft, setDraft] = useState<{ id: string; position: number }[]>([]);

  const onChangePosition = (id: string, position: number) => {
    setDraft((prev) => {
      const next = [...prev];
      const idx = next.findIndex((i) => i.id === id);
      if (idx >= 0) next[idx].position = position;
      else next.push({ id, position });
      return next;
    });
  };

  const applyReorder = () => {
    if (!draft.length) return console.error("NO");
    useReorderTendencies.mutate(draft);
    setDraft([]);
  };

  const [selectedEstablishment, setSelectedEstablishment] =
    useState<string>("");
  const [newPosition, setNewPosition] = useState<number>(tendencies.length + 1);

  const addTendency = () => {
    if (!selectedEstablishment || !newPosition) return;
    useCreateOrUpdateTendency.mutate({
      establishmentId: selectedEstablishment,
      position: newPosition,
    });
    setSelectedEstablishment("");
    setNewPosition((tendencies.length || 0) + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tendencias"
        description="Elegí qué emprendimientos aparecen y su orden"
        subdescription="Selecciona para agregar un emprendimiento o actualizarlo. Configura el listado seleccionando la posición de los emprendimientos/locales"
      />

      <div className="flex flex-col gap-3 rounded border border-gray-300 p-3 shadow-lg">
        <h3 className="text-lg font-semibold">Agregar/Actualizar</h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <select
            value={selectedEstablishment}
            onChange={(e) => setSelectedEstablishment(e.target.value)}
            className="rounded border border-gray-300 p-2"
          >
            <option value="">Seleccionar emprendimiento</option>
            {establishments.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <Input
            id="admin-select-tendency-position"
            type="number"
            value={newPosition}
            onChange={(e) => setNewPosition(Number(e.target.value))}
            title="Posición"
          />
          <Button onClick={addTendency} label="Guardar" />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded border border-gray-300 p-3 shadow-lg">
        <h3 className="text-lg font-semibold">Listado actual</h3>
        <div className="flex flex-col gap-4">
          {tendencies.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-2 rounded border border-gray-300 p-2 text-center shadow-md"
            >
              <div className="min-w-6 text-sm">#{t.position}</div>
              <div className="w-full">{t.establishment.name}</div>
              <Input
                title="Cambiar posición"
                id="change-tendency-position"
                className=""
                type="number"
                value={draft.find((d) => d.id === t.id)?.position ?? t.position}
                onChange={(e) => onChangePosition(t.id, Number(e.target.value))}
              />
              <Button
                onClick={() => useRemoveTendency.mutate(t.id)}
                label="Quitar"
              />
            </div>
          ))}
        </div>
        <div>
          <Button label="Aplicar cambios" onClick={applyReorder}></Button>
        </div>
      </div>
    </div>
  );
}
