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

  app.connectMicroservice(bookingGrpcOption);

  await app.startAllMicroservices();
}
bootstrap();
