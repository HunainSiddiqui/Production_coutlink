/*
  Warnings:

  - You are about to drop the `Case` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Accept', 'Reject', 'Pending');

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_lawyerId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_prisonerId_fkey";

-- AlterTable
ALTER TABLE "ContactRequest" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Pending';

-- DropTable
DROP TABLE "Case";
