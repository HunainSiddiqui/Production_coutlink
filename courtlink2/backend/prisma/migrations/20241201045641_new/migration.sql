/*
  Warnings:

  - Added the required column `additionalInfo` to the `Prisoner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prisoner" ADD COLUMN     "additionalInfo" TEXT NOT NULL;
