/*
  Warnings:

  - Added the required column `labelNames` to the `AWSModerationResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AWSModerationResult" ADD COLUMN     "labelNames" JSONB NOT NULL;
