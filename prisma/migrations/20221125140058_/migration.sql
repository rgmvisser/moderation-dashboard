/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminFilters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_takenById_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "AdminFilters" DROP CONSTRAINT "AdminFilters_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminFilters" DROP CONSTRAINT "AdminFilters_tenantId_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "AdminFilters";

-- CreateTable
CREATE TABLE "Moderator" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Moderator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeratorFilters" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projects" TEXT NOT NULL,
    "threads" TEXT NOT NULL,
    "statuses" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ModeratorFilters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModeratorToTenant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ModeratorFilters_moderatorId_key" ON "ModeratorFilters"("moderatorId");

-- CreateIndex
CREATE UNIQUE INDEX "_ModeratorToTenant_AB_unique" ON "_ModeratorToTenant"("A", "B");

-- CreateIndex
CREATE INDEX "_ModeratorToTenant_B_index" ON "_ModeratorToTenant"("B");

-- AddForeignKey
ALTER TABLE "ModeratorFilters" ADD CONSTRAINT "ModeratorFilters_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorFilters" ADD CONSTRAINT "ModeratorFilters_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "Moderator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModeratorToTenant" ADD CONSTRAINT "_ModeratorToTenant_A_fkey" FOREIGN KEY ("A") REFERENCES "Moderator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModeratorToTenant" ADD CONSTRAINT "_ModeratorToTenant_B_fkey" FOREIGN KEY ("B") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
