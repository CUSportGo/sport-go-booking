import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { exceptionHandler } from '../common/exception-handler';
import {
  GetAreaByIdRequest,
  GetAreaByIdResponse,
  GetSportAreaByIdRequest,
  GetSportAreaByIdResponse,
  SportareaServiceClient,
} from './sportarea.pb';

@Injectable()
export class SportareaService {
  private sportareaClient: SportareaServiceClient;
  private readonly logger = new Logger(SportareaService.name);

  constructor(@Inject('SPORTAREA_PACKAGE') private client: ClientGrpc) {
    this.sportareaClient =
      this.client.getService<SportareaServiceClient>('SportareaService');
  }

  async getAreaById(request: GetAreaByIdRequest): Promise<GetAreaByIdResponse> {
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

  async getSportAreaById(request: GetSportAreaByIdRequest): Promise<GetSportAreaByIdResponse> {
    return await firstValueFrom(
      this.sportareaClient.getSportAreaById(request).pipe(
        catchError((error) => {
          this.logger.error(error);
          const exception = exceptionHandler.getExceptionFromGrpc(error);
          throw exception;
        }),
      ),
    );
  }
}
