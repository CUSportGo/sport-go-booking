/*
  Warnings:

  - You are about to drop the column `isCancel` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('Pending', 'Accept', 'Decline', 'Cancel');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "isCancel",
ADD COLUMN     "status" "BookingStatus" NOT NULL;
