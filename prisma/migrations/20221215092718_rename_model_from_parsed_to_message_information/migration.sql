/*
  Warnings:

  - You are about to drop the `ParsedMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ParsedMessage" DROP CONSTRAINT "ParsedMessage_messageId_fkey";

-- DropForeignKey
ALTER TABLE "ParsedMessage" DROP CONSTRAINT "ParsedMessage_tenantId_fkey";

-- DropTable
DROP TABLE "ParsedMessage";

-- CreateTable
CREATE TABLE "MessageInformation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "normalizedText" TEXT NOT NULL,
    "qrCode" TEXT,
    "phoneNumbers" TEXT[],
    "domains" TEXT[],
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "MessageInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageInformation_messageId_key" ON "MessageInformation"("messageId");

-- AddForeignKey
ALTER TABLE "MessageInformation" ADD CONSTRAINT "MessageInformation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageInformation" ADD CONSTRAINT "MessageInformation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
