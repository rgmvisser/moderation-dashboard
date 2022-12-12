/*
  Warnings:

  - Made the column `highestConfidenceLabel` on table `AWSModerationResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `highestConfidenceScore` on table `AWSModerationResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `averageConfidenceScore` on table `AWSModerationResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AWSModerationResult" ALTER COLUMN "highestConfidenceLabel" SET NOT NULL,
ALTER COLUMN "highestConfidenceScore" SET NOT NULL,
ALTER COLUMN "averageConfidenceScore" SET NOT NULL;
