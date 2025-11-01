import PharmaciesPreview from "@/component/pharmacy/PharmaciesPreview";

export default function FarmaciasPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Farmacias de turno</h1>
      <PharmaciesPreview />
    </div>
  );
}
