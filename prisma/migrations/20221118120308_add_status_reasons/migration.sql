-- CreateTable
CREATE TABLE "StatusReasons" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "reasonId" TEXT NOT NULL,

    CONSTRAINT "StatusReasons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StatusReasons" ADD CONSTRAINT "StatusReasons_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE CASCADE ON UPDATE CASCADE;
