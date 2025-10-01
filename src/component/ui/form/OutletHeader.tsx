export default function OutletHeader({
  title,
  description,
  details,
}: {
  title: string;
  description: string;
  details?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <p className="text-3xl font-semibold text-primary">{title}</p>
      <p className="text-gray-600">{description}</p>
      {details && <p className="text-gray-600">{details}</p>}
    </div>
  );
}
