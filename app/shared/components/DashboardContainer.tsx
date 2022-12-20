export default function DashboardContainer({
  title,
  rightItem,
  children,
}: {
  title: string;
  children: React.ReactNode;
  rightItem?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <h1>{title}</h1>
        {rightItem}
      </div>
      <div className="flex h-full flex-col gap-4 rounded-xl border border-main bg-white p-4">
        {children}
      </div>
    </div>
  );
}
