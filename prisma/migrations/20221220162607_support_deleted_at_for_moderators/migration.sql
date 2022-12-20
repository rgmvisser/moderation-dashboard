/*
  Warnings:

  - A unique constraint covering the columns `[email,deletedAt]` on the table `Moderator` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Moderator_email_key";

-- AlterTable
ALTER TABLE "Moderator" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ModeratorRole" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_email_deletedAt_key" ON "Moderator"("email", "deletedAt");
