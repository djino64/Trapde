import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MdLocationOn, MdBed, MdBathroom, MdPeople,
  MdStar, MdVerified, MdWifi,MdKitchen,
  MdAcUnit,MdLocalLaundryService, MdPool,MdHotTub,
  MdTv,MdBalcony, MdYard, MdFreeBreakfast, MdHome,
  MdLocalBar, MdDeck,
  MdLocalParking,MdSmokingRooms,MdEmojiEvents,
  MdPets,MdAccessTime,MdCalendarToday,MdArrowBack,
  MdShare,MdFavorite, MdFavoriteBorder,MdClose,
} from 'react-icons/md';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';
import { accommodationService } from '../../services/accommodationService';
import { useAuth } from '../../hooks/useAuth';

interface Photo {
  id: number;
  image: string | null;
  image_url: string | null;
  is_main: boolean;
  order: number;
  created_at: string;
}

interface Bed {
  id: number;
  bed_type: string;
  bed_type_display: string;
  quantity: number;
}

interface Room {
  id: number;
  name: string;
  beds: Bed[];
}

interface Review {
  id: number;
  author_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Accommodation {
  id: number;

  name: string;
  property_type: string;
  property_type_display: string;
  description: string;

  address: string;
  city: string;
  country: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;

  bedrooms: number;
  living_rooms: number;
  other_spaces: number;
  bathrooms: number;
  surface_area: number | null;
  max_guests: number;

  accepts_children: boolean;
  children_max_age: number | null;
  children_free_under: number | null;
  children_price: number | null;
  has_baby_bed: boolean;
  baby_bed_free: boolean;
  baby_bed_price: number | null;

  has_ac: boolean;
  has_heating: boolean;
  has_wifi: boolean;
  has_kitchen: boolean;
  has_washing_machine: boolean;
  has_tv: boolean;
  has_pool: boolean;
  has_jacuzzi: boolean;
  has_minibar: boolean;
  has_balcony: boolean;
  has_garden: boolean;
  has_terrace: boolean;

  breakfast_included: boolean;
  parking: string;
  parking_display: string;
  parking_price: number | null;
  languages: string[];
  smoking_allowed: boolean;

  events_allowed: boolean;
  pets_allowed: string;
  pets_allowed_display: string;
  check_in_from: string;
  check_in_to: string;

  price_per_night: number | string;
  weekly_discount: boolean;
  weekly_discount_rate: number | string;
  commission_rate: number | string;

  host_earnings: number | string;
  weekly_price: number | string;

  cancel_free_24h: boolean;
  cancel_1day_before: boolean;
  cancel_1day_fee: number | string;

  available_from: string | null;
  available_immediately: boolean;
  booking_period_months: number;
  booking_period_renewable: boolean;
  allow_long_stay: boolean;
  max_nights: number;

  photos: Photo[];
  rooms: Room[];
  reviews: Review[];

  average_rating: number | string | null;
  review_count: number;

  status: string;
  status_display: string;

  created_at: string;
  updated_at: string;
}

interface BookingDraft {
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
}

const AccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const bookingDraft = (
    location.state as { bookingDraft?: BookingDraft } | null
  )?.bookingDraft;

  const [accommodation, setAccommodation] =
    useState<Accommodation | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [checkIn, setCheckIn] = useState(bookingDraft?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(bookingDraft?.checkOut ?? '');
  const [guests, setGuests] = useState(bookingDraft?.guests ?? 1);
  const [children, setChildren] = useState(bookingDraft?.children ?? 0);

  const [showGallery, setShowGallery] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccessId, setBookingSuccessId] = useState<number | null>(null);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  /*
   * ============================================================
   * CHARGER L'ACCOMMODATION
   * ============================================================
   */

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get<Accommodation>(
          `/accommodations/${id}/`
        );

        if (response.data.status !== 'active') {
          setError(t('accommodations.detail.notFound'));
          return;
        }

        setAccommodation(response.data);

