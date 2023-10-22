import { Injectable } from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingRepository {
  constructor(private db: PrismaService) {}

  async create(createdBooking: Prisma.BookingCreateInput): Promise<Booking> {
    return await this.db.booking.create({
      data: createdBooking,
    });
  }

  async checkAvailability(
    sportAreaID: string,
    areaID: string,
    startAt: string,
    endAt: string,
  ): Promise<Booking[]> {
    return await this.db.booking.findMany({
      where: {
        sportAreaID: sportAreaID,
        areaID: areaID,
        OR: [
          {
            startAt: {
              gt: startAt,
              lt: endAt,
            },
          },
          {
            endAt: {
              gt: startAt,
              lt: endAt,
            },
          },
        ],
      },
    });
  }
}
