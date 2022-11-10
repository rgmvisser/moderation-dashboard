-- CreateTable
CREATE TABLE "BacklogMessage" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "millisecondsAfterStart" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BacklogMessage_pkey" PRIMARY KEY ("id")
);
