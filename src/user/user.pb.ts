/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface GetUserSportAreaRequest {
  sportAreaId: string;
}

export interface GetUserSportAreaResponse {
  userId: string;
  sportAreaId: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUserSportArea(request: GetUserSportAreaRequest): Observable<GetUserSportAreaResponse>;
}

export interface UserServiceController {
  getUserSportArea(
    request: GetUserSportAreaRequest,
  ): Promise<GetUserSportAreaResponse> | Observable<GetUserSportAreaResponse> | GetUserSportAreaResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUserSportArea"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
