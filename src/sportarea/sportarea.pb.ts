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

export interface GetSportAreaByIdRequest {
  id: string;
}

export interface GetSportAreaByIdResponse {
  data: SportArea | undefined;
}

export interface SportArea {
  id: string;
  name: string;
  imageURL: string;
  sportType: string[];
  location: string;
  description: string;
  distance: number;
  price: string;
  sportList: SportList[];
}

export interface SportList {
  sportType: string;
  area: SportDetail[];
}

export const SPORTAREA_PACKAGE_NAME = "sportarea";

export interface SportareaServiceClient {
  getAreaById(request: GetAreaByIdRequest): Observable<GetAreaByIdResponse>;

  getSportAreaById(request: GetSportAreaByIdRequest): Observable<GetSportAreaByIdResponse>;
}

export interface SportareaServiceController {
  getAreaById(
    request: GetAreaByIdRequest,
  ): Promise<GetAreaByIdResponse> | Observable<GetAreaByIdResponse> | GetAreaByIdResponse;

  getSportAreaById(
    request: GetSportAreaByIdRequest,
  ): Promise<GetSportAreaByIdResponse> | Observable<GetSportAreaByIdResponse> | GetSportAreaByIdResponse;
}

export function SportareaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAreaById", "getSportAreaById"];
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
