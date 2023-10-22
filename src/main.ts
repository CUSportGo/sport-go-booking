import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const bookingGrpcOption: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'booking',
      protoPath: join(__dirname, 'proto/booking.proto'),
      url: 'localhost:8084',
    },
  };

  const rabbitMqOption: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'sport_booking',
      queueOptions: {
        durable: false,
      },
    },
  };

  app.connectMicroservice(bookingGrpcOption);
  app.connectMicroservice(rabbitMqOption);

  await app.startAllMicroservices();
}
bootstrap();
