import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CANCEL_BOOKING_PATTERN, CREATE_BOOKING_PATTERN } from '../constant/booking.constant';
import { BookingInfo } from './booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @MessagePattern(CREATE_BOOKING_PATTERN)
  public async createBooking(booking: BookingInfo) {
    return this.bookingService.createBooking(booking);
  }

  @MessagePattern(CANCEL_BOOKING_PATTERN)
  public async cancelBooking(bookingId: string) {
    return this.bookingService.cancelBooking(bookingId);
  }
}
