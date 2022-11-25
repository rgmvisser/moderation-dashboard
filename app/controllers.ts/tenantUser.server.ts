import { BaseTenantController } from "./baseController.server";

export class ModeratorController extends BaseTenantController {
  async getModerator() {
    return this.db.moderator.findFirstOrThrow({
      include: {
        roles: {
          include: {
            tenant: true,
          },
        },
      },
    });
  }
}
