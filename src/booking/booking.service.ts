import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingRepository } from '../repository/booking.repository';
import { BookingInfo } from './booking.dto';
import { v4 as uuidv4 } from 'uuid';
import { SportareaService } from '../sportarea/sportarea.service';
import { commonUtils } from '../utils/common.utils';
import { GetAvailableBookingRequest, GetAvailableBookingResponse, TimeSlot } from './booking.pb';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';


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

  async createAvailableTimeSlots(
    startTime: Date,
    endTime: Date,
    timeIntervalInMinutes: number
  ): Promise<TimeSlot[]> {
    try {
      const timeSlots: TimeSlot[] = [];
      let currentTime = new Date(startTime);

      while (currentTime < endTime) {
        const slotStartTime = currentTime.toISOString();
        currentTime.setMinutes(currentTime.getMinutes() + timeIntervalInMinutes);
        const slotEndTime = currentTime.toISOString();

        timeSlots.push({
          startTime: slotStartTime,
          endTime: slotEndTime
        });
      }
      // console.log(timeSlots);
      return timeSlots;
    } catch (error) {
      console.log(error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }

  private isValidDateFormat(input: string): boolean {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(input);
  }


  async GetAvailableBooking(request: GetAvailableBookingRequest): Promise<GetAvailableBookingResponse> {
    try {
      const area = await this.sportareaService.getAreaById({
        sportAreaId: request.sportAreaId,
        sportType: request.sportType,
        areaId: request.areaId,
      });

      if (!this.isValidDateFormat(request.bookingDate)) {
        throw new RpcException({ code: status.INVALID_ARGUMENT, message: "Invalid date format. Please use 'yyyy-mm-dd' format." });
      }

      let allTimeSlot = await this.createAvailableTimeSlots(
        new Date(`${request.bookingDate}T${area.data.openTime}`),
        new Date(`${request.bookingDate}T${area.data.closeTime}`),
        60
      );

      const listAvailableTime: TimeSlot[] = [];

      for (const timeSlot of allTimeSlot) {
        const startTime = timeSlot.startTime;
        const endTime = timeSlot.endTime;
        const bookingList = await this.bookingRepo.checkAvailability(
          request.sportAreaId,
          request.sportType,
          request.areaId,
          startTime,
          endTime
        );
        if (bookingList.length === 0) {
          listAvailableTime.push({
            startTime: new Date(startTime).toLocaleString([], { hour12: false }),
            endTime: new Date(endTime).toLocaleString([], { hour12: false }),
          });
        }
      }
      return { listAvailableTime };

    } catch (error) {
      console.log(error);
      if (!(error instanceof RpcException)) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Internal server error',
        });
      }
      throw error;
    }
  }
}
