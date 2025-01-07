/*
  Warnings:

  - Added the required column `additionalInfo` to the `Lawyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lawyer" ADD COLUMN     "additionalInfo" TEXT NOT NULL;
