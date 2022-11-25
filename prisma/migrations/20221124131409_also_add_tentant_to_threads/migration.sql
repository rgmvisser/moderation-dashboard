-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
