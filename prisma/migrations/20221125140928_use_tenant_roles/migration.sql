/*
  Warnings:

  - You are about to drop the `_ModeratorToTenant` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'moderator');

-- DropForeignKey
ALTER TABLE "_ModeratorToTenant" DROP CONSTRAINT "_ModeratorToTenant_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModeratorToTenant" DROP CONSTRAINT "_ModeratorToTenant_B_fkey";

-- DropTable
DROP TABLE "_ModeratorToTenant";

-- CreateTable
CREATE TABLE "TenantRole" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,
    "tenantId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,

    CONSTRAINT "TenantRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenantRole" ADD CONSTRAINT "TenantRole_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantRole" ADD CONSTRAINT "TenantRole_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
