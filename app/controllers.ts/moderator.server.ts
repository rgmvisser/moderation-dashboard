import { getGeneralClient } from "~/db.server";
import { BaseTenantController } from "./baseController.server";
import bcrypt from "bcrypt";
import type { Moderator, Role, Tenant } from "@prisma/client";

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
      avatar: string;
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
        Authentication: {
          create: {
            provider: "EmailPassword",
            password: hashedPassword,
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
        Authentication: true,
      },
    });
    if (!moderator) return null;
    const passwordAuth = moderator.Authentication.find(
      (a) => a.provider === "EmailPassword"
    );
    if (!passwordAuth) return null;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      passwordAuth.password
    );
    if (!isPasswordCorrect) return null;

    // Return without authentication on the model
    return await getGeneralClient().moderator.findUnique({
      where: {
        id: moderator.id,
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
    return tenantRoles.map((r) => r.tenant);
  }
}
