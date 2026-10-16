/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  verifyPayment,
} from '../../services/paymentService';


const BookingConfirmation: React.FC =
  () => {

    const navigate = useNavigate();

    const [loading, setLoading] =
      useState(true);

    const [success, setSuccess] =
      useState(false);

    const [message, setMessage] =
      useState('Vérification du paiement...');


    useEffect(() => {

      const verify = async () => {

        const paymentId =
          localStorage.getItem(
            'trapde_pending_payment_id'
          );

        if (!paymentId) {

          setLoading(false);

          setMessage(
            'Aucun paiement en attente.'
          );

          return;
        }

        try {

          const result =
            await verifyPayment(
              Number(paymentId)
            );

          if (
            result.success &&
            result.payment.status === 'paid'
          ) {

            setSuccess(true);

            setMessage(
              'Votre paiement a été confirmé.'
            );

            localStorage.removeItem(
              'trapde_pending_payment_id'
            );

            localStorage.removeItem(
              'trapde_pending_booking_id'
            );

          } else {

            setSuccess(false);

            setMessage(
              result.message ||
              'Le paiement n’est pas encore confirmé.'
            );

          }

        } catch (error: any) {

          console.error(
            'Payment verification error:',
            error
          );

          setSuccess(false);

          setMessage(
            error?.response?.data?.detail ||
            'Impossible de vérifier le paiement.'
          );

        } finally {

          setLoading(false);

        }
      };


      verify();

    }, []);


    if (loading) {

      return (
        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <div className="mb-4 text-4xl">
              ⏳
            </div>

            <p>
              {message}
            </p>

          </div>

        </div>
      );
    }


    return (
      <div className="mx-auto max-w-xl p-6">

        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">

          <div className="mb-4 text-5xl">

            {success ? '✓' : '!'}

          </div>

          <h1 className="text-2xl font-bold">

            {success
              ? 'Réservation confirmée'
              : 'Paiement en attente'
            }

          </h1>

          <p className="mt-3 text-gray-600">
            {message}
          </p>


          {success && (

            <button
              onClick={() =>
                navigate('/bookings')
              }
              className="
                mt-6
                rounded-xl
                bg-[#0000AA]
                px-6
                py-3
                font-semibold
                text-white
              "
            >
              Voir mes réservations
            </button>

          )}

        </div>

      </div>
    );
  };


export default BookingConfirmation;