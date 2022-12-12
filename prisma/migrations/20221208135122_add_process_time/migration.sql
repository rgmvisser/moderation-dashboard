/*
  Warnings:

  - You are about to drop the column `result` on the `AWSModerationResult` table. All the data in the column will be lost.
  - Added the required column `processTime` to the `AWSModerationResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AWSModerationResult" DROP COLUMN "result",
ADD COLUMN     "processTime" DOUBLE PRECISION NOT NULL;
