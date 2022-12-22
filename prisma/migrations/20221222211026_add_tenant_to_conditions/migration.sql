/*
  Warnings:

  - Added the required column `tenantId` to the `Condition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Condition" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
