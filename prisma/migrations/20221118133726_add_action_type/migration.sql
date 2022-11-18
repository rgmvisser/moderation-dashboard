/*
  Warnings:

  - Added the required column `type` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('ChangeStatus');

-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "type" "ActionType" NOT NULL;
