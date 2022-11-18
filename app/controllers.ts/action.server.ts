import type {
  Action,
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

export type ActionWithReasonAndExecutor = Action & {
  takenBy: Admin | null;
  reason: Reason;
};

export async function GetMessageActions(
  messageId: Message["id"]
): Promise<ActionWithReasonAndExecutor[]> {
  return db.action.findMany({
    where: { messageId },
    orderBy: { createdAt: "desc" },
    include: { takenBy: true, reason: true },
  });
}

export async function GetUserActions(
  userId: User["id"]
): Promise<ActionWithReasonAndExecutor[]> {
  return db.action.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { takenBy: true, reason: true },
  });
}

export async function UpdateStatus(
  takenBy: Admin,
  status: Status,
  reasonId: Reason["id"],
  reasonInformation?: string,
  message?: Message,
  user?: User
) {
  const oldStatus = message?.status ?? user?.status;
  if (oldStatus === status) return;
  const updates: PrismaPromise<any>[] = [
    db.action.create({
      data: {
        takenById: takenBy.id,
        messageId: message?.id,
        userId: user?.id,
        reasonInformation,
        reasonId,
        type: "ChangeStatus",
        info: { toStatus: status, fromStatus: oldStatus },
      },
    }),
  ];
  if (message) {
    updates.push(
      db.message.update({
        where: { id: message.id },
        data: { status },
      })
    );
  }
  if (user) {
    updates.push(
      db.user.update({
        where: { id: user.id },
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
  reasonInformation?: string
) {
  const messages = await getUserMessages(userId);
  const limit = pLimit(10);
  messages.map((m) =>
    limit(() => UpdateStatus(takenBy, status, reasonId, reasonInformation, m))
  );
  await Promise.all(messages);
}
