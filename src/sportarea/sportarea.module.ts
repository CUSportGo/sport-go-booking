import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SportareaService } from './sportarea.service';
import { SportareaController } from './sportarea.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SPORTAREA_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'sportarea',
          protoPath: join(__dirname, '../proto/sportarea.proto'),
          url: process.env.SPORTAREA_GRPC_URL,
        },
      },
    ]),
  ],
  providers: [SportareaService],
  controllers: [SportareaController],
})
export class SportareaModule {}
