/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Moderator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Moderator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Moderator" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_email_key" ON "Moderator"("email");
