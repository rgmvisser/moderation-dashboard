import type {
  Admin,
  Message,
  PrismaPromise,
  Reason,
  Status,
  User,
} from "@prisma/client";
import { db } from "~/db.server";
import { getUserMessages } from "~/models/message.server";
import pLimit from "p-limit";

export async function UpdateStatus(
  takenBy: Admin,
  status: Status,
  reasonId: Reason["id"],
  extraInformation?: string,
  messageId?: Message["id"],
  userId?: User["id"]
) {
  const updates: PrismaPromise<any>[] = [
    db.action.create({
      data: {
        takenById: takenBy.id,
        messageId,
        userId,
        extraInformation,
        reasonId,
        type: "ChangeStatus",
      },
    }),
  ];
  if (messageId) {
    updates.push(
      db.message.update({
        where: { id: messageId },
        data: { status },
      })
    );
  }
  if (userId) {
    updates.push(
      db.user.update({
        where: { id: userId },
        data: { status },
      })
    );
  }

  return db.$transaction(updates);
}

export async function UpdateMessagesStatus(
  takenBy: Admin,
  status: Status,
  reasonId: Reason["id"],
  userId: User["id"],
  extraInformation?: string
) {
  const messages = await getUserMessages(userId);
  const limit = pLimit(10);
  messages.map((m) =>
    limit(() => UpdateStatus(takenBy, status, reasonId, extraInformation, m.id))
  );
  await Promise.all(messages);
}
