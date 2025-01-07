/*
  Warnings:

  - Added the required column `contacts` to the `Lawyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Lawyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lawyer" ADD COLUMN     "contacts" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TEXT NOT NULL;
