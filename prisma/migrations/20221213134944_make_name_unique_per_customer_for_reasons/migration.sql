/*
  Warnings:

  - A unique constraint covering the columns `[name,tenantId]` on the table `Reason` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reason_name_tenantId_key" ON "Reason"("name", "tenantId");
