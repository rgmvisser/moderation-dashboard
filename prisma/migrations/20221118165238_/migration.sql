/*
  Warnings:

  - You are about to drop the column `action` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `extraInformation` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "action",
DROP COLUMN "extraInformation",
ADD COLUMN     "info" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "reasonInformation" TEXT;
