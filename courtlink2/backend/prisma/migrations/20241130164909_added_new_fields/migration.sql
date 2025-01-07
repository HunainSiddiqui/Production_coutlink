/*
  Warnings:

  - You are about to drop the column `caseIdOrNumber` on the `Prisoner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Prisoner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caseId]` on the table `Prisoner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caseId` to the `Prisoner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Prisoner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalInfo` to the `Prisoner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Prisoner` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Prisoner_caseIdOrNumber_key";

-- AlterTable
ALTER TABLE "Prisoner" DROP COLUMN "caseIdOrNumber",
ADD COLUMN     "caseId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "medicalInfo" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Prisoner_email_key" ON "Prisoner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prisoner_caseId_key" ON "Prisoner"("caseId");
