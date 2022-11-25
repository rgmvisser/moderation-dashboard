/*
  Warnings:

  - You are about to drop the `TenantRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TenantRole" DROP CONSTRAINT "TenantRole_moderatorId_fkey";

-- DropForeignKey
ALTER TABLE "TenantRole" DROP CONSTRAINT "TenantRole_tenantId_fkey";

-- DropTable
DROP TABLE "TenantRole";

-- CreateTable
CREATE TABLE "ModeratorRole" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,
    "tenantId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,

    CONSTRAINT "ModeratorRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModeratorRole" ADD CONSTRAINT "ModeratorRole_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorRole" ADD CONSTRAINT "ModeratorRole_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
