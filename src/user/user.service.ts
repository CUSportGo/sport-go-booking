import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { exceptionHandler } from '../common/exception-handler';
import {
    GetUserSportAreaRequest,
    GetUserSportAreaResponse,
    UserServiceClient,
} from './user.pb';

@Injectable()
export class UserService {
    private userClient: UserServiceClient;
    private readonly logger = new Logger(UserService.name);

    constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {
        this.userClient = this.client.getService<UserServiceClient>('UserService');
    }

    async getUserSportArea(
        request: GetUserSportAreaRequest,
    ): Promise<GetUserSportAreaResponse> {
        return await firstValueFrom(
            this.userClient.getUserSportArea(request).pipe(
                catchError((error) => {
                    this.logger.error(error);
                    const exception = exceptionHandler.getExceptionFromGrpc(error);
                    throw exception;
                }),
            ),
        );
    }
}
