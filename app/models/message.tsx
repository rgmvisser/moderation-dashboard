import type { User, Project, Thread, Message } from "@prisma/client";

export type MessageWithInfo = Message & {
  user: User;
  project: Project;
  thread: Thread;
};

export function AreMessagesEqual(
  messages: MessageWithInfo[],
  messages2: MessageWithInfo[]
) {
  if (messages.length !== messages2.length) {
    return false;
  }

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].id !== messages2[i].id) {
      return false;
    }
  }
  return true;
}
