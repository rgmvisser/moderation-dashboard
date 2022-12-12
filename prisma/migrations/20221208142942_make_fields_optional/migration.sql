-- AlterTable
ALTER TABLE "AWSModerationResult" ALTER COLUMN "highestConfidenceScore" DROP NOT NULL,
ALTER COLUMN "averageConfidenceScore" DROP NOT NULL;
