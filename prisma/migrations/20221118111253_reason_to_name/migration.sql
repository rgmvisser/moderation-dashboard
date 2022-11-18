/*
  Warnings:

  - You are about to drop the column `reason` on the `Reason` table. All the data in the column will be lost.
  - Added the required column `name` to the `Reason` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reason" DROP COLUMN "reason",
ADD COLUMN     "name" TEXT NOT NULL;
