import { getGeneralClient } from "~/db.server";
import { BaseTenantController } from "./baseController.server";
import bcrypt from "bcryptjs";
import type { Moderator, Role, Tenant } from "@prisma/client";
import type { ModeratorWithTentantAndRole } from "~/models/moderator";
import { CMError } from "~/models/error";

export class ModeratorController extends BaseTenantController {
  async getAllModerators() {
    const moderatorRoles = await this.db.moderatorRole.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        moderator: {
          include: {
            roles: {
              where: {
                tenantId: this.tenant.id,
              },
            },
          },
        },
      },
    });
    return moderatorRoles.map((r) => r.moderator);
  }

  async getModeratorWithTenantAndRole(
    id: Moderator["id"]
  ): Promise<ModeratorWithTentantAndRole | null> {
    const moderator = await this.db.moderator.findUnique({
      where: {
        id: id,
      },
      include: {
        roles: {
          include: {
            tenant: true,
          },
          where: {
            deletedAt: null,
            tenantId: this.tenant.id,
          },
        },
      },
    });
    return moderator;
  }

  async getRoleForModerator(moderator: Moderator) {
    const moderatorWithRole = await this.db.moderator.findUnique({
      where: {
        id: moderator.id,
      },
      include: {
        roles: {
          where: {
            deletedAt: null,
            tenantId: this.tenant.id,
          },
        },
      },
    });
    return moderatorWithRole?.roles[0].role;
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
    const existingModerator = await getGeneralClient().moderator.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
      },
    });
    if (existingModerator) {
      const existingRole = existingModerator.roles.find(
        (r) => r.tenantId === tenant.id && r.deletedAt === null
      );
      if (existingRole) {
        throw CMError.ModeratorAlreadyPartOfTenant;
      }
      await getGeneralClient().moderatorRole.create({
        data: {
          tenantId: tenant.id,
          moderatorId: existingModerator.id,
          role: role,
        },
      });
      return existingModerator;
    }
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

  static async FindModerator(
    email: string,
    password: string
  ): Promise<Moderator | null> {
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
    });
  }

  static async GetTenantsForModerator(moderator: Moderator) {
    const tenantRoles = await getGeneralClient().moderatorRole.findMany({
      where: {
        deletedAt: null,
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
