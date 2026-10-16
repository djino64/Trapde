/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import {
  createAccommodationPayment,
} from '../../services/paymentService';

interface BookingPaymentProps {
  bookingId: number;
  amount: number;
  currency?: string;
}

const BookingPayment: React.FC<
  BookingPaymentProps
> = ({
  bookingId,
  amount,
  currency = 'HTG',
}) => {


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const handlePayment = async () => {

    try {

      setLoading(true);
      setError(null);

      const payment =
        await createAccommodationPayment(
          bookingId
        );

      if (!payment.payment_url) {

        throw new Error(
          'MonCash n’a pas retourné une URL de paiement.'
        );
      }

      /*
       * On sauvegarde temporairement
       * l'identifiant du paiement.
       */

      localStorage.setItem(
        'trapde_pending_payment_id',
        String(payment.id)
      );

      localStorage.setItem(
        'trapde_pending_booking_id',
        String(bookingId)
      );

      /*
       * Redirection réelle vers
       * MonCash Sandbox.
       */

      window.location.href =
        payment.payment_url;

    } catch (err: any) {

      console.error(
        'Payment error:',
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Impossible de démarrer le paiement.'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="space-y-6">

      <div className="rounded-xl border p-6">

        <h2 className="text-xl font-semibold">
          Paiement
        </h2>

        <div className="mt-4">

          <p className="text-gray-500">
            Montant à payer
          </p>

          <p className="text-2xl font-bold">
            {amount.toLocaleString()} {currency}
          </p>

        </div>

      </div>


      {error && (

        <div className="rounded-lg bg-red-50 p-4 text-red-700">

          {error}

        </div>

      )}


      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-[#0000AA]
          px-6
          py-4
          font-semibold
          text-white
          transition
          hover:bg-blue-800
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        {loading
          ? 'Connexion à MonCash...'
          : `Payer ${amount.toLocaleString()} ${currency}`
        }

      </button>

    </div>
  );
};

export default BookingPayment;