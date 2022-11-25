-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AlterTable
ALTER TABLE "Reason" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AlterTable
ALTER TABLE "StatusReasons" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'clav3a5nu00003b6pgd80bpbt';

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reason" ADD CONSTRAINT "Reason_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusReasons" ADD CONSTRAINT "StatusReasons_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
