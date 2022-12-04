import type { SignInMethod, Status, User } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";
import type { Config } from "unique-names-generator";
import { uniqueNamesGenerator, names } from "unique-names-generator";

export class UserController extends BaseTenantController {
  async getUserById(id: User["id"]) {
    return this.db.user.findUnique({ where: { id } });
  }

  async getUserByExternalId(externalId: User["externalId"]) {
    return this.db.user.findUnique({ where: { externalId } });
  }

  async getUsers({
    page = 1,
    perPage = 20,
    orderBy = "createdAt",
    order,
  }: {
    page?: number;
    perPage?: number;
    orderBy?: keyof User;
    order?: "asc" | "desc";
  }) {
    return this.db.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { [orderBy]: order },
    });
  }

  async getAllUsersCount() {
    return this.db.user.count();
  }

  async upsertUser({
    externalId,
    name,
    createdAt,
    signInMethod,
    status,
    location,
    emailDomain,
    profileImageURL,
  }: {
    externalId: string;
    name: string;
    createdAt: Date;
    signInMethod: SignInMethod;
    status?: Status;
    location?: string;
    emailDomain?: string;
    profileImageURL?: string;
  }) {
    // Note: upsert is only done natively if it satisfies these conditions:
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
    return this.db.user.upsert({
      where: {
        externalId,
      },
      create: {
        externalId,
        createdAt,
        name,
        signInMethod,
        status: status ?? "allowed",
        location: location ?? "unkown",
        emailDomain,
        profileImageURL,
        tenantId: this.tenant.id,
      },
      update: {
        name,
        signInMethod,
        status,
        location,
        emailDomain,
        profileImageURL,
      },
    });
  }

  async updateUser({
    user,
    name,
    signInMethod,
    status,
    location,
    emailDomain,
    profileImageURL,
  }: {
    user: User;
    name?: string;
    signInMethod?: SignInMethod;
    status?: Status;
    location?: string;
    emailDomain?: string;
    profileImageURL?: string;
  }) {
    const updates: Partial<User> = {};
    if (name && name !== user.name) {
      updates.name = user.name;
    }
    if (signInMethod && signInMethod !== user.signInMethod) {
      updates.signInMethod = user.signInMethod;
    }
    if (status && status !== user.status) {
      updates.status = user.status;
    }
    if (location && location !== user.location) {
      updates.location = user.location;
    }
    if (emailDomain && emailDomain !== user.emailDomain) {
      updates.emailDomain = user.emailDomain;
    }
    if (profileImageURL && profileImageURL !== user.profileImageURL) {
      updates.profileImageURL = user.profileImageURL;
    }
    if (Object.keys(updates).length === 0) {
      return user;
    }
    return this.db.user.update({
      where: {
        id: user.id,
      },
      data: updates,
    });
  }

  static RandomName() {
    const nameConfig: Config = {
      dictionaries: [names],
    };
    return uniqueNamesGenerator(nameConfig);
  }
}

// export async function getUserByEmail(email: User["email"]) {
//   return prisma.user.findUnique({ where: { email } });
// }

// export async function createUser(email: User["email"], password: string) {
//   const hashedPassword = await bcrypt.hash(password, 10);

//   return prisma.user.create({
//     data: {
//       email,
//       password: {
//         create: {
//           hash: hashedPassword,
//         },
//       },
//     },
//   });
// }

// export async function deleteUserByEmail(email: User["email"]) {
//   return prisma.user.delete({ where: { email } });
// }

// export async function verifyLogin(
//   email: User["email"],
//   password: Password["hash"]
// ) {
//   const userWithPassword = await prisma.user.findUnique({
//     where: { email },
//     include: {
//       password: true,
//     },
//   });

//   if (!userWithPassword || !userWithPassword.password) {
//     return null;
//   }

//   const isValid = await bcrypt.compare(
//     password,
//     userWithPassword.password.hash
//   );

//   if (!isValid) {
//     return null;
//   }

//   const { password: _password, ...userWithoutPassword } = userWithPassword;

//   return userWithoutPassword;
// }
