-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Prisoner', 'Lawyer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Prisoner';
