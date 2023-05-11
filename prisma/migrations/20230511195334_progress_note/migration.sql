/*
  Warnings:

  - You are about to drop the `PatientOnSymptom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatientOnSymptom" DROP CONSTRAINT "PatientOnSymptom_patientId_fkey";

-- DropForeignKey
ALTER TABLE "PatientOnSymptom" DROP CONSTRAINT "PatientOnSymptom_symptomId_fkey";

-- DropTable
DROP TABLE "PatientOnSymptom";

-- CreateTable
CREATE TABLE "ProgressNote" (
    "id" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "ProgressNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressNoteOnSymptom" (
    "progressNoteId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,

    CONSTRAINT "ProgressNoteOnSymptom_pkey" PRIMARY KEY ("progressNoteId","symptomId")
);

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNoteOnSymptom" ADD CONSTRAINT "ProgressNoteOnSymptom_progressNoteId_fkey" FOREIGN KEY ("progressNoteId") REFERENCES "ProgressNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNoteOnSymptom" ADD CONSTRAINT "ProgressNoteOnSymptom_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
