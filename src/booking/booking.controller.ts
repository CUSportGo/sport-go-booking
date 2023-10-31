import { Controller } from '@nestjs/common';
import { Ctx, GrpcMethod, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CANCEL_BOOKING_PATTERN, CREATE_BOOKING_PATTERN } from '../constant/booking.constant';
import { BookingInfo, CancelBookingInfo } from './booking.dto';
import { BookingService } from './booking.service';
import { BookingServiceController, ViewBookingHistoryRequest, ViewBookingHistoryResponse } from './booking.pb';

@Controller('booking')
export class BookingController implements BookingServiceController {
  constructor(private bookingService: BookingService) { }

  @MessagePattern(CREATE_BOOKING_PATTERN)
  public async createBooking(booking: BookingInfo) {
    return this.bookingService.createBooking(booking);
  }

  @GrpcMethod('BookingService', 'ViewBookingHistory')
  public async viewBookingHistory(request: ViewBookingHistoryRequest): Promise<ViewBookingHistoryResponse> {
    return await this.bookingService.viewBookingHistory(request)
  }

  @MessagePattern(CANCEL_BOOKING_PATTERN)
  public async cancelBooking(cancelInfo: CancelBookingInfo) {
    return this.bookingService.cancelBooking(cancelInfo);
  }
}
