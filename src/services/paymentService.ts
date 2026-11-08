/* eslint-disable @typescript-eslint/no-empty-object-type */
import api from './api';

export interface Payment {
  id: number;
  service: string;
  reference: string;
  provider: string;
  order_id: string;
  transaction_id: string | null;

  amount: string;
  currency: string;

  commission_rate: string;
  commission_amount: string;
  partner_amount: string;

  status: string;

  payment_url: string | null;

  provider_reference: string | null;
  payer: string | null;
  provider_message: string;

  created_at: string;
  updated_at: string;
  paid_at: string | null;
  expires_at: string | null;
}

export interface CreateAccommodationPaymentResponse
  extends Payment {}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment: Payment;
  booking_status?: string;
}


/**
 * Créer un paiement MonCash
 * pour une réservation Accommodation.
 */
export async function createAccommodationPayment(
  bookingId: number,
  amount: number
): Promise<CreateAccommodationPaymentResponse> {

  const response =
    await api.post<{
      success: boolean;
      payment?: CreateAccommodationPaymentResponse;
      message?: string;
      error?: string;
    }>(
      '/api/payments/create/',
      {
        service: 'accommodation',
        reference: `booking-${bookingId}`,
        amount,
        currency: 'HTG',
        metadata: {
          booking_id: bookingId,
        },
      }
    );

  if (response.data?.payment) {
    return response.data.payment;
  }

  return response.data as unknown as CreateAccommodationPaymentResponse;
}


/**
 * Vérifier le paiement auprès de MonCash.
 */
export async function verifyPayment(
  paymentId: number
): Promise<VerifyPaymentResponse> {

  const paymentResponse = await api.get<{ payment?: Payment }>(
    `/api/payments/${paymentId}/`
  );

  const payment = (paymentResponse.data.payment ?? paymentResponse.data) as Payment;

  const response =
    await api.post<VerifyPaymentResponse>(
      '/api/payments/verify/',
      {
        order_id: payment.order_id,
      }
    );

  return response.data;
}


/**
 * Récupérer un paiement.
 */
export async function getPayment(
  paymentId: number
): Promise<Payment> {

  const response =
    await api.get<Payment>(
      `/api/payments/${paymentId}/`
    );

  return response.data;
}