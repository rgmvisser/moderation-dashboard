import type {
  Action,
  Admin,
  Message,
  PrismaPromise,
  Reason,
  Status,
  Tenant,
  User,
} from "@prisma/client";
import { getTenantClient } from "~/db.server";
import { getUserMessages } from "~/models/message.server";
import pLimit from "p-limit";

export type ActionWithReasonAndExecutor = Action & {
  takenBy: Admin | null;
  reason: Reason;
};

export async function GetMessageActions(
  tenant: Tenant,
  messageId: Message["id"]
): Promise<ActionWithReasonAndExecutor[]> {
  return getTenantClient(tenant).action.findMany({
    where: { messageId },
    orderBy: { createdAt: "desc" },
    include: { takenBy: true, reason: true },
  });
}

export async function GetUserActions(
  tenant: Tenant,
  userId: User["id"]
): Promise<ActionWithReasonAndExecutor[]> {
  return getTenantClient(tenant).action.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { takenBy: true, reason: true },
  });
}

export async function UpdateStatus(
  tenant: Tenant,
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
    getTenantClient(tenant).action.create({
      data: {
        tenantId: takenBy.tenantId,
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
      getTenantClient(tenant).message.update({
        where: { id: message.id },
        data: { status },
      })
    );
  }
  if (user) {
    updates.push(
      getTenantClient(tenant).user.update({
        where: { id: user.id },
        data: { status },
      })
    );
  }

  return getTenantClient(tenant).$transaction(updates);
}

export async function UpdateMessagesStatus(
  tenant: Tenant,
  takenBy: Admin,
  status: Status,
  reasonId: Reason["id"],
  userId: User["id"],
  reasonInformation?: string
) {
  const messages = await getUserMessages(tenant, userId);
  const limit = pLimit(10);
  messages.map((m) =>
    limit(() =>
      UpdateStatus(tenant, takenBy, status, reasonId, reasonInformation, m)
    )
  );
  await Promise.all(messages);
}
