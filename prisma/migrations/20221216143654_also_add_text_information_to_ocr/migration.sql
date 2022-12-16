/*
  Warnings:

  - You are about to drop the `MessageInformation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageInformation" DROP CONSTRAINT "MessageInformation_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageInformation" DROP CONSTRAINT "MessageInformation_tenantId_fkey";

-- DropTable
DROP TABLE "MessageInformation";

-- CreateTable
CREATE TABLE "TextInformation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT,
    "ocrId" TEXT,
    "normalizedText" TEXT NOT NULL,
    "qrCode" TEXT,
    "phoneNumbers" TEXT[],
    "domains" TEXT[],
    "emails" TEXT[],
    "mentions" TEXT[],
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "TextInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TextInformation_messageId_key" ON "TextInformation"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "TextInformation_ocrId_key" ON "TextInformation"("ocrId");

-- AddForeignKey
ALTER TABLE "TextInformation" ADD CONSTRAINT "TextInformation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextInformation" ADD CONSTRAINT "TextInformation_ocrId_fkey" FOREIGN KEY ("ocrId") REFERENCES "ImageOCR"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextInformation" ADD CONSTRAINT "TextInformation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
