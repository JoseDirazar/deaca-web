export default function OutletForm({
  onSubmit,
  children,
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {children}
    </form>
  );
}
