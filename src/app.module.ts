import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BookingModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
