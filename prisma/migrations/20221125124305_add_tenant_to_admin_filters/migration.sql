/*
  Warnings:

  - Added the required column `tenantId` to the `AdminFilters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminFilters" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AdminFilters" ADD CONSTRAINT "AdminFilters_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
