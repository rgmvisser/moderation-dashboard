/*
  Warnings:

  - You are about to drop the column `threadId` on the `BacklogMessage` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `threads` on the `ModeratorFilters` table. All the data in the column will be lost.
  - Added the required column `topicId` to the `BacklogMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topics` to the `ModeratorFilters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_threadId_fkey";

-- AlterTable
ALTER TABLE "BacklogMessage" DROP COLUMN "threadId",
ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "threadId",
ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ModeratorFilters" DROP COLUMN "threads",
ADD COLUMN     "topics" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
