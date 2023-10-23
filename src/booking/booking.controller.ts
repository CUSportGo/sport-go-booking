import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { CREATE_BOOKING_PATTERN } from '../constant/booking.constant';
import { BookingInfo } from './booking.dto';
import { BookingService } from './booking.service';
import { GetAvailableBookingRequest, GetAvailableBookingResponse } from './booking.pb';



@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @MessagePattern(CREATE_BOOKING_PATTERN)
  public async createBooking(booking: BookingInfo) {
    return this.bookingService.createBooking(booking);
  }

  @GrpcMethod("BookingService", "GetAvailableBooking")
  getAvailableBooking(request: GetAvailableBookingRequest): Promise<GetAvailableBookingResponse> {
    return this.bookingService.GetAvailableBooking(request);
  }
}
