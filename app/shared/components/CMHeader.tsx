type HeaderProps = {
  title: string;
  image?: React.ReactNode;
  children?: React.ReactNode;
};
export const CMHeader = ({ title, image, children }: HeaderProps) => {
  return (
    <div className="relative box-border flex  w-full items-center justify-start gap-2.5 border-t-0 border-r-0 border-b border-l-0 border-main px-2 py-2">
      {image}
      <p className="flex-grow whitespace-pre-wrap text-left text-xl font-bold">
        {title}
      </p>
      {children}
    </div>
  );
};
