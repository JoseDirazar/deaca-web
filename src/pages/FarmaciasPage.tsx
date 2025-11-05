import PharmaciesPreview from "@/component/pharmacy/PharmaciesPreview";

export default function FarmaciasPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Farmacias de turno</h1>
      <PharmaciesPreview />
    </div>
  );
}
