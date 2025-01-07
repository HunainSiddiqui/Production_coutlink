-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prisoner" (
    "id" SERIAL NOT NULL,
    "prisonerId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "prisonLocation" TEXT NOT NULL,
    "crime" TEXT NOT NULL,
    "securityQuestion" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "inmateStatus" TEXT NOT NULL,
    "caseIdOrNumber" TEXT NOT NULL,
    "languagePreference" TEXT NOT NULL,

    CONSTRAINT "Prisoner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lawyer" (
    "id" SERIAL NOT NULL,
    "barRegistrationNumber" TEXT NOT NULL,
    "firmName" TEXT NOT NULL,
    "clientAccessAuth" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" TEXT NOT NULL,
    "casesSolved" INTEGER NOT NULL DEFAULT 0,
    "specializations" TEXT[],
    "licenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "clientList" TEXT[],
    "availability" TEXT NOT NULL,
    "professionalAffiliations" TEXT[],

    CONSTRAINT "Lawyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrisonerLawyer" (
    "id" SERIAL NOT NULL,
    "prisonerId" INTEGER NOT NULL,
    "lawyerId" INTEGER NOT NULL,
    "relationshipStatus" TEXT NOT NULL,
    "appointmentHistory" TEXT[],
    "caseStatus" TEXT NOT NULL,

    CONSTRAINT "PrisonerLawyer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prisoner_prisonerId_key" ON "Prisoner"("prisonerId");

-- CreateIndex
CREATE UNIQUE INDEX "Prisoner_caseIdOrNumber_key" ON "Prisoner"("caseIdOrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_barRegistrationNumber_key" ON "Lawyer"("barRegistrationNumber");

-- AddForeignKey
ALTER TABLE "PrisonerLawyer" ADD CONSTRAINT "PrisonerLawyer_prisonerId_fkey" FOREIGN KEY ("prisonerId") REFERENCES "Prisoner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrisonerLawyer" ADD CONSTRAINT "PrisonerLawyer_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
