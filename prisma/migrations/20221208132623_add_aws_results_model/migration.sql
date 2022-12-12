/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AWSModerationResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "highestConfidenceLabel" TEXT,
    "highestConfidenceScore" DOUBLE PRECISION NOT NULL,
    "labels" JSONB NOT NULL,
    "averageConfidenceScore" DOUBLE PRECISION NOT NULL,
    "result" JSONB NOT NULL,

    CONSTRAINT "AWSModerationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AWSModerationResult_url_key" ON "AWSModerationResult"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");

-- AddForeignKey
ALTER TABLE "AWSModerationResult" ADD CONSTRAINT "AWSModerationResult_url_fkey" FOREIGN KEY ("url") REFERENCES "Image"("url") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AWSModerationResult" ADD CONSTRAINT "AWSModerationResult_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
