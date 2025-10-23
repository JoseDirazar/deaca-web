export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 font-century-gothic text-wrap">
      <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
      <p className="text-xl text-gray-500">{description}</p>
    </div>
  );
}
