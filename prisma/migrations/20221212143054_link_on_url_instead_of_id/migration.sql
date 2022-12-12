/*
  Warnings:

  - You are about to drop the column `imageId` on the `ImageOCR` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `ImageOCR` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `ImageOCR` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageOCR" DROP CONSTRAINT "ImageOCR_imageId_fkey";

-- DropIndex
DROP INDEX "ImageOCR_imageId_key";

-- AlterTable
ALTER TABLE "ImageOCR" DROP COLUMN "imageId",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ImageOCR_url_key" ON "ImageOCR"("url");

-- AddForeignKey
ALTER TABLE "ImageOCR" ADD CONSTRAINT "ImageOCR_url_fkey" FOREIGN KEY ("url") REFERENCES "Image"("url") ON DELETE RESTRICT ON UPDATE CASCADE;
