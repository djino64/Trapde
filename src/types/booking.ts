export type BookingType =
  | "accommodation"
  | "transport"
  | "marketplace"
  | "accommodation"
  ;


export interface Booking {

    id?:number;

    userId:number;

    serviceId:number;

    type:BookingType;

    startDate:string;

    endDate:string;

    quantity:number;

    totalPrice:number;

    status:
    | "pending"
    | "confirmed"
    | "cancelled";

}