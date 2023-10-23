import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { exceptionHandler } from '../common/exception-handler';
import {
  GetAreaByIdRequest,
  GetAreaByIdResponse,
  SportareaServiceClient,
} from './sportarea.pb';

@Injectable()
export class SportareaService implements OnModuleInit {
  private sportareaClient: SportareaServiceClient;
  private readonly logger = new Logger(SportareaService.name);

  constructor(@Inject('SPORTAREA_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    console.log('init sport area service');
    this.sportareaClient =
      this.client.getService<SportareaServiceClient>('SportareaService');
  }

  async getAreaById(request: GetAreaByIdRequest): Promise<GetAreaByIdResponse> {
    console.log(this.sportareaClient);
    return await firstValueFrom(
      this.sportareaClient.getAreaById(request).pipe(
        catchError((error) => {
          this.logger.error(error);
          const exception = exceptionHandler.getExceptionFromGrpc(error);
          throw exception;
        }),
      ),
    );
  }
}
