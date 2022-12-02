/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,value]` on the table `ListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListItem_tenantId_value_key" ON "ListItem"("tenantId", "value");
