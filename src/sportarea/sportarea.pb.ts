/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "sportarea";

export interface GetAreaByIdRequest {
  sportAreaId: string;
  sportType: string;
  areaId: string;
}

export interface GetAreaByIdResponse {
  data: SportDetail | undefined;
}

export interface SportDetail {
  name: string;
  openTime: string;
  closeTime: string;
  price: string;
}

export const SPORTAREA_PACKAGE_NAME = "sportarea";

export interface SportareaServiceClient {
  getAreaById(request: GetAreaByIdRequest): Observable<GetAreaByIdResponse>;
}

export interface SportareaServiceController {
  getAreaById(
    request: GetAreaByIdRequest,
  ): Promise<GetAreaByIdResponse> | Observable<GetAreaByIdResponse> | GetAreaByIdResponse;
}

export function SportareaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAreaById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SportareaService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SportareaService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SPORTAREA_SERVICE_NAME = "SportareaService";
