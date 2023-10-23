import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const bookingGrpcOption: MicroserviceOptions = {
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'booking',
  //     protoPath: join(__dirname, 'proto/booking.proto'),
  //     url: process.env.BOOKING_GRPC_URL,
  //   },
  // };

  const rabbitMqOption: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.BOOKING_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  };

  // app.connectMicroservice(bookingGrpcOption);
  app.connectMicroservice(rabbitMqOption);

  await app.startAllMicroservices();
}
bootstrap();
