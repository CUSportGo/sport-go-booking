/*
  Warnings:

  - Added the required column `sportType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_sportAreaID_areaID_startAt_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "sportType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_sportAreaID_sportType_areaID_startAt_idx" ON "Booking"("sportAreaID", "sportType", "areaID", "startAt");
