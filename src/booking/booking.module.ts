import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingRepository } from '../repository/booking.repository';
import { SportareaModule } from '../sportarea/sportarea.module';
import { SportareaService } from '../sportarea/sportarea.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [SportareaModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, PrismaService],
})
export class BookingModule { }
