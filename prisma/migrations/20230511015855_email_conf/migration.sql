/*
  Warnings:

  - You are about to drop the column `confirmed` on the `Doctor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[confirmationToken]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "confirmed",
ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_confirmationToken_key" ON "Doctor"("confirmationToken");
