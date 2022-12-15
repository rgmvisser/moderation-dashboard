/*
  Warnings:

  - You are about to drop the column `normalizedText` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "normalizedText";

-- CreateTable
CREATE TABLE "ParsedMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "normalizedText" TEXT NOT NULL,
    "qrCode" TEXT,
    "phoneNumbers" TEXT[],
    "domains" TEXT[],
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ParsedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParsedMessage_messageId_key" ON "ParsedMessage"("messageId");

-- AddForeignKey
ALTER TABLE "ParsedMessage" ADD CONSTRAINT "ParsedMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParsedMessage" ADD CONSTRAINT "ParsedMessage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
