import type {
  Action,
  Message,
  Moderator,
  PrismaPromise,
  Reason,
  Status,
  User,
} from "@prisma/client";

import pLimit from "p-limit";
import { BaseTenantController } from "./baseController.server";
import { MessageController } from "./message.server";

export type ActionWithReasonAndExecutor = Action & {
  takenBy: Moderator | null;
  reason: Reason;
};

export class ActionController extends BaseTenantController {
  async getMessageActions(
    messageId: Message["id"]
  ): Promise<ActionWithReasonAndExecutor[]> {
    return this.db.action.findMany({
      where: { messageId },
      orderBy: { createdAt: "desc" },
      include: { takenBy: true, reason: true },
    });
  }

  async getUserActions(
    userId: User["id"]
  ): Promise<ActionWithReasonAndExecutor[]> {
    return this.db.action.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { takenBy: true, reason: true },
    });
  }

  async updateStatus(
    takenBy: Moderator,
    status: Status,
    reasonId: Reason["id"],
    reasonInformation?: string,
    message?: Message,
    user?: User
  ) {
    const oldStatus = message?.status ?? user?.status;
    if (oldStatus === status) return;
    const updates: PrismaPromise<any>[] = [
      this.db.action.create({
        data: {
          tenantId: this.tenant.id,
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
        this.db.message.update({
          where: { id: message.id },
          data: { status },
        })
      );
    }
    if (user) {
      updates.push(
        this.db.user.update({
          where: { id: user.id },
          data: { status },
        })
      );
    }

    return this.db.$transaction(updates);
  }

  async updateMessagesStatus(
    takenBy: Moderator,
    status: Status,
    reasonId: Reason["id"],
    userId: User["id"],
    reasonInformation?: string
  ) {
    const messageController = new MessageController(this.tenant);
    const messages = await messageController.getUserMessages(userId);
    const limit = pLimit(10);
    messages.map((m) =>
      limit(() =>
        this.updateStatus(takenBy, status, reasonId, reasonInformation, m)
      )
    );
    await Promise.all(messages);
  }
}
