import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern } from '@nestjs/microservices';
import { CANCEL_BOOKING_PATTERN, CREATE_BOOKING_PATTERN } from '../constant/booking.constant';
import { BookingInfo, CancelBookingInfo } from './booking.dto';
import { BookingService } from './booking.service';
import { GetAvailableBookingRequest, GetAvailableBookingResponse } from './booking.pb';



@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @MessagePattern(CREATE_BOOKING_PATTERN)
  public async createBooking(booking: BookingInfo) {
    return this.bookingService.createBooking(booking);
  }

  @MessagePattern(CANCEL_BOOKING_PATTERN)
  public async cancelBooking(cancelInfo: CancelBookingInfo) {
    return this.bookingService.cancelBooking(cancelInfo);
  }

  @GrpcMethod("BookingService", "GetAvailableBooking")
  getAvailableBooking(request: GetAvailableBookingRequest): Promise<GetAvailableBookingResponse> {
    return this.bookingService.GetAvailableBooking(request);
  }
}
