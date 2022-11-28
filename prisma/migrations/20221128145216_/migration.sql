/*
  Warnings:

  - You are about to drop the column `password` on the `Authentication` table. All the data in the column will be lost.
  - Added the required column `hash` to the `Authentication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Authentication" DROP COLUMN "password",
ADD COLUMN     "hash" TEXT NOT NULL;
