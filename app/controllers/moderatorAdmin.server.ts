import type { Moderator, Role } from "@prisma/client";
import type { ModeratorWithTentantAndRole } from "~/models/moderator";
import { IsAdmin } from "~/models/roles";
import { ModeratorController } from "./moderator.server";

export class ModeratorAdminController extends ModeratorController {
  actor: ModeratorWithTentantAndRole;

  constructor(actor: ModeratorWithTentantAndRole) {
    super(actor.roles[0].tenant);
    this.actor = actor;

    if (!IsAdmin(this.tenant, this.actor)) {
      throw new Error("Admin access required");
    }
  }

  async deleteModerator(id: Moderator["id"]) {
    await this.db.moderatorRole.updateMany({
      where: {
        tenantId: this.tenant.id,
        moderatorId: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async updateRole(id: Moderator["id"], role: Role) {
    await this.db.moderatorRole.updateMany({
      where: {
        tenantId: this.tenant.id,
        moderatorId: id,
      },
      data: {
        role,
      },
    });
  }
}
