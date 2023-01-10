/*
  Warnings:

  - You are about to drop the column `parentId` on the `Rule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_parentId_fkey";

-- DropIndex
DROP INDEX "Rule_parentId_key";

-- AlterTable
ALTER TABLE "Condition" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "parentId";
