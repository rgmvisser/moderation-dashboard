/*
  Warnings:

  - A unique constraint covering the columns `[listId,value]` on the table `ListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ListItem_tenantId_value_key";

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_listId_value_key" ON "ListItem"("listId", "value");
