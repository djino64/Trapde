import React, { useEffect, useState } from 'react';

import { accommodationService } from '../../services/accommodationService';
import {
  createAccommodationPayment,
  getAvailablePaymentMethods,
} from '../../services/paymentService';
import type {
  AvailablePaymentMethod,
  PaymentProvider,
} from '../../services/paymentService';

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
  const [methods, setMethods] = useState<AvailablePaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [payerPhoneNumber, setPayerPhoneNumber] = useState('');
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

  useEffect(() => {
    let active = true;

    getAvailablePaymentMethods()
      .then((response) => {
        if (!active) return;
        setMethods(response.methods);
        setSelectedProvider(
          response.methods.find((method) => method.provider === 'tranzak')?.provider ||
          response.methods[0]?.provider ||
          null
        );
        if (response.methods.length === 0) {
          setError(
            response.unavailable.map((method) => method.message).join(' ') ||
            'Aucun moyen de paiement n’est disponible pour le moment.'
          );
        }
      })
      .catch((methodsError: unknown) => {
        console.error('Unable to load payment methods:', methodsError);
        if (active) {
          const errorMessage = methodsError as {
            response?: { data?: { unavailable?: Array<{ message: string }> } };
            message?: string;
          };
          setError(
            errorMessage.response?.data?.unavailable?.map((method) => method.message).join(' ') ||
            errorMessage.message ||
            'Impossible de charger les moyens de paiement.'
          );
        }
      })
      .finally(() => {
        if (active) setLoadingMethods(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handlePayment = async () => {
    if (amount === null || amount <= 0) {
      setError('Le montant de la réservation est indisponible.');
      return;
    }
    if (!selectedProvider) {
      setError('Aucun moyen de paiement n’est disponible.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payment = await createAccommodationPayment(
        bookingId,
        amount,
        selectedProvider,
        payerPhoneNumber
      );
      if (!payment.payment_url) {
        throw new Error('Le prestataire n’a pas retourné une URL de paiement.');
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
        {loadingMethods ? (
          <p className="mt-4 text-sm text-gray-600">Chargement des moyens de paiement…</p>
        ) : (
          <div className="mt-4 space-y-3">
            {methods.map((method) => (
              <label
                key={method.provider}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  selectedProvider === method.provider
                    ? 'border-[#0000AA] bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.provider}
                  checked={selectedProvider === method.provider}
                  onChange={() => setSelectedProvider(method.provider)}
                  className="mt-1"
                />
                <span className="min-w-0">
                  <span className="block font-semibold">{method.label}</span>
                  {method.provider === 'moncash' && (
                    <span className="mt-1 block text-sm text-gray-600">
                      Vous serez redirigé vers le paiement sécurisé MonCash.
                    </span>
                  )}
                  {method.provider === 'tranzak' && (
                    <>
                      <span className="mt-1 block text-sm text-gray-600">
                        Choisissez votre canal sur la page sécurisée TRANZAK.
                      </span>
                      <span className="mt-2 flex flex-wrap gap-2">
                        {method.channels.map((channel) => (
                          <span
                            key={channel.code}
                            className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 ring-1 ring-gray-200"
                          >
                            {channel.label}
                          </span>
                        ))}
                      </span>
                    </>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}

        {selectedProvider === 'tranzak' && (
          <label className="mt-5 block text-sm font-medium text-gray-700">
            Numéro de téléphone avec indicatif pays
            <input
              type="tel"
              autoComplete="tel"
              value={payerPhoneNumber}
              onChange={(event) => setPayerPhoneNumber(event.target.value)}
              placeholder="+509 0000 0000"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </label>
        )}
      </section>

      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={
          loading ||
          loadingBooking ||
          loadingMethods ||
          amount === null ||
          !selectedProvider ||
          (selectedProvider === 'tranzak' && !payerPhoneNumber.trim())
        }
        className="w-full rounded-xl bg-[#0000AA] px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? 'Connexion au paiement sécurisé…'
          : amount === null
            ? 'Continuer vers le paiement'
            : `Continuer vers ${methods.find((method) => method.provider === selectedProvider)?.label || 'le paiement'} — ${amount.toLocaleString()} ${currency}`}
      </button>
    </div>
  );
};

export default BookingPayment;
