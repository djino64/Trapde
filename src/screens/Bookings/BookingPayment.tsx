import React, { useEffect, useState } from 'react';

import { accommodationService } from '../../services/accommodationService';
import { createAccommodationPayment } from '../../services/paymentService';

interface BookingPaymentProps {
  bookingId: number;
  currency?: string;
}

const BookingPayment: React.FC<BookingPaymentProps> = ({
  bookingId,
  currency = 'HTG',
}) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'moncash'>('moncash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    accommodationService.getBooking(bookingId)
      .then((booking) => {
        const total = Number(booking.total_price);
        if (!Number.isFinite(total) || total <= 0) {
          throw new Error('Le montant de cette réservation est invalide.');
        }
        if (active) setAmount(total);
      })
      .catch((bookingError: unknown) => {
        console.error('Unable to load booking amount:', bookingError);
        if (active) {
          const errorMessage = bookingError as {
            response?: { data?: { detail?: string } };
            message?: string;
          };
          setError(
            errorMessage.response?.data?.detail ||
            errorMessage.message ||
            'Impossible de charger le montant de la réservation.'
          );
        }
      })
      .finally(() => {
        if (active) setLoadingBooking(false);
      });

    return () => {
      active = false;
    };
  }, [bookingId]);

  const handlePayment = async () => {
    if (amount === null || amount <= 0) {
      setError('Le montant de la réservation est indisponible.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payment = await createAccommodationPayment(bookingId, amount);
      if (!payment.payment_url) {
        throw new Error('MonCash n’a pas retourné une URL de paiement.');
      }

      localStorage.setItem('trapde_pending_payment_id', String(payment.id));
      localStorage.setItem('trapde_pending_booking_id', String(bookingId));
      window.location.href = payment.payment_url;
    } catch (paymentError: unknown) {
      console.error('Payment error:', paymentError);
      const errorResponse = paymentError as {
        response?: { data?: { detail?: string; message?: string; error?: string } };
        message?: string;
      };
      setError(
        errorResponse.response?.data?.detail ||
        errorResponse.response?.data?.message ||
        errorResponse.response?.data?.error ||
        errorResponse.message ||
        'Impossible de démarrer le paiement.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <section className="rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Paiement de la réservation</h2>
        <p className="mt-4 text-gray-500">Montant à payer</p>
        <p className="text-2xl font-bold">
          {loadingBooking
            ? 'Chargement…'
            : amount === null
              ? 'Montant indisponible'
              : `${amount.toLocaleString()} ${currency}`}
        </p>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h3 className="text-lg font-semibold">Choisissez votre méthode de paiement</h3>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[#0000AA] bg-blue-50 p-4">
          <input
            type="radio"
            name="payment-method"
            value="moncash"
            checked={selectedMethod === 'moncash'}
            onChange={() => setSelectedMethod('moncash')}
            className="mt-1"
          />
          <span>
            <span className="block font-semibold">MonCash</span>
            <span className="mt-1 block text-sm text-gray-600">
              Vous saisirez vos informations sur la page sécurisée MonCash.
            </span>
          </span>
        </label>
        <p className="mt-3 text-sm text-gray-500">
          MonCash est la seule méthode disponible pour le moment.
        </p>
      </section>

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || loadingBooking || amount === null || selectedMethod !== 'moncash'}
        className="w-full rounded-xl bg-[#0000AA] px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'Connexion à MonCash...'
          : amount === null
            ? 'Continuer avec MonCash'
            : `Continuer avec MonCash — ${amount.toLocaleString()} ${currency}`}
      </button>
    </div>
  );
};

export default BookingPayment;
