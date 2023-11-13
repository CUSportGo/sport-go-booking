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

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface GetAvailableBookingRequest {
  sportAreaId: string;
  sportType: string;
  areaId: string;
  bookingDate: string;
}

export interface GetAvailableBookingResponse {
  listAvailableTime: TimeSlot[];
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
  sportAreaData: SportArea | undefined;
}

export interface SportArea {
  id: string;
  name: string;
  image: string[];
  description: string;
}

export interface GetPendingBookingRequest {
  SportAreaId: string;
}

export interface GetPendingBookingResponse {
  data: BookingTransaction[];
}

export const BOOKING_PACKAGE_NAME = "booking";

export interface BookingServiceClient {
  getAvailableBooking(request: GetAvailableBookingRequest): Observable<GetAvailableBookingResponse>;

  viewBookingHistory(request: ViewBookingHistoryRequest): Observable<ViewBookingHistoryResponse>;

  getPendingBooking(request: GetPendingBookingRequest): Observable<GetPendingBookingResponse>;
}

export interface BookingServiceController {
  getAvailableBooking(
    request: GetAvailableBookingRequest,
  ): Promise<GetAvailableBookingResponse> | Observable<GetAvailableBookingResponse> | GetAvailableBookingResponse;

  viewBookingHistory(
    request: ViewBookingHistoryRequest,
  ): Promise<ViewBookingHistoryResponse> | Observable<ViewBookingHistoryResponse> | ViewBookingHistoryResponse;

  getPendingBooking(
    request: GetPendingBookingRequest,
  ): Promise<GetPendingBookingResponse> | Observable<GetPendingBookingResponse> | GetPendingBookingResponse;
}

export function BookingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAvailableBooking", "viewBookingHistory", "getPendingBooking"];
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
