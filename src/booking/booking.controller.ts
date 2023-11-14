import { Controller } from '@nestjs/common';
import {
  GrpcMethod,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  CANCEL_BOOKING_PATTERN,
  CONFIRM_BOOKING_PATTERN,
  CREATE_BOOKING_PATTERN,
  DECLINE_BOOKING_PATTERN,
} from '../constant/booking.constant';
import {
  BookingInfo,
  CancelBookingInfo,
  ConfirmBookingInfo,
} from './booking.dto';
import { BookingService } from './booking.service';
import {
  GetAvailableBookingRequest,
  GetAvailableBookingResponse,
  GetPendingBookingRequest,
  GetPendingBookingResponse,
} from './booking.pb';
import {
  BookingServiceController,
  ViewBookingHistoryRequest,
  ViewBookingHistoryResponse,
} from './booking.pb';
import { Observable } from 'rxjs';

@Controller('booking')
export class BookingController implements BookingServiceController {
  constructor(private bookingService: BookingService) { }

  @MessagePattern(CREATE_BOOKING_PATTERN)
  public async createBooking(booking: BookingInfo) {
    return this.bookingService.createBooking(booking);
  }

  @GrpcMethod('BookingService', 'ViewBookingHistory')
  public async viewBookingHistory(
    request: ViewBookingHistoryRequest,
  ): Promise<ViewBookingHistoryResponse> {
    return await this.bookingService.viewBookingHistory(request);
  }

  @MessagePattern(CANCEL_BOOKING_PATTERN)
  public async cancelBooking(cancelInfo: CancelBookingInfo) {
    return this.bookingService.cancelBooking(cancelInfo);
  }

  @MessagePattern(CONFIRM_BOOKING_PATTERN)
  public async confirmBooking(confirmInfo: ConfirmBookingInfo) {
    return this.bookingService.confirmBooking(confirmInfo);
  }

  @MessagePattern(DECLINE_BOOKING_PATTERN)
  public async declineBooking(bookingInfo: ConfirmBookingInfo) {
    return this.bookingService.declineBooking(bookingInfo);
  }

  @GrpcMethod('BookingService', 'GetAvailableBooking')
  getAvailableBooking(
    request: GetAvailableBookingRequest,
  ): Promise<GetAvailableBookingResponse> {
    return this.bookingService.GetAvailableBooking(request);
  }

  @GrpcMethod('BookingService', 'GetPendingBooking')
  getPendingBooking(request: GetPendingBookingRequest): Promise<GetPendingBookingResponse> {
    return this.bookingService.getPendingBooking(request);
  }
}
