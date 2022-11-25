import { BaseTenantController } from "./baseController.server";

export class TenantUserController extends BaseTenantController {
  async getAdmin() {
    return this.db.admin.findFirstOrThrow({
      include: { tenant: true },
    });
  }
}
