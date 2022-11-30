import type { Moderator } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";
import crypto from "crypto";
import bcrypt from "bcrypt";

export class APIKeyController extends BaseTenantController {
  select = {
    id: true,
    createdAt: true,
    updatedAt: true,
    name: true,
    keyHint: true,
    createdBy: true,
  };
  async getKeys() {
    return this.db.apiKey.findMany({
      select: this.select,
    });
  }

  async createKey(moderator: Moderator, name: string) {
    const keySecret = `cm.${crypto.randomBytes(16).toString("hex")}`;
    const hashedKey = await APIKeyController.HashKey(keySecret);
    const hint = `${keySecret.slice(0, 5)}...${keySecret.slice(-3)}`;

    const key = await this.db.apiKey.create({
      data: {
        name,
        hashedKey: hashedKey,
        keyHint: hint,
        moderatorId: moderator.id,
        tenantId: this.tenant.id,
      },
      select: this.select,
    });

    return { key, keySecret };
  }

  async deleteKey(id: string) {
    await this.db.apiKey.delete({ where: { id } });
  }

  static async HashKey(keySecret: string) {
    const hashedKey = crypto
      .createHash("sha256")
      .update(keySecret)
      .digest("base64");
    return hashedKey;
  }
}
