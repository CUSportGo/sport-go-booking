export interface BookingInfo {
  sportAreaID: string;
  sportType: string;
  areaID: string;
  userID: string;
  startAt: string;
  endAt: string;
}

export interface CancelBookingInfo {
  bookingID: string;
  userID: string;
}

export interface ConfirmBookingInfo {
  bookingID: string;
  userID: string;
}
