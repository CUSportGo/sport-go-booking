import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingRepository } from '../repository/booking.repository';
import { BookingInfo, CancelBookingInfo } from './booking.dto';
import { v4 as uuidv4 } from 'uuid';
import { SportareaService } from '../sportarea/sportarea.service';
import { commonUtils } from '../utils/common.utils';
import { Booking, BookingStatus } from '@prisma/client';
import { BookingData, BookingStatus as BookingStatusProto, ViewBookingHistoryRequest, ViewBookingHistoryResponse } from './booking.pb';

@Injectable()
export class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private sportareaService: SportareaService,
  ) { }

  public async createBooking(booking: BookingInfo) {
    try {
      const area = await this.sportareaService.getAreaById({
        sportAreaId: booking.sportAreaID,
        sportType: booking.sportType,
        areaId: booking.areaID,
      });
      if (
        !commonUtils.checkValidBookingTime(
          booking.startAt,
          booking.endAt,
          area.data.openTime,
          area.data.closeTime,
        )
      ) {
        throw new ForbiddenException('Forbidden permission');
      }

      const bookings = await this.bookingRepo.checkAvailability(
        booking.sportAreaID,
        booking.sportType,
        booking.areaID,
        booking.startAt,
        booking.endAt,
      );
      if (bookings && bookings.length > 0) {
        throw new ForbiddenException('Forbidden permission');
      }

      const bookingId = uuidv4();
      const createdBooking = {
        id: bookingId,
        sportAreaID: booking.sportAreaID,
        sportType: booking.sportType,
        areaID: booking.areaID,
        userID: booking.userID,
        startAt: booking.startAt,
        endAt: booking.endAt,
        status: BookingStatus.Pending,
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

  public async cancelBooking(cancelInfo: CancelBookingInfo) {
    try {
      const booking = await this.bookingRepo.getBookingById(cancelInfo.bookingID);
      if (!booking) {
        throw new InternalServerErrorException('Booking not found');
      }
      if (booking.userID !== cancelInfo.userID) {
        throw new ForbiddenException('Forbidden permission');
      }
      const updatedBooking = await this.bookingRepo.updateBooking(cancelInfo.bookingID, {
        ...booking,
        status: BookingStatus.Cancel,
      });
      console.log(updatedBooking);
      // notify back to user
    } catch (error) {
      console.log(error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }

  public async viewBookingHistory(request: ViewBookingHistoryRequest): Promise<ViewBookingHistoryResponse> {
    try {
      const userId = request.userId
      const bookings = await this.bookingRepo.getBookingByUserId(userId)
      const bookingsGRPCCompatible = bookings.map((booking) => {
        return {
          ...booking,
          createdAt: booking.createdAt.toLocaleString(),
          updatedAt: booking.updatedAt.toLocaleString(),
          endAt: booking.endAt.toLocaleString(),
          startAt: booking.startAt.toLocaleString(),
          status: BookingStatusProto[booking.status as keyof typeof BookingStatusProto]
        }
      })
      const pendings = bookingsGRPCCompatible.filter((booking) => BookingStatusProto[booking.status] === 'Pending')
      const accepts = bookingsGRPCCompatible.filter((booking) => BookingStatusProto[booking.status] === 'Accept')
      const declines = bookingsGRPCCompatible.filter((booking) => BookingStatusProto[booking.status] === 'Decline')
      const cancels = bookingsGRPCCompatible.filter((booking) => BookingStatusProto[booking.status] === 'Cancel')

      return {
        data: {
          pending: pendings,
          accept: accepts,
          decline: declines,
          cancel: cancels,
        }
      }
    } catch (error) {
      console.log(error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }
}
