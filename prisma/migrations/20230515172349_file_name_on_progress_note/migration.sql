/*
  Warnings:

  - Added the required column `fileName` to the `ProgressNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProgressNote" ADD COLUMN     "fileName" TEXT NOT NULL;
