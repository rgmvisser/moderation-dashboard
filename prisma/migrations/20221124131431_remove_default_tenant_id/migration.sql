-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Reason" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StatusReasons" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "tenantId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "tenantId" DROP DEFAULT;
