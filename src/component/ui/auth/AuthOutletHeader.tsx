export default function AuthOutletHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <p className="text-3xl font-semibold text-primary">{title}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
