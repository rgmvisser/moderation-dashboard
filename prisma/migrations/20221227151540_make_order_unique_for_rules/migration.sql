/*
  Warnings:

  - A unique constraint covering the columns `[order,tenantId]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rule_order_tenantId_key" ON "Rule"("order", "tenantId");
