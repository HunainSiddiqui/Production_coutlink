/*
  Warnings:

  - You are about to drop the column `accessLevel` on the `Lawyer` table. All the data in the column will be lost.
  - You are about to drop the column `clientAccessAuth` on the `Lawyer` table. All the data in the column will be lost.
  - You are about to drop the column `clientList` on the `Lawyer` table. All the data in the column will be lost.
  - You are about to drop the column `firmName` on the `Lawyer` table. All the data in the column will be lost.
  - You are about to drop the column `professionalAffiliations` on the `Lawyer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Lawyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Lawyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Lawyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lawyer" DROP COLUMN "accessLevel",
DROP COLUMN "clientAccessAuth",
DROP COLUMN "clientList",
DROP COLUMN "firmName",
DROP COLUMN "professionalAffiliations",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_email_key" ON "Lawyer"("email");
