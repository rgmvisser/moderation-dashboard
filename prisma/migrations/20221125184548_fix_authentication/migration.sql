/*
  Warnings:

  - You are about to drop the column `email` on the `Moderator` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Moderator` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CMAuthenticationMethod" AS ENUM ('EmailPassword');

-- DropIndex
DROP INDEX "Moderator_email_key";

-- AlterTable
ALTER TABLE "Moderator" DROP COLUMN "email",
DROP COLUMN "password";

-- CreateTable
CREATE TABLE "Authentication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" "CMAuthenticationMethod" NOT NULL,
    "password" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,

    CONSTRAINT "Authentication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Authentication" ADD CONSTRAINT "Authentication_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
