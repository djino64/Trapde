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
  bookingId: number
): Promise<CreateAccommodationPaymentResponse> {

  const response =
    await api.post<CreateAccommodationPaymentResponse>(
      '/api/payments/accommodation/',
      {
        booking_id: bookingId,
      }
    );

  return response.data;
}


/**
 * Vérifier le paiement auprès de MonCash.
 */
export async function verifyPayment(
  paymentId: number
): Promise<VerifyPaymentResponse> {

  const response =
    await api.post<VerifyPaymentResponse>(
      `/api/payments/${paymentId}/verify/`
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