        /*
         * Sélectionner automatiquement la photo principale
         */
        const mainIndex = response.data.photos?.findIndex(
          (photo) => photo.is_main && Boolean(photo.image_url || photo.image)
        );

        if (mainIndex !== undefined && mainIndex >= 0) {
          setSelectedImage(mainIndex);
        }
      } catch (err: unknown) {
        console.error(
          'Unable to load public accommodation details:',
          err
        );
        setError(t('accommodations.detail.loadError'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    }
  }, [id, t]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

            <p className="text-gray-500">
              {t('accommodations.detail.loading')}
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR / NOT FOUND
   * ============================================================
   */

  if (error || !accommodation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-2xl mx-auto text-center py-20 px-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            {t('accommodations.detail.notFoundTitle')}
          </h2>

          <p className="text-gray-500 mb-6">
            {error || t('accommodations.detail.notFound')}
          </p>

          <button
            onClick={() => navigate('/accommodation')}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('accommodations.detail.back')}
          </button>
        </div>

        <Footer />
      </div>
    );
  }

  /*
   * ============================================================
   * PHOTOS
   * ============================================================
   */

  const photos = (accommodation.photos || []).filter(
    (photo) => Boolean(photo.image_url || photo.image)
  );

  const getPhotoUrl = (photo: Photo) => {
    return (
      photo.image_url ||
      photo.image ||
      ''
    );
  };

  /*
   * ============================================================
   * BOOKING
   * ============================================================
   */

  const handleReserve = async () => {
    setBookingError('');
    setBookingSuccessId(null);

    if (!checkIn || !checkOut) {
      setBookingError(t('accommodations.booking.datesRequired'));
      return;
    }

    if (checkOut <= checkIn) {
      setBookingError(t('accommodations.booking.datesInvalid'));
      return;
    }

    const stayNights =
      (Date.parse(`${checkOut}T00:00:00Z`) -
        Date.parse(`${checkIn}T00:00:00Z`)) /
      86_400_000;
    if (accommodation.max_nights > 0 && stayNights > accommodation.max_nights) {
      setBookingError(
        t('accommodations.booking.stayTooLong', {
          count: accommodation.max_nights,
        })
      );
      return;
    }

    if (checkIn < today) {
      setBookingError(t('accommodations.booking.datesInPast'));
      return;
    }

    if (guests + children > accommodation.max_guests) {
      setBookingError(
        t('accommodations.booking.guestLimit', {
          count: accommodation.max_guests,
        })
      );
      return;
    }

    if (children > 0 && !accommodation.accepts_children) {
      setBookingError(t('accommodations.booking.childrenNotAccepted'));
      return;
    }

    const accommodationId = Number(id);
    if (!isLoggedIn) {
      navigate('/login', {
        state: {
          from: {
            pathname: location.pathname,
            state: {
              bookingDraft: { checkIn, checkOut, guests, children },
            },
          },
        },
      });
      return;
    }

    setIsBooking(true);
    let isAvailable: boolean;
    try {
      try {
        const availability = await accommodationService.checkAvailability(
          accommodationId,
          checkIn,
          checkOut
        );
        isAvailable = availability.available;
      } catch (err: unknown) {
        console.error('Accommodation availability check failed:', err);
        setBookingError(t('accommodations.booking.availabilityFailed'));
        return;
      }

      if (!isAvailable) {
        setBookingError(t('accommodations.booking.notAvailable'));
        return;
      }

      try {
        const booking = await accommodationService.createBooking({
          accommodation: accommodationId,
          check_in: checkIn,
          check_out: checkOut,
          guests_count: guests,
          children_count: children,
        });
        setBookingSuccessId(booking.id);
      } catch (err: unknown) {
        console.error('Accommodation booking request failed:', err);
        setBookingError(t('accommodations.booking.bookingFailed'));
      }
    } finally {
      setIsBooking(false);
    }
  };

  /*
   * ============================================================
   * PRICE
   * ============================================================
   */

  const pricePerNight = Number(
    accommodation.price_per_night
  );

  const weeklyPrice = Number(
    accommodation.weekly_price || pricePerNight * 7
  );
  const formatPrice = (price: number) =>
    new Intl.NumberFormat(i18n.resolvedLanguage || 'ht', {
      style: 'currency',
      currency: 'HTG',
      maximumFractionDigits: 0,
    }).format(price);
  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round(
          (Date.parse(`${checkOut}T00:00:00Z`) -
            Date.parse(`${checkIn}T00:00:00Z`)) /
            86_400_000
        )
      : 0;
  const maximumGuestSelection = Math.max(
    1,
    accommodation.max_guests - children
  );
  const parkingLabel = t(
    `accommodations.amenities.parking${accommodation.parking[0]?.toUpperCase()}${accommodation.parking.slice(1)}`,
    { defaultValue: accommodation.parking_display }
  );
  const petsLabel = t(
    `accommodations.amenities.pets${accommodation.pets_allowed === 'on_request' ? 'OnRequest' : accommodation.pets_allowed === 'yes' ? 'Allowed' : 'NotAllowed'}`,
    { defaultValue: accommodation.pets_allowed_display }
  );

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* =====================================================
            BACK
        ====================================================== */}

        <button
          onClick={() =>
            navigate('/accommodation')
          }
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          <MdArrowBack size={18} />

          {t('accommodations.detail.back')}
        </button>

        {/* =====================================================
            TITLE
        ====================================================== */}

        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {accommodation.name}
              </h1>

              {accommodation.status === 'active' && (
                <MdVerified
                  className="text-blue-600"
                  size={22}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <MdLocationOn size={16} />

              <span>
                {accommodation.address},{' '}
                {accommodation.city},{' '}
                {accommodation.country}
              </span>

              <span>·</span>

              <span>
                {t(`accommodations.propertyTypes.${accommodation.property_type}`, {
                  defaultValue: accommodation.property_type,
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label={t('accommodations.detail.share')}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: accommodation.name,
                    text: accommodation.description,
                    url: window.location.href,
                  });
                }
              }}
            >
              <MdShare
                size={20}
                className="text-gray-600"
              />
            </button>

            <button
              type="button"
              aria-label={t(isFavorite
                ? 'accommodations.detail.removeFavorite'
                : 'accommodations.detail.addFavorite')}
              onClick={() =>
                setIsFavorite(!isFavorite)
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isFavorite ? (
                <MdFavorite
                  size={22}
                  className="text-red-500"
                />
              ) : (
                <MdFavoriteBorder
                  size={22}
                  className="text-gray-600"
                />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            GALLERY
        ====================================================== */}

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 h-96 mb-6 rounded-xl overflow-hidden">

            <div className="relative">
              <img
                src={getPhotoUrl(
                  photos[selectedImage] || photos[0]
                )}
                alt={accommodation.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() =>
                  setShowGallery(true)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-1">
              {photos
                .filter(
                  (_, index) =>
                    index !== selectedImage
                )
                .slice(0, 4)
                .map((photo, index) => (
                  <img
                    key={photo.id}
                    src={getPhotoUrl(photo)}
                    alt={`${accommodation.name} ${
                      index + 2
                    }`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      const realIndex =
                        photos.findIndex(
                          (p) =>
                            p.id === photo.id
                        );

                      setSelectedImage(
                        realIndex
                      );
                    }}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="h-96 mb-6 rounded-xl bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">
              {t('accommodations.detail.noPhotos')}
            </p>
          </div>
        )}

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===================================================
              MAIN CONTENT
          ==================================================== */}

          <div className="lg:col-span-2 space-y-6">

            {/* Rating and availability */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">

              <div>
                <div className="flex items-center gap-2">
                  <MdStar
                    size={19}
                    className="text-yellow-500"
                  />

                  <span className="font-semibold">
                    {Number(
                      accommodation.average_rating || 0
                    ).toFixed(1)}
                  </span>

                  <span className="text-gray-400">
                    ·
                  </span>

                  <span className="text-sm text-gray-600">
                    {accommodation.review_count} {t('accommodations.detail.reviews')}
                  </span>
                </div>

                {accommodation.status ===
                  'active' && (
                  <div className="flex items-center gap-1 mt-1 text-blue-600">
                    <MdVerified size={16} />

                    <span className="text-xs">
                      {t('accommodations.detail.verified')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-3">
                {t('accommodations.detail.about')}
              </h2>

              <p className="text-sm leading-6 text-gray-600 whitespace-pre-line">
                {accommodation.description ||
                  t('accommodations.detail.noDescription')}
              </p>
            </div>

            {/* PROPERTY DETAILS */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                {t('accommodations.detail.propertyDetails')}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MdBed
                    size={22}
                    className="mx-auto text-gray-600 mb-1"
                  />

                  <p className="font-medium">
                    {accommodation.bedrooms}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t('accommodations.detail.bedrooms')}
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MdBathroom
                    size={22}
                    className="mx-auto text-gray-600 mb-1"
                  />

                  <p className="font-medium">
                    {accommodation.bathrooms}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t('accommodations.detail.bathrooms')}
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <MdPeople
                    size={22}
                    className="mx-auto text-gray-600 mb-1"
                  />

                  <p className="font-medium">
                    {accommodation.max_guests}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t('accommodations.detail.guests')}
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="block text-lg font-semibold mb-1">
                    {accommodation.surface_area ?? '—'}
                  </span>

                  <p className="text-xs text-gray-500">
                    m²
                  </p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  {t('accommodations.detail.livingRooms')}:{' '}
                  {accommodation.living_rooms}
                </p>

                <p>
                  {t('accommodations.detail.otherSpaces')}:{' '}
                  {accommodation.other_spaces}
                </p>
              </div>
            </div>

            {/* ROOMS */}

            {accommodation.rooms.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-lg font-semibold mb-4">
                  {t('accommodations.detail.roomsAndBeds')}
                </h2>

                <div className="space-y-4">
                  {accommodation.rooms.map(
                    (room) => (
                      <div
                        key={room.id}
                        className="pb-4 border-b last:border-0"
                      >
                        <h3 className="font-medium text-gray-800 mb-2">
                          {room.name}
                        </h3>

                        {room.beds.length ===
                        0 ? (
                          <p className="text-sm text-gray-500">
                            {t('accommodations.detail.noBeds')}
                          </p>
                        ) : (
                          room.beds.map(
                            (bed) => (
                              <div
                                key={bed.id}
                                className="flex items-center gap-2 text-sm text-gray-600"
                              >
                                <MdBed size={16} />

                                {bed.quantity}{' '}
                                {t(`accommodations.bedTypes.${bed.bed_type}`, {
                                  defaultValue: bed.bed_type,
                                })}
                              </div>
                            )
                          )
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* AMENITIES */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                {t('accommodations.detail.amenities')}
              </h2>

              <div className="grid grid-cols-2 gap-3">

                {accommodation.has_ac && (
                  <Amenity
                    icon={<MdAcUnit />}
                    label={t('accommodations.amenities.airConditioning')}
                  />
                )}

                {accommodation.has_heating && (
                  <Amenity
                    icon={<MdHome />}
                    label={t('accommodations.amenities.heating')}
                  />
                )}

                {accommodation.has_wifi && (
                  <Amenity
                    icon={<MdWifi />}
                    label={t('accommodations.amenities.wifi')}
                  />
                )}

                {accommodation.has_kitchen && (
                  <Amenity
                    icon={<MdKitchen />}
                    label={t('accommodations.amenities.kitchen')}
                  />
                )}

                {accommodation.has_washing_machine && (
                  <Amenity
                    icon={<MdLocalLaundryService />}
                    label={t('accommodations.amenities.washingMachine')}
                  />
                )}

                {accommodation.has_tv && (
                  <Amenity
                    icon={<MdTv />}
                    label={t('accommodations.amenities.tv')}
                  />
                )}

                {accommodation.has_pool && (
                  <Amenity
                    icon={<MdPool />}
                    label={t('accommodations.amenities.pool')}
                  />
                )}

                {accommodation.has_jacuzzi && (
                  <Amenity
                    icon={<MdHotTub />}
                    label={t('accommodations.amenities.jacuzzi')}
                  />
                )}

                {accommodation.has_minibar && (
                  <Amenity
                    icon={<MdLocalBar />}
                    label={t('accommodations.amenities.minibar')}
                  />
                )}

                {accommodation.has_balcony && (
                  <Amenity
                    icon={<MdBalcony />}
                    label={t('accommodations.amenities.balcony')}
                  />
                )}

                {accommodation.has_garden && (
                  <Amenity
                    icon={<MdYard />}
                    label={t('accommodations.amenities.garden')}
                  />
                )}

                {accommodation.has_terrace && (
                  <Amenity
                    icon={<MdDeck />}
                    label={t('accommodations.amenities.terrace')}
                  />
                )}
              </div>
            </div>

            {/* SERVICES */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                {t('accommodations.detail.servicesAndRules')}
              </h2>

              <div className="space-y-3 text-sm">

                {accommodation.breakfast_included && (
                  <div className="flex items-center gap-2">
                    <MdFreeBreakfast size={18} />
                    {t('accommodations.detail.breakfast')}
                  </div>
                )}

                {accommodation.parking !==
                  'none' && (
                  <div className="flex items-center gap-2">
                    <MdLocalParking size={18} />

                    {parkingLabel}

                    {accommodation.parking_price
                      ? ` - ${formatPrice(Number(accommodation.parking_price))}`
                      : ''}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MdAccessTime size={18} />

                  {t('accommodations.detail.checkIn')}:{' '}
                  {accommodation.check_in_from} -{' '}
                  {accommodation.check_in_to}
                </div>

                {accommodation.smoking_allowed && (
                  <div className="flex items-center gap-2">
                    <MdSmokingRooms size={18} />
                    {t('accommodations.detail.smokingAllowed')}
                  </div>
                )}

                {!accommodation.smoking_allowed && (
                  <div className="text-gray-600">
                    {t('accommodations.detail.smokingNotAllowed')}
                  </div>
                )}

                {accommodation.events_allowed && (
                  <div className="flex items-center gap-2">
                    <MdEmojiEvents size={18} />
                    {t('accommodations.detail.eventsAllowed')}
                  </div>
                )}

                {accommodation.pets_allowed !==
                  'no' && (
                  <div className="flex items-center gap-2">
                    <MdPets size={18} />
                    {petsLabel}
                  </div>
                )}
                {accommodation.languages.length > 0 && (
                  <p>
                    <span className="font-medium">
                      {t('accommodations.detail.languagesSpoken')}:
                    </span>{' '}
                    {accommodation.languages.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {(accommodation.cancel_free_24h ||
              accommodation.cancel_1day_before) && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-lg font-semibold mb-3">
                  {t('accommodations.detail.cancellation')}
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  {accommodation.cancel_free_24h && (
                    <p>{t('accommodations.detail.freeCancellation24h')}</p>
                  )}
                  {accommodation.cancel_1day_before && (
                    <p>
                      {t('accommodations.detail.cancelOneDayBefore')}
                      {Number(accommodation.cancel_1day_fee) > 0 &&
                        ` — ${t('accommodations.detail.cancellationFee')}: ${formatPrice(Number(accommodation.cancel_1day_fee))}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* CHILDREN */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                {t('accommodations.detail.childrenAndBaby')}
              </h2>

              <div className="space-y-2 text-sm text-gray-600">

                <p>
                  {t('accommodations.detail.children')}:{' '}
                  {accommodation.accepts_children
                    ? t('accommodations.detail.childrenAllowed')
                    : t('accommodations.detail.childrenNotAllowed')}
                </p>

                {accommodation.children_max_age !==
                  null && (
                  <p>
                    {t('accommodations.detail.maximumChildrenAge')}:{' '}
                    {
                      accommodation.children_max_age
                    }{' '}
                    {t('accommodations.detail.years')}
                  </p>
                )}

                {accommodation.has_baby_bed && (
                  <p>
                    {t('accommodations.detail.babyBed')}:{' '}
                    {accommodation.baby_bed_free
                      ? t('common.free')
                      : formatPrice(Number(accommodation.baby_bed_price))}
                  </p>
                )}
              </div>
            </div>

            {/* REVIEWS */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                {t('accommodations.detail.reviewsTitle')}
              </h2>

              {accommodation.reviews.length ===
              0 ? (
                <p className="text-sm text-gray-500">
                  {t('accommodations.detail.noReviews')}
                </p>
              ) : (
                <div className="space-y-5">
                  {accommodation.reviews.map(
                    (review) => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-0"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">
                              {review.author_name}
                            </p>

                            <div className="flex items-center gap-1">
                              <MdStar
                                size={16}
                                className="text-yellow-500"
                              />

                              <span className="text-sm">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>

                          <span className="text-xs text-gray-400">
                            {new Date(
                              review.created_at
                            ).toLocaleDateString(i18n.resolvedLanguage || 'ht')}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                          {review.comment}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===================================================
              BOOKING SIDEBAR
          ==================================================== */}

          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-5">

              <div className="mb-4">
                <span className="text-2xl font-bold">
                  {formatPrice(pricePerNight)}
                </span>

                <span className="text-gray-600">
                  {' '}
                  / {t('accommodations.detail.night')}
                </span>
              </div>

              {accommodation.weekly_discount && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    {t('accommodations.detail.weeklyDiscount')}:{' '}
                    {
                      accommodation.weekly_discount_rate
                    }
                    %
                  </p>

                  <p className="text-xs text-green-600 mt-1">
                    {t('accommodations.detail.weeklyPrice')}:{' '}
                    {formatPrice(weeklyPrice)}
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-5">

                {/* CHECK IN */}

                <div>
                  <label htmlFor="accommodation-check-in" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('accommodations.booking.checkIn')}
                  </label>

                  <div className="relative">
                    <MdCalendarToday
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />

                    <input
                      id="accommodation-check-in"
                      type="date"
                      value={checkIn}
                      min={accommodation.available_from &&
                        accommodation.available_from > today
                        ? accommodation.available_from
                        : today}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        setBookingError('');
                        setBookingSuccessId(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* CHECK OUT */}

                <div>
                  <label htmlFor="accommodation-check-out" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('accommodations.booking.checkOut')}
                  </label>

                  <div className="relative">
                    <MdCalendarToday
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />

                    <input
                      id="accommodation-check-out"
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        setBookingError('');
                        setBookingSuccessId(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* GUESTS */}

                <div>
                  <label htmlFor="accommodation-guest-count" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('accommodations.booking.guests')}
                  </label>

                  <div className="flex items-center gap-2">
                    <MdPeople
                      className="text-gray-400"
                      size={18}
                    />

                    <select
                      id="accommodation-guest-count"
                      value={guests}
                      onChange={(e) =>
                        setGuests(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      {Array.from(
                        {
                          length: maximumGuestSelection,
                        },
                        (_, i) => i + 1
                      ).map((num) => (
                        <option
                          key={num}
                          value={num}
                        >
                          {num}{' '}
                          {t(num === 1
                            ? 'accommodations.card.guest'
                            : 'accommodations.card.guests')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CHILDREN */}

                {accommodation.accepts_children && (
                  <div>
                    <label htmlFor="accommodation-child-count" className="block text-xs font-medium text-gray-600 mb-1">
                      {t('accommodations.booking.children')}
                    </label>

                    <select
                      id="accommodation-child-count"
                      value={children}
                      onChange={(e) => {
                      const nextChildren = Number(e.target.value);
                      setChildren(nextChildren);
                      if (guests + nextChildren > accommodation.max_guests) {
                        setGuests(Math.max(1, accommodation.max_guests - nextChildren));
                      }
                      setBookingError('');
                      setBookingSuccessId(null);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      {Array.from(
                        {
                          length:
                            Math.max(
                              0,
                              accommodation.max_guests -
                                guests
                            ) + 1,
                        },
                        (_, i) => i
                      ).map((num) => (
                        <option
                          key={num}
                          value={num}
                        >
                          {num}{' '}
                          {t('accommodations.booking.children')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {nights > 0 && (
                  <p className="text-sm font-medium text-gray-700">
                    {t('accommodations.booking.estimate', { nights })}:{' '}
                    {formatPrice(pricePerNight * nights)}
                  </p>
                )}
              </div>

              {bookingError && (
                <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {bookingError}
                </p>
              )}

              {bookingSuccessId !== null && (
                <div role="status" className="mb-3 rounded-lg bg-green-50 px-3 py-3 text-sm text-green-800">
                  <p>{t('accommodations.booking.success', { id: bookingSuccessId })}</p>
                  <p className="mt-1">{t('accommodations.booking.bookingPending')}</p>
                  <Link to="/profile" state={{ activeTab: 'bookings' }} className="mt-2 inline-block font-medium underline">
                    {t('accommodations.booking.viewBookings')}
                  </Link>
                </div>
              )}

              {/* RESERVE */}

              <button
                type="button"
                onClick={handleReserve}
                disabled={
                  isBooking ||
                  accommodation.status !==
                  'active'
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isBooking
                  ? t('accommodations.booking.processing')
                  : accommodation.status === 'active'
                    ? t('accommodations.booking.checkAvailability')
                    : t('accommodations.booking.unavailable')}
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                {t('accommodations.booking.notCharged')}
              </p>

              <div className="mt-5 pt-4 border-t text-xs text-gray-500">
                <p>
                  {t('accommodations.detail.availability')}:{' '}
                  {accommodation.available_immediately
                    ? t('accommodations.detail.availableImmediately')
                    : accommodation.available_from
                      ? t('accommodations.detail.availableFrom', {
                          date: new Date(`${accommodation.available_from}T00:00:00`).toLocaleDateString(
                            i18n.resolvedLanguage || 'ht'
                          ),
                        })
                      : t('accommodations.booking.checkAvailability')}
                </p>

                {accommodation.max_nights > 0 && (
                  <p className="mt-1">
                    {t('accommodations.detail.maximumStay')}:{' '}
                    {accommodation.max_nights}{' '}
                    {t('accommodations.detail.nights')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          FULLSCREEN GALLERY
      ======================================================== */}

      {showGallery && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">

          <button
            onClick={() =>
              setShowGallery(false)
            }
            aria-label={t('accommodations.detail.closeGallery')}
            className="absolute top-5 right-5 text-white"
          >
            <MdClose size={30} />
          </button>

          <div className="max-w-5xl w-full">
            <img
              src={getPhotoUrl(
                photos[selectedImage]
              )}
              alt={accommodation.name}
              className="w-full max-h-[80vh] object-contain"
            />

            <div className="flex gap-2 mt-4 overflow-x-auto justify-center">
              {photos.map(
                (photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`w-20 h-16 rounded overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getPhotoUrl(photo)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

/*
 * ============================================================
 * AMENITY COMPONENT
 * ============================================================
 */

interface AmenityProps {
  icon: React.ReactNode;
  label: string;
}

const Amenity: React.FC<AmenityProps> = ({
  icon,
  label,
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <span className="text-gray-600">
        {icon}
      </span>

      {label}
    </div>
  );
};

export default AccommodationDetails;