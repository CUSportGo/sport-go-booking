/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "booking";

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

export const BOOKING_PACKAGE_NAME = "booking";

export interface BookingServiceClient {
  getAvailableBooking(request: GetAvailableBookingRequest): Observable<GetAvailableBookingResponse>;
}

export interface BookingServiceController {
  getAvailableBooking(
    request: GetAvailableBookingRequest,
  ): Promise<GetAvailableBookingResponse> | Observable<GetAvailableBookingResponse> | GetAvailableBookingResponse;
}

export function BookingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAvailableBooking"];
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
