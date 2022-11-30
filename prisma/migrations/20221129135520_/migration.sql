/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `Topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SignInMethod" ADD VALUE 'apple';
ALTER TYPE "SignInMethod" ADD VALUE 'unknown';
ALTER TYPE "SignInMethod" ADD VALUE 'phone';

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailDomain" TEXT,
ADD COLUMN     "externalId" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_contentId_key" ON "Message"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_contentId_key" ON "Image"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_externalId_key" ON "Content"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_externalId_key" ON "Project"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_externalId_key" ON "Topic"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
