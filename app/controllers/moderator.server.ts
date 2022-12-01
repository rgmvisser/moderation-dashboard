import { getGeneralClient } from "~/db.server";
import { BaseTenantController } from "./baseController.server";
import bcrypt from "bcryptjs";
import type { Moderator, Role, Tenant } from "@prisma/client";

const includeTentant = {
  roles: {
    include: {
      tenant: true,
    },
  },
};

export class ModeratorController extends BaseTenantController {
  async getAllModerators() {
    const moderatorRoles = await this.db.moderatorRole.findMany({
      include: {
        moderator: true,
      },
    });
    return moderatorRoles.map((r) => r.moderator);
  }

  static async CreateModerator(
    tenant: Tenant,
    {
      name,
      email,
      password,
      avatar,
      role,
    }: {
      name: string;
      email: string;
      password: string;
      avatar?: string;
      role: Role;
    }
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return await getGeneralClient().moderator.create({
      data: {
        name: name,
        email: email,
        avatar: avatar,
        authentication: {
          create: {
            provider: "EmailPassword",
            hash: hashedPassword,
          },
        },
        roles: {
          create: {
            tenantId: tenant.id,
            role: role,
          },
        },
      },
    });
  }

  static async FindModerator(email: string, password: string) {
    const moderator = await getGeneralClient().moderator.findUnique({
      where: {
        email,
      },
      include: {
        authentication: true,
      },
    });
    if (!moderator) return null;
    const passwordAuth = moderator.authentication.find(
      (a) => a.provider === "EmailPassword"
    );
    if (!passwordAuth) return null;
    const isPasswordCorrect = await bcrypt.compare(password, passwordAuth.hash);
    if (!isPasswordCorrect) return null;

    // Return without authentication on the model
    return await getGeneralClient().moderator.findUnique({
      where: {
        id: moderator.id,
      },
      include: {
        ...includeTentant,
      },
    });
  }

  static async GetTenantsForModerator(moderator: Moderator) {
    const tenantRoles = await getGeneralClient().moderatorRole.findMany({
      where: {
        moderatorId: moderator.id,
      },
      include: {
        tenant: true,
      },
    });
    const tenants = tenantRoles.map((r) => r.tenant);
    return tenants;
  }
}
