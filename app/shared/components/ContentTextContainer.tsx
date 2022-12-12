interface ContentTextContainerProps {
  contents: {
    title: string;
    content: string;
  }[];
}

export const ContentTextContainer = ({
  contents,
}: ContentTextContainerProps) => {
  return (
    <div className="box-border flex h-fit w-full flex-col items-start justify-start gap-2.5 border-t-0 border-r-0 border-b border-l-0 border-main px-2 py-2">
      {contents.map((item) => {
        return (
          <div key={item.title}>
            <p className="flex-shrink-0 flex-grow-0 self-stretch whitespace-pre-wrap text-left text-xl font-bold ">
              {item.title}
            </p>
            <p className="flex-shrink-0 flex-grow-0 self-stretch whitespace-pre-wrap text-left text-sm ">
              {item.content}
            </p>
          </div>
        );
      })}
    </div>
  );
};
