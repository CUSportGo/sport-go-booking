/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "booking";

export enum BookingStatus {
  Pending = 0,
  Accept = 1,
  Decline = 2,
  Cancel = 3,
  UNRECOGNIZED = -1,
}

export interface ViewBookingHistoryRequest {
  userId: string;
}

export interface ViewBookingHistoryResponse {
  data: BookingData | undefined;
}

export interface BookingData {
  pending: BookingTransaction[];
  accept: BookingTransaction[];
  decline: BookingTransaction[];
  cancel: BookingTransaction[];
}

export interface BookingTransaction {
  id: string;
  sportAreaID: string;
  sportType: string;
  areaID: string;
  userID: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  sportAreaData: SportDetail | undefined;
}

export interface SportDetail {
  name: string;
  openTime: string;
  closeTime: string;
  price: string;
}

export const BOOKING_PACKAGE_NAME = "booking";

export interface BookingServiceClient {
  viewBookingHistory(request: ViewBookingHistoryRequest): Observable<ViewBookingHistoryResponse>;
}

export interface BookingServiceController {
  viewBookingHistory(
    request: ViewBookingHistoryRequest,
  ): Promise<ViewBookingHistoryResponse> | Observable<ViewBookingHistoryResponse> | ViewBookingHistoryResponse;
}

export function BookingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["viewBookingHistory"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("BookingService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("BookingService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const BOOKING_SERVICE_NAME = "BookingService";
