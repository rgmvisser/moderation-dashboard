import type {
  Action,
  Content,
  Moderator,
  PrismaPromise,
  Reason,
  Status,
  User,
} from "@prisma/client";

import pLimit from "p-limit";
import { BaseTenantController } from "./baseController.server";
import { ContentController } from "./content.server";

export type ActionWithReasonAndExecutor = Action & {
  takenBy: Moderator | null;
  reason: Reason;
};

export class ActionController extends BaseTenantController {
  async getContentActions(
    contentId: Content["id"]
  ): Promise<ActionWithReasonAndExecutor[]> {
    return this.db.action.findMany({
      where: { contentId },
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
    content?: Content,
    user?: User
  ) {
    const oldStatus = content?.status ?? user?.status;
    if (oldStatus === status) return;
    const updates: PrismaPromise<any>[] = [
      this.db.action.create({
        data: {
          tenantId: this.tenant.id,
          takenById: takenBy.id,
          contentId: content?.id,
          userId: user?.id,
          reasonInformation,
          reasonId,
          type: "ChangeStatus",
          info: { toStatus: status, fromStatus: oldStatus },
        },
      }),
    ];
    if (content) {
      updates.push(
        this.db.content.update({
          where: { id: content.id },
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

  async updateContentsStatus(
    takenBy: Moderator,
    status: Status,
    reasonId: Reason["id"],
    userId: User["id"],
    reasonInformation?: string
  ) {
    const contentController = new ContentController(this.tenant);
    const contents = await contentController.getUserContents(userId);
    const limit = pLimit(10);
    const updates = contents.map((m) =>
      limit(() =>
        this.updateStatus(takenBy, status, reasonId, reasonInformation, m)
      )
    );
    await Promise.all(updates);
  }
}
