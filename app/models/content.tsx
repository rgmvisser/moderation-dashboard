import type {
  User,
  Project,
  Topic,
  Content,
  Message,
  Image,
  TextInformation,
  ImageOCR,
} from "@prisma/client";

export type ContentWithInfo = Content & {
  user: User;
  project: Project;
  topic: Topic;
  message: Message | null;
  image: Image | null;
};

export type ContentWithDetailedInfo = ContentWithInfo & {
  message: (Message & { textInformation: TextInformation | null }) | null;
  image:
    | (Image & {
        ocr:
          | (ImageOCR & { imageTextInformation: TextInformation | null })
          | null;
      })
    | null;
};

export type MessageOrImage = Content & {
  message: Message | null;
  image: Image | null;
};

export type ImageContent = Content & { image: Image };

export function AreContentsEqual(
  contents: ContentWithInfo[],
  contents2: ContentWithInfo[]
) {
  if (contents.length !== contents2.length) {
    return false;
  }

  for (let i = 0; i < contents.length; i++) {
    if (contents[i].id !== contents2[i].id) {
      return false;
    }
  }
  return true;
}
