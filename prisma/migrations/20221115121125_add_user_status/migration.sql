/*
  Warnings:

  - Changed the type of `status` on the `BacklogMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `signInMethod` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BacklogMessage" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL,
DROP COLUMN "signInMethod",
ADD COLUMN     "signInMethod" "SignInMethod" NOT NULL;
