/*
  Warnings:

  - Changed the type of `status` on the `BacklogMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `signInMethod` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AdminFilters" DROP CONSTRAINT "AdminFilters_adminId_fkey";

-- AlterTable
ALTER TABLE "BacklogMessage" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
DROP COLUMN "signInMethod",
ADD COLUMN     "signInMethod" "SignInMethod" NOT NULL;

-- CreateTable
CREATE TABLE "Reason" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminFilters" ADD CONSTRAINT "AdminFilters_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
