/*
  Warnings:

  - You are about to drop the `StatusReasons` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('content', 'user');

-- DropForeignKey
ALTER TABLE "StatusReasons" DROP CONSTRAINT "StatusReasons_reasonId_fkey";

-- DropForeignKey
ALTER TABLE "StatusReasons" DROP CONSTRAINT "StatusReasons_tenantId_fkey";

-- DropTable
DROP TABLE "StatusReasons";

-- CreateTable
CREATE TABLE "StatusReason" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "reasonId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "StatusReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RuleType" NOT NULL,
    "tenantId" TEXT NOT NULL,
    "action" "Status" NOT NULL,
    "statusReasonId" TEXT NOT NULL,
    "terminateOnMatch" BOOLEAN NOT NULL DEFAULT false,
    "skipIfAlreadyApplied" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ruleId" TEXT NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StatusReason" ADD CONSTRAINT "StatusReason_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusReason" ADD CONSTRAINT "StatusReason_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_statusReasonId_fkey" FOREIGN KEY ("statusReasonId") REFERENCES "StatusReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condition" ADD CONSTRAINT "Condition_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
