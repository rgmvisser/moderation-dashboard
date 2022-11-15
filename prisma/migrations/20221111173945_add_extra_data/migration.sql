/*
  Warnings:

  - Added the required column `projectId` to the `BacklogMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `BacklogMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `BacklogMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signInMethod` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('allowed', 'flagged', 'hidden');

-- CreateEnum
CREATE TYPE "SignInMethod" AS ENUM ('email', 'google', 'facebook');

-- AlterTable
ALTER TABLE "BacklogMessage" ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "threadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "threadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "signInMethod" "SignInMethod" NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
