import type { List, ListItem, ListType, Moderator } from "@prisma/client";
import { Prisma } from "@prisma/client";
import pLimit from "p-limit";

import { BaseTenantController } from "./baseController.server";

export class ListController extends BaseTenantController {
  async getListById(id: string) {
    return await this.db.list.findUnique({
      where: { id },
    });
  }

  async getAllLists() {
    return await this.db.list.findMany({
      include: {
        items: {
          select: {
            value: true,
          },
        },
      },
    });
  }

  async countItems(listId: string) {
    return await this.db.listItem.count({
      where: {
        listId,
      },
    });
  }

  async getItems({
    listId,
    page = 1,
    perPage = 20,
    orderBy = "createdAt",
    order,
    filter,
  }: {
    listId: string;
    page?: number;
    perPage?: number;
    orderBy?: keyof ListItem;
    order?: "asc" | "desc";
    filter?: string;
  }) {
    const filterQuery = filter
      ? {
          value: {
            contains: filter,
          },
        }
      : undefined;
    return await this.db.listItem.findMany({
      where: {
        listId,
        ...filterQuery,
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { [orderBy]: order },
    });
  }

  async createList(name: string, type: ListType) {
    return await this.db.list.create({
      data: {
        name,
        type,
        tenantId: this.tenant.id,
      },
    });
  }

  async changeName(list: List, name: string) {
    if (list.name === name) {
      return list;
    }
    return await this.db.list.update({
      where: { id: list.id },
      data: { name },
    });
  }

  async deleteList(id: string) {
    return await this.db.list.delete({
      where: { id },
    });
  }

  async getItem(listId: string, value: string) {
    return await this.db.listItem.findUnique({
      where: {
        listId_value: {
          listId,
          value,
        },
      },
    });
  }

  async addItem(moderator: Moderator, listId: string, value: string) {
    try {
      return await this.db.listItem.create({
        data: {
          value,
          listId,
          moderatorId: moderator.id,
          tenantId: this.tenant.id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Item already in the list
        if (error.code === "P2002") {
          return await this.getItem(listId, value);
        }
      }
      throw error;
    }
  }

  async addItems(moderator: Moderator, listId: string, values: string[]) {
    const list = await this.getItems({ listId, perPage: 100000 });
    const existingValues = new Set(list.map((item) => item.value));
    const newValues = values.filter((value) => !existingValues.has(value));
    const limit = pLimit(10);
    const updates = newValues.map((value) =>
      limit(() => this.addItem(moderator, listId, value))
    );
    return await Promise.all(updates);
  }

  async deleteItem(itemId: string) {
    return await this.db.listItem.delete({
      where: { id: itemId },
    });
  }
  async deleteItems(itemIds: string[]) {
    const limit = pLimit(10);
    const updates = itemIds.map((id) => limit(() => this.deleteItem(id)));
    return await Promise.all(updates);
  }
}
