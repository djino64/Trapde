import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdLocationOn, MdBed, MdBathroom, MdPeople,
  MdStar, MdVerified, MdWifi,MdKitchen,
  MdAcUnit,MdLocalLaundryService, MdPool,MdHotTub,
  MdTv,MdBalcony, MdYard, MdFreeBreakfast,
  MdLocalParking,MdSmokingRooms,MdEmojiEvents,
  MdPets,MdAccessTime,MdCalendarToday,MdArrowBack,
  MdShare,MdFavorite, MdFavoriteBorder,MdClose,
} from 'react-icons/md';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../services/api';

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
  surface_area: number;
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

  owner_id: number;
  owner_name: string;

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

const AccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [accommodation, setAccommodation] =
    useState<Accommodation | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);

  const [showGallery, setShowGallery] = useState(false);

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

        setAccommodation(response.data);

        /*
         * Sélectionner automatiquement la photo principale
         */
        const mainIndex = response.data.photos?.findIndex(
          (photo) => photo.is_main
        );

        if (mainIndex !== undefined && mainIndex >= 0) {
          setSelectedImage(mainIndex);
        }
      } catch (err: any) {
        console.error(
          'Erreur lors du chargement de l accommodation:',
          err
        );

        if (err.response) {
          setError(
            err.response.data?.detail ||
              err.response.data?.error ||
              'Impossible de charger cette accommodation.'
          );
        } else if (err.request) {
          setError(
            'Impossible de contacter le serveur Django.'
          );
        } else {
          setError(
            'Une erreur est survenue lors du chargement.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    }
  }, [id]);

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
              Loading accommodation...
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
            Accommodation not found
          </h2>

          <p className="text-gray-500 mb-6">
            {error ||
              'Cette accommodation n’existe pas ou n’est plus disponible.'}
          </p>

          <button
            onClick={() => navigate('/accommodations')}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to listings
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

  const photos = accommodation.photos || [];

  const getPhotoUrl = (photo: Photo) => {
    return (
      photo.image_url ||
      photo.image ||
      '/images/accommodation-placeholder.jpg'
    );
  };

  /*
   * ============================================================
   * BOOKING
   * ============================================================
   */

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }

    if (guests + children > accommodation.max_guests) {
      alert(
        `This accommodation accepts maximum ${accommodation.max_guests} guests.`
      );
      return;
    }

    /*
     * Pour le moment on prépare les données.
     *
     * On pourra ensuite connecter ce bouton
     * directement à POST /api/bookings/
     */

    console.log({
      accommodation: accommodation.id,
      check_in: checkIn,
      check_out: checkOut,
      guests_count: guests,
      children_count: children,
    });

    navigate('/booking', {
      state: {
        accommodation,
        checkIn,
        checkOut,
        guests,
        children,
      },
    });
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
            navigate('/accommodations')
          }
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          <MdArrowBack size={18} />

          Back to listings
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
                {accommodation.property_type_display}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
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
              No photos available
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

            {/* RATING / OWNER */}

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
                    {accommodation.review_count}{' '}
                    reviews
                  </span>
                </div>

                {accommodation.status ===
                  'active' && (
                  <div className="flex items-center gap-1 mt-1 text-blue-600">
                    <MdVerified size={16} />

                    <span className="text-xs">
                      Verified accommodation
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-semibold text-blue-700">
                    {accommodation.owner_name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {accommodation.owner_name}
                  </p>

                  <p className="text-xs text-gray-500">
                    Partner
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-3">
                About this property
              </h2>

              <p className="text-sm leading-6 text-gray-600 whitespace-pre-line">
                {accommodation.description ||
                  'No description available.'}
              </p>
            </div>

            {/* PROPERTY DETAILS */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                Property details
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
                    Bedrooms
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
                    Bathrooms
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
                    Guests
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="block text-lg font-semibold mb-1">
                    {accommodation.surface_area}
                  </span>

                  <p className="text-xs text-gray-500">
                    m²
                  </p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  Living rooms:{' '}
                  {accommodation.living_rooms}
                </p>

                <p>
                  Other spaces:{' '}
                  {accommodation.other_spaces}
                </p>
              </div>
            </div>

            {/* ROOMS */}

            {accommodation.rooms.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="text-lg font-semibold mb-4">
                  Rooms & Beds
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
                            No beds specified
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
                                {bed.bed_type_display}
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
                Amenities
              </h2>

              <div className="grid grid-cols-2 gap-3">

                {accommodation.has_ac && (
                  <Amenity
                    icon={<MdAcUnit />}
                    label="Air conditioning"
                  />
                )}

                {accommodation.has_heating && (
                  <Amenity
                    icon={<span>🔥</span>}
                    label="Heating"
                  />
                )}

                {accommodation.has_wifi && (
                  <Amenity
                    icon={<MdWifi />}
                    label="WiFi"
                  />
                )}

                {accommodation.has_kitchen && (
                  <Amenity
                    icon={<MdKitchen />}
                    label="Kitchen"
                  />
                )}

                {accommodation.has_washing_machine && (
                  <Amenity
                    icon={<MdLocalLaundryService />}
                    label="Washing machine"
                  />
                )}

                {accommodation.has_tv && (
                  <Amenity
                    icon={<MdTv />}
                    label="TV"
                  />
                )}

                {accommodation.has_pool && (
                  <Amenity
                    icon={<MdPool />}
                    label="Swimming pool"
                  />
                )}

                {accommodation.has_jacuzzi && (
                  <Amenity
                    icon={<MdHotTub />}
                    label="Jacuzzi"
                  />
                )}

                {accommodation.has_minibar && (
                  <Amenity
                    icon={<span>🍹</span>}
                    label="Minibar"
                  />
                )}

                {accommodation.has_balcony && (
                  <Amenity
                    icon={<MdBalcony />}
                    label="Balcony"
                  />
                )}

                {accommodation.has_garden && (
                  <Amenity
                    icon={<MdYard />}
                    label="Garden"
                  />
                )}

                {accommodation.has_terrace && (
                  <Amenity
                    icon={<span>🏡</span>}
                    label="Terrace"
                  />
                )}
              </div>
            </div>

            {/* SERVICES */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                Services & Rules
              </h2>

              <div className="space-y-3 text-sm">

                {accommodation.breakfast_included && (
                  <div className="flex items-center gap-2">
                    <MdFreeBreakfast size={18} />
                    Breakfast included
                  </div>
                )}

                {accommodation.parking !==
                  'none' && (
                  <div className="flex items-center gap-2">
                    <MdLocalParking size={18} />

                    {accommodation.parking_display}

                    {accommodation.parking_price &&
                      ` - $${accommodation.parking_price}`}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MdAccessTime size={18} />

                  Check-in:{' '}
                  {accommodation.check_in_from} -{' '}
                  {accommodation.check_in_to}
                </div>

                {accommodation.smoking_allowed && (
                  <div className="flex items-center gap-2">
                    <MdSmokingRooms size={18} />
                    Smoking allowed
                  </div>
                )}

                {!accommodation.smoking_allowed && (
                  <div className="text-gray-600">
                    🚭 Smoking is not allowed
                  </div>
                )}

                {accommodation.events_allowed && (
                  <div className="flex items-center gap-2">
                    <MdEmojiEvents size={18} />
                    Events allowed
                  </div>
                )}

                {accommodation.pets_allowed !==
                  'no' && (
                  <div className="flex items-center gap-2">
                    <MdPets size={18} />
                    {accommodation.pets_allowed_display}
                  </div>
                )}
              </div>
            </div>

            {/* CHILDREN */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                Children & Baby facilities
              </h2>

              <div className="space-y-2 text-sm text-gray-600">

                <p>
                  Children:{' '}
                  {accommodation.accepts_children
                    ? 'Allowed'
                    : 'Not allowed'}
                </p>

                {accommodation.children_max_age !==
                  null && (
                  <p>
                    Maximum children age:{' '}
                    {
                      accommodation.children_max_age
                    }{' '}
                    years
                  </p>
                )}

                {accommodation.has_baby_bed && (
                  <p>
                    Baby bed:{' '}
                    {accommodation.baby_bed_free
                      ? 'Free'
                      : `$${accommodation.baby_bed_price}`}
                  </p>
                )}
              </div>
            </div>

            {/* REVIEWS */}

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold mb-4">
                Reviews
              </h2>

              {accommodation.reviews.length ===
              0 ? (
                <p className="text-sm text-gray-500">
                  No reviews yet.
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
                            ).toLocaleDateString()}
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
                  ${pricePerNight.toFixed(2)}
                </span>

                <span className="text-gray-600">
                  {' '}
                  / night
                </span>
              </div>

              {accommodation.weekly_discount && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Weekly discount:{' '}
                    {
                      accommodation.weekly_discount_rate
                    }
                    %
                  </p>

                  <p className="text-xs text-green-600 mt-1">
                    Weekly price: $
                    {weeklyPrice.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-5">

                {/* CHECK IN */}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Check-in
                  </label>

                  <div className="relative">
                    <MdCalendarToday
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />

                    <input
                      type="date"
                      value={checkIn}
                      min={
                        accommodation.available_from ||
                        undefined
                      }
                      onChange={(e) =>
                        setCheckIn(
                          e.target.value
                        )
                      }
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* CHECK OUT */}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Check-out
                  </label>

                  <div className="relative">
                    <MdCalendarToday
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />

                    <input
                      type="date"
                      value={checkOut}
                      min={
                        checkIn ||
                        accommodation.available_from ||
                        undefined
                      }
                      onChange={(e) =>
                        setCheckOut(
                          e.target.value
                        )
                      }
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* GUESTS */}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Adults / Guests
                  </label>

                  <div className="flex items-center gap-2">
                    <MdPeople
                      className="text-gray-400"
                      size={18}
                    />

                    <select
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
                          length:
                            accommodation.max_guests,
                        },
                        (_, i) => i + 1
                      ).map((num) => (
                        <option
                          key={num}
                          value={num}
                        >
                          {num}{' '}
                          {num === 1
                            ? 'guest'
                            : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CHILDREN */}

                {accommodation.accepts_children && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Children
                    </label>

                    <select
                      value={children}
                      onChange={(e) =>
                        setChildren(
                          Number(
                            e.target.value
                          )
                        )
                      }
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
                          {num === 1
                            ? 'child'
                            : 'children'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* RESERVE */}

              <button
                type="button"
                onClick={handleReserve}
                disabled={
                  accommodation.status !==
                  'active'
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {accommodation.status ===
                'active'
                  ? 'Reserve'
                  : 'Not available'}
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                You won't be charged yet
              </p>

              {/* OWNER / COMMISSION NOT SHOWN TO USER */}

              <div className="mt-5 pt-4 border-t text-xs text-gray-500">
                <p>
                  Available:{' '}
                  {accommodation.available_immediately
                    ? 'Immediately'
                    : accommodation.available_from ||
                      'See availability'}
                </p>

                <p className="mt-1">
                  Maximum stay:{' '}
                  {accommodation.max_nights}{' '}
                  nights
                </p>
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