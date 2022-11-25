import type { Tenant, User } from "@prisma/client";
import { BaseTenantController } from "./baseController.server";

// import type { Password, User } from "@prisma/client";
// import bcrypt from "bcryptjs";

// import { prisma } from "~/db.server";

// export type { User } from "@prisma/client";

export class UserController extends BaseTenantController {
  async getUserById(tenant: Tenant, id: User["id"]) {
    return this.db.user.findUnique({ where: { id } });
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
