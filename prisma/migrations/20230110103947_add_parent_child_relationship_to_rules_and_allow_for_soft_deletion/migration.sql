/*
  Warnings:

  - A unique constraint covering the columns `[parentId]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Rule_parentId_key" ON "Rule"("parentId");

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Rule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
