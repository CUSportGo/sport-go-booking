-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sportAreaID" TEXT NOT NULL,
    "areaID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isCancel" BOOLEAN NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_sportAreaID_areaID_startAt_idx" ON "Booking"("sportAreaID", "areaID", "startAt");

-- CreateIndex
CREATE INDEX "Booking_userID_idx" ON "Booking"("userID");
