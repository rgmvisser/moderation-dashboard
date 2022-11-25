type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export const CMHeader = ({ title, children }: HeaderProps) => {
  return (
    <div className="relative box-border flex h-16 w-full items-center justify-start gap-2.5 border-t-0 border-r-0 border-b border-l-0 border-main px-2.5 py-4">
      <p className="flex-grow whitespace-pre-wrap text-left text-xl font-bold">
        {title}
      </p>
      {children}
    </div>
  );
};