export default function AuthOutletForm({
  onSubmit,
  children,
}: {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="my-10 flex flex-col gap-6">
      {children}
    </form>
  );
}
