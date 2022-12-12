-- CreateTable
CREATE TABLE "ImageOCR" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ImageOCR_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageOCR_imageId_key" ON "ImageOCR"("imageId");

-- AddForeignKey
ALTER TABLE "ImageOCR" ADD CONSTRAINT "ImageOCR_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOCR" ADD CONSTRAINT "ImageOCR_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
