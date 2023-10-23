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
  ): Promise<string[]> {
    try {
      const timeSlots: string[] = [];
      let currentTime = new Date(startTime);

      while (currentTime < endTime) {
        const slotStartTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        currentTime.setMinutes(currentTime.getMinutes() + timeIntervalInMinutes);
        const slotEndTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        timeSlots.push(`${slotStartTime}-${slotEndTime}`);
      }
      console.log(timeSlots);
      return timeSlots;
    } catch (error) {
      console.log(error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }

  convertTimeToProto = (timeList: string[]): TimeSlot[] => {
    return timeList.map(timeSlot => {
      const [startTime, endTime] = timeSlot.split('-');
      return {
        startTime,
        endTime,
      };
    });
  }

  async GetAvailableBooking(request: GetAvailableBookingRequest): Promise<GetAvailableBookingResponse> {
    try {
      const area = await this.sportareaService.getAreaById({
        sportAreaId: request.sportAreaId,
        sportType: request.sportType,
        areaId: request.areaId,
      });

      const allTimeSlot = await this.createAvailableTimeSlots(new Date(area.data.openTime), new Date(area.data.closeTime), 60)
      const listTime: string[] = [];

      for (const timeSlot of allTimeSlot) {
        const [startTime, endTime] = timeSlot.split('-');
        const bookingList = await this.bookingRepo.checkAvailability(
          request.sportAreaId,
          request.sportType,
          request.areaId,
          startTime,
          endTime
        );
        if (bookingList.length === 0) {
          listTime.push(timeSlot);
        }
      }
      const listAvailableTime: TimeSlot[] = this.convertTimeToProto(listTime);
      return { listAvailableTime };

    } catch (error) {
      console.log(error);
      if (!(error instanceof HttpException)) {
        throw new InternalServerErrorException('Internal server error');
      }
      throw error;
    }
  }
}
