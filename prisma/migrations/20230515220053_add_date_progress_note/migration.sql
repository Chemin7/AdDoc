/*
  Warnings:

  - Added the required column `date` to the `ProgressNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressNote" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
