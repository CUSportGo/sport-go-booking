import { DateTime, Interval } from 'luxon';

const checkValidBookingTime = (
  startAt: string,
  endAt: string,
  openAt: string,
  closeAt: string,
) => {
  const bookingStartAt = DateTime.fromISO(startAt);
  const bookingEndAt = DateTime.fromISO(endAt);

  const openTime = DateTime.fromFormat(openAt, 'HH:mm').toTime();
  const closeTime = DateTime.fromFormat(closeAt, 'HH:mm').toTime();

  const bookingInterval = Interval.fromDateTimes(bookingStartAt, bookingEndAt);
  const sportAreaInterval = Interval.fromDateTimes(
    DateTime.fromObject({ hour: openTime.hour, minute: openTime.minute }),
    DateTime.fromObject({ hour: closeTime.hour, minute: closeTime.minute }),
  );

  if (sportAreaInterval.containsInterval(bookingInterval)) {
    return true;
  }
  return false;
};

export const commonUtils = {
  checkValidBookingTime,
};
