import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingInfo } from './booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @MessagePattern('create_booking')
  public async createBooking(booking: BookingInfo) {
    return this.bookingService.createBooking(booking);
  }
}
