const checkValidBookingTime = (
  startAt: string,
  endAt: string,
  openAt: string,
  closeAt: string,
) => {
  const bookingStartAt = new Date(startAt);
  const bookingEndAt = new Date(endAt);

  const [openHour, openMinute] = openAt.split(':').map(Number);
  const [closeHour, closeMinute] = closeAt.split(':').map(Number);

  const bookingStartHours = bookingStartAt.getHours();
  const bookingStartMinutes = bookingStartAt.getMinutes();
  const bookingEndHours = bookingEndAt.getHours();
  const bookingEndMinutes = bookingEndAt.getMinutes();
  console.log('Open Hour:', openHour);
  console.log('Close Hour:', closeHour);
  console.log('Start Time:', bookingStartHours, bookingStartMinutes);
  console.log('End Time:', bookingEndHours, bookingEndMinutes);
  if (
    bookingStartHours > openHour ||
    (bookingStartHours === openHour && bookingStartMinutes >= openMinute)
  ) {
    if (
      bookingEndHours < closeHour ||
      (bookingEndHours === closeHour && bookingEndMinutes <= closeMinute)
    ) {
      return true;
    }
  }
  return false;
};

export const commonUtils = {
  checkValidBookingTime,
};
