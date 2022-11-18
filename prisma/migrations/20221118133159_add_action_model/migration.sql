-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "reasonId" TEXT NOT NULL,
    "extraInformation" TEXT NOT NULL,
    "takenById" TEXT,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
