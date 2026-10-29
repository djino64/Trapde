import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  accommodationService,
  type Booking,
} from '../../services/accommodationService';

const BookingDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadBooking = async () => {
      try {
        if (!id) return;
        const result = await accommodationService.getBooking(Number(id));
        if (active) setBooking(result);
      } catch (loadError: unknown) {
        console.error('Unable to load booking details:', loadError);
        if (active) setError(t('profile.bookingDetailLoadError'));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadBooking();
    return () => {
      active = false;
    };
  }, [id, t]);

  const cancelBooking = async () => {
    if (!booking || !window.confirm(t('profile.confirmBookingCancellation'))) return;
    setUpdating(true);
    setError('');
    try {
      setBooking(await accommodationService.cancelBooking(booking.id));
    } catch (cancelError: unknown) {
      console.error('Unable to cancel booking:', cancelError);
      setError(t('profile.bookingCancelError'));
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number | string) => new Intl.NumberFormat(
    i18n.resolvedLanguage || 'ht',
    { style: 'currency', currency: 'HTG', maximumFractionDigits: 0 }
  ).format(Number(price));
  const formatDate = (date: string) => new Intl.DateTimeFormat(
    i18n.resolvedLanguage || 'ht'
  ).format(new Date(`${date}T00:00:00`));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Link
          to="/bookings"
          state={{ activeTab: 'bookings' }}
          className="text-sm font-medium text-blue-700 underline"
        >
          {t('profile.backToBookings')}
        </Link>

        {loading ? (
          <p role="status" className="py-16 text-center text-gray-500">
            {t('accommodations.booking.loadingBookings')}
          </p>
        ) : error && !booking ? (
          <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </p>
        ) : booking ? (
          <article className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {booking.main_photo && (
              <img src={booking.main_photo} alt={booking.accommodation_name} className="h-56 w-full object-cover" />
            )}
            <div className="space-y-5 p-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('profile.bookingDetails')}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  {t('profile.bookingReference')}: {booking.reference}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{booking.accommodation_name}</h2>
                <p className="text-sm text-gray-600">{booking.accommodation_city}</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">{t('accommodations.booking.checkIn')}</dt>
                  <dd className="mt-1 font-medium text-gray-900">{formatDate(booking.check_in)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">{t('accommodations.booking.checkOut')}</dt>
                  <dd className="mt-1 font-medium text-gray-900">{formatDate(booking.check_out)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">{t('profile.bookingTotal')}</dt>
                  <dd className="mt-1 font-medium text-gray-900">{formatPrice(booking.total_price)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">{t('profile.paymentStatus')}</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {booking.payment_status
                      ? t(`profile.paymentStatuses.${booking.payment_status}`, {
                        defaultValue: booking.payment_status,
                      })
                      : t('profile.noPaymentStatus')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">{t('profile.bookingStatus')}</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {t(`accommodations.booking.status.${booking.status}`, {
                      defaultValue: booking.status,
                    })}
                  </dd>
                </div>
              </dl>
              {booking.special_requests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">{t('profile.specialRequests')}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{booking.special_requests}</p>
                </div>
              )}
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              {booking.payment_status === 'paid' && booking.status !== 'cancelled' && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  {t('profile.paidCancellationHelp')}
                </p>
              )}
              {['pending', 'confirmed'].includes(booking.status) && booking.payment_status !== 'paid' && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => void cancelBooking()}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
                >
                  {updating ? t('accommodations.booking.loadingBookings') : t('profile.cancelBooking')}
                </button>
              )}
            </div>
          </article>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetailsScreen;
