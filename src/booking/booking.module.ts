import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingRepository } from '../repository/booking.repository';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, PrismaService],
})
export class BookingModule {}
