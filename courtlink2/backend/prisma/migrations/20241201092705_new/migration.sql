/*
  Warnings:

  - Added the required column `dateOfBirth` to the `Prisoner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prisoner" DROP COLUMN "dateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;
