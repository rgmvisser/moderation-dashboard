/*
  Warnings:

  - You are about to drop the column `statusReasonId` on the `Rule` table. All the data in the column will be lost.
  - You are about to drop the `StatusReason` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action` to the `Rule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reasonId` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rule" DROP CONSTRAINT "Rule_statusReasonId_fkey";

-- DropForeignKey
ALTER TABLE "StatusReason" DROP CONSTRAINT "StatusReason_reasonId_fkey";

-- DropForeignKey
ALTER TABLE "StatusReason" DROP CONSTRAINT "StatusReason_tenantId_fkey";

-- AlterTable
ALTER TABLE "Reason" ADD COLUMN     "statuses" "Status"[];

-- AlterTable
ALTER TABLE "Rule" DROP COLUMN "statusReasonId",
ADD COLUMN     "action" "Status" NOT NULL,
ADD COLUMN     "reasonId" TEXT NOT NULL;

-- DropTable
DROP TABLE "StatusReason";

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
