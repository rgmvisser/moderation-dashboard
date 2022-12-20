/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Moderator` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Moderator` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Moderator_email_deletedAt_key";

-- AlterTable
ALTER TABLE "Moderator" DROP COLUMN "deletedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_email_key" ON "Moderator"("email");
