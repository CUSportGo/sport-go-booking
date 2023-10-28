import { Injectable } from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingRepository {
  constructor(private db: PrismaService) { }

  async create(createdBooking: Prisma.BookingCreateInput): Promise<Booking> {
    return await this.db.booking.create({
      data: createdBooking,
    });
  }

  async checkAvailability(
    sportAreaID: string,
    sportType: string,
    areaID: string,
    startAt: string,
    endAt: string,
  ): Promise<Booking[]> {
    return await this.db.booking.findMany({
      where: {
        sportAreaID: sportAreaID,
        areaID: areaID,
        sportType: sportType,
        OR: [
          {
            startAt: {
              gte: startAt,
              lt: endAt,
            },
          },
          {
            endAt: {
              gt: startAt,
              lte: endAt,
            },
          },
        ],
      },
    });
  }
  
  async getBookingById(id: string): Promise<Booking> {
    return await this.db.booking.findUnique({
      where: {
        id,
      },
    });
  }

  async updateBooking(
    id: string,
    data: Prisma.BookingUpdateInput,
  ): Promise<Booking> {
    return await this.db.booking.update({
      where: {
        id,
      },
      data,
    });
  }

  async getBookingByUserId(userID: string): Promise<Booking[]> {
    return await this.db.booking.findMany({
      where: {
        userID: userID,
      }
    })
  }
}
