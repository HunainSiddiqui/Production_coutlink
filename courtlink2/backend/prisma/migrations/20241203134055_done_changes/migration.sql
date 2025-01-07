-- AlterTable
ALTER TABLE "Lawyer" ALTER COLUMN "casesSolved" SET DEFAULT '0',
ALTER COLUMN "casesSolved" SET DATA TYPE TEXT,
ALTER COLUMN "specializations" SET NOT NULL,
ALTER COLUMN "specializations" SET DATA TYPE TEXT,
ALTER COLUMN "licenseVerified" SET DEFAULT '',
ALTER COLUMN "licenseVerified" SET DATA TYPE TEXT;
