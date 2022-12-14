import { TextBox } from "./TextBox";

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
    <div className="box-border flex h-fit w-full flex-col items-stretch justify-start gap-2.5  px-2 py-2">
      {contents.map((item) => {
        return (
          <div key={item.title}>
            <p className="text-xl font-bold ">{item.title}</p>
            <TextBox>{item.content}</TextBox>
          </div>
        );
      })}
    </div>
  );
};
