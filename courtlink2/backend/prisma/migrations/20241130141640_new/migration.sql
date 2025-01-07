/*
  Warnings:

  - A unique constraint covering the columns `[userid]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Lawyer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Prisoner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userid` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Lawyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Prisoner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "userid" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Lawyer" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Prisoner" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_userid_key" ON "Applicant"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_userId_key" ON "Lawyer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Prisoner_userId_key" ON "Prisoner"("userId");

-- AddForeignKey
ALTER TABLE "Prisoner" ADD CONSTRAINT "Prisoner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lawyer" ADD CONSTRAINT "Lawyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
