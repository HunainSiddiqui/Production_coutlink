-- AlterTable
ALTER TABLE "Prisoner" ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "prisonerId" INTEGER NOT NULL,
    "lawyerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "hearingDates" TIMESTAMP(3)[],
    "documents" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_prisonerId_fkey" FOREIGN KEY ("prisonerId") REFERENCES "Prisoner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
