-- CreateTable
CREATE TABLE "Symptom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientOnSymptom" (
    "patientId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,

    CONSTRAINT "PatientOnSymptom_pkey" PRIMARY KEY ("patientId","symptomId")
);

-- AddForeignKey
ALTER TABLE "PatientOnSymptom" ADD CONSTRAINT "PatientOnSymptom_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientOnSymptom" ADD CONSTRAINT "PatientOnSymptom_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
