import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingRepository } from '../repository/booking.repository';
import { BookingInfo } from './booking.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  constructor(private bookingRepo: BookingRepository) {}

  public async createBooking(booking: BookingInfo) {
    try {
      const bookings = await this.bookingRepo.checkAvailability(
        booking.sportAreaID,
        booking.areaID,
        booking.startAt,
        booking.endAt,
      );
      if (bookings) {
        throw new ForbiddenException('Forbidden permission');
      }

      const bookingId = uuidv4();
      const createdBooking = {
        id: bookingId,
        sportAreaID: booking.sportAreaID,
        areaID: booking.areaID,
        userID: booking.userID,
        startAt: booking.startAt,
        endAt: booking.endAt,
        isCancel: false,
      };
      const newBooking = await this.bookingRepo.create(createdBooking);
      console.log(newBooking);
      // notify back to user
    } catch (error) {
      console.log(error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }
}
