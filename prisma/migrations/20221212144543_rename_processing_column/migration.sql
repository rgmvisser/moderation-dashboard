/*
  Warnings:

  - You are about to drop the column `duration` on the `ImageOCR` table. All the data in the column will be lost.
  - Added the required column `processTime` to the `ImageOCR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageOCR" DROP COLUMN "duration",
ADD COLUMN     "processTime" DOUBLE PRECISION NOT NULL;
