/*
  Warnings:

  - The `casesSolved` column on the `Lawyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specializations` column on the `Lawyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `licenseVerified` column on the `Lawyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Lawyer" DROP COLUMN "casesSolved",
ADD COLUMN     "casesSolved" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "specializations",
ADD COLUMN     "specializations" TEXT[],
DROP COLUMN "licenseVerified",
ADD COLUMN     "licenseVerified" BOOLEAN NOT NULL DEFAULT true;
