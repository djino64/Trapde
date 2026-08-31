import React, {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  MdArrowBack,
  MdArrowForward,
  MdHome,
  MdLocationOn,
  MdPeople,
  MdAttachMoney,
  MdSave,
} from 'react-icons/md';

import api from '../../../services/api';


/* =============================================================================
   TYPES
============================================================================= */

interface RoomForm {
  name: string;
}

interface RoomApiResponse {
  name?: unknown;
}

interface AccommodationFormData {
  name: string;
  propertyType: string;
  description: string;

  address: string;
  apartmentNumber: string;
  city: string;
  country: string;
  postalCode: string;

  latitude: string;
  longitude: string;

  bedrooms: number;
  livingRooms: number;
  otherSpaces: number;
  bathrooms: number;

  maxGuests: number;
  childrenCount: number;

  acceptsChildren: boolean;

  childrenMaxAge: number;
  childrenFreeUnder: number;
  childrenPrice: string;

  hasBabyBed: boolean;
  babyBedFree: boolean;
  babyBedPrice: string;

  surfaceArea: string;

  hasAc: boolean;
  hasHeating: boolean;
  hasWifi: boolean;
  hasKitchen: boolean;
  hasWashingMachine: boolean;
  hasTv: boolean;
  hasPool: boolean;
  hasJacuzzi: boolean;
  hasMinibar: boolean;
  hasBalcony: boolean;
  hasGarden: boolean;
  hasTerrace: boolean;

  breakfastIncluded: boolean;

  parking: string;
  parkingPrice: string;

  smokingAllowed: boolean;
  eventsAllowed: boolean;
  petsAllowed: string;

  checkInFrom: string;
  checkInTo: string;

  availableImmediately: boolean;
  availableFrom: string;

  bookingPeriodMonths: number;
  bookingPeriodRenewable: boolean;

  allowLongStay: boolean;
  maxNights: number;

  weeklyDiscount: boolean;
  weeklyDiscountRate: string;

  cancelFree24h: boolean;
  cancel1dayBefore: boolean;
  cancel1dayFee: string;
}

/**
 * Structure générique d'une réponse d'erreur Django REST Framework.
 */
interface ApiErrorResponse {
  detail?: unknown;
  error?: unknown;
  [key: string]: unknown;
}


/* =============================================================================
   DEFAULT
============================================================================= */

const DEFAULT_FORM: AccommodationFormData = {
  name: '',
  propertyType: '',
  description: '',

  address: '',
  apartmentNumber: '',
  city: '',
  country: 'Haiti',
  postalCode: '',

  latitude: '',
  longitude: '',

  bedrooms: 1,
  livingRooms: 1,
  otherSpaces: 0,
  bathrooms: 1,

  maxGuests: 2,
  childrenCount: 0,

  acceptsChildren: true,

  childrenMaxAge: 12,
  childrenFreeUnder: 0,
  childrenPrice: '0',

  hasBabyBed: false,
  babyBedFree: true,
  babyBedPrice: '0',

  surfaceArea: '',

  hasAc: false,
  hasHeating: false,
  hasWifi: true,
  hasKitchen: false,
  hasWashingMachine: false,
  hasTv: false,
  hasPool: false,
  hasJacuzzi: false,
  hasMinibar: false,
  hasBalcony: false,
  hasGarden: false,
  hasTerrace: false,

  breakfastIncluded: false,

  parking: 'none',
  parkingPrice: '0',

  smokingAllowed: false,
  eventsAllowed: false,
  petsAllowed: 'not_allowed',

  checkInFrom: '14:00',
  checkInTo: '22:00',

  availableImmediately: true,
  availableFrom: '',

  bookingPeriodMonths: 12,
  bookingPeriodRenewable: true,

  allowLongStay: false,
  maxNights: 30,

  weeklyDiscount: false,
  weeklyDiscountRate: '0',

  cancelFree24h: true,
  cancel1dayBefore: true,
  cancel1dayFee: '0',
};


/* =============================================================================
   HELPERS
============================================================================= */

const toNumber = (
  value: string | number | null | undefined,
  fallback = 0,
): number => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


const toStringValue = (
  value: unknown,
  fallback = '',
): string => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value);
};


/**
 * Transforme proprement une erreur inconnue en réponse exploitable.
 */
const getApiErrorData = (
  error: unknown,
): ApiErrorResponse | null => {
  if (
    typeof error !== 'object' ||
    error === null
  ) {
    return null;
  }

  if (
    'response' in error
  ) {
    const response = (
      error as {
        response?: {
          data?: unknown;
        };
      }
    ).response;

    if (
      response &&
      typeof response.data === 'object' &&
      response.data !== null
    ) {
      return response.data as ApiErrorResponse;
    }
  }

  return null;
};


/**
 * Extrait un message lisible depuis une erreur Django REST Framework.
 */
const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const responseData =
    getApiErrorData(error);

  if (!responseData) {
    return fallback;
  }

  if (
    typeof responseData.detail === 'string'
  ) {
    return responseData.detail;
  }

  if (
    typeof responseData.error === 'string'
  ) {
    return responseData.error;
  }

  const fields =
    Object.entries(responseData);

  if (fields.length > 0) {
    return fields
      .map(
        ([field, value]) => {
          if (Array.isArray(value)) {
            return `${field}: ${value.join(', ')}`;
          }

          if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
          ) {
            return `${field}: ${String(value)}`;
          }

          return `${field}: Erreur de validation`;
        },
      )
      .join('\n');
  }

  return fallback;
};


/* =============================================================================
   COMPONENT
============================================================================= */

const AccommodationScreen: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id?: string;
  }>();

  const accommodationId =
    id ? Number(id) : null;

  const isEditMode =
    Boolean(accommodationId);


  /* ---------------------------------------------------------------------------
     STATE
  --------------------------------------------------------------------------- */

  const [
    formData,
    setFormData,
  ] = useState<AccommodationFormData>(
    DEFAULT_FORM,
  );


  const [
,
    setRooms,
  ] = useState<RoomForm[]>([]);


  const [
    selectedLanguages,
    setSelectedLanguages,
  ] = useState<string[]>([
    'fr',
    'ht',
  ]);


  /*
   * Aucun setter n'est nécessaire actuellement.
   * On utilise simplement un tableau typé.
   */
  const customLanguages: string[] = [];


  const [
    pricePerNight,
    setPricePerNight,
  ] = useState('');


  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);


  const [
    isLoading,
    setIsLoading,
  ] = useState(isEditMode);


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  const totalSteps = 4;


  /* =============================================================================
     LOAD ACCOMMODATION
  ============================================================================= */

  useEffect(() => {
    if (
      !isEditMode ||
      !accommodationId
    ) {
      return;
    }

    const loadAccommodation =
      async (): Promise<void> => {
        try {
          setIsLoading(true);
          setError(null);

          const response =
            await api.get(
              `/accommodations/${accommodationId}/`,
            );

          const data =
            response.data;

          setFormData({
            name:
              toStringValue(data.name),

            propertyType:
              toStringValue(
                data.property_type,
              ),

            description:
              toStringValue(
                data.description,
              ),

            address:
              toStringValue(
                data.address,
              ),

            apartmentNumber:
              toStringValue(
                data.apartment_number,
              ),

            city:
              toStringValue(
                data.city,
              ),

            country:
              toStringValue(
                data.country,
                'Haiti',
              ),

            postalCode:
              toStringValue(
                data.postal_code,
              ),

            latitude:
              toStringValue(
                data.latitude,
              ),

            longitude:
              toStringValue(
                data.longitude,
              ),

            bedrooms:
              toNumber(
                data.bedrooms,
                1,
              ),

            livingRooms:
              toNumber(
                data.living_rooms,
                1,
              ),

            otherSpaces:
              toNumber(
                data.other_spaces,
              ),

            bathrooms:
              toNumber(
                data.bathrooms,
                1,
              ),

            maxGuests:
              toNumber(
                data.max_guests,
                2,
              ),

            childrenCount:
              toNumber(
                data.children_count,
              ),

            acceptsChildren:
              Boolean(
                data.accepts_children,
              ),

            childrenMaxAge:
              toNumber(
                data.children_max_age,
                12,
              ),

            childrenFreeUnder:
              toNumber(
                data.children_free_under,
              ),

            childrenPrice:
              toStringValue(
                data.children_price,
                '0',
              ),

            hasBabyBed:
              Boolean(
                data.has_baby_bed,
              ),

            babyBedFree:
              Boolean(
                data.baby_bed_free,
              ),

            babyBedPrice:
              toStringValue(
                data.baby_bed_price,
                '0',
              ),

            surfaceArea:
              toStringValue(
                data.surface_area,
              ),

            hasAc:
              Boolean(data.has_ac),

            hasHeating:
              Boolean(data.has_heating),

            hasWifi:
              Boolean(data.has_wifi),

            hasKitchen:
              Boolean(data.has_kitchen),

            hasWashingMachine:
              Boolean(
                data.has_washing_machine,
              ),

            hasTv:
              Boolean(data.has_tv),

            hasPool:
              Boolean(data.has_pool),

            hasJacuzzi:
              Boolean(data.has_jacuzzi),

            hasMinibar:
              Boolean(data.has_minibar),

            hasBalcony:
              Boolean(data.has_balcony),

            hasGarden:
              Boolean(data.has_garden),

            hasTerrace:
              Boolean(data.has_terrace),

            breakfastIncluded:
              Boolean(
                data.breakfast_included,
              ),

            parking:
              toStringValue(
                data.parking,
                'none',
              ),

            parkingPrice:
              toStringValue(
                data.parking_price,
                '0',
              ),

            smokingAllowed:
              Boolean(
                data.smoking_allowed,
              ),

            eventsAllowed:
              Boolean(
                data.events_allowed,
              ),

            petsAllowed:
              toStringValue(
                data.pets_allowed,
                'not_allowed',
              ),

            checkInFrom:
              toStringValue(
                data.check_in_from,
                '14:00',
              ),

            checkInTo:
              toStringValue(
                data.check_in_to,
                '22:00',
              ),

            availableImmediately:
              Boolean(
                data.available_immediately,
              ),

            availableFrom:
              toStringValue(
                data.available_from,
              ),

            bookingPeriodMonths:
              toNumber(
                data.booking_period_months,
                12,
              ),

            bookingPeriodRenewable:
              Boolean(
                data.booking_period_renewable,
              ),

            allowLongStay:
              Boolean(
                data.allow_long_stay,
              ),

            maxNights:
              toNumber(
                data.max_nights,
                30,
              ),

            weeklyDiscount:
              Boolean(
                data.weekly_discount,
              ),

            weeklyDiscountRate:
              toStringValue(
                data.weekly_discount_rate,
                '0',
              ),

            cancelFree24h:
              Boolean(
                data.cancel_free_24h,
              ),

            cancel1dayBefore:
              Boolean(
                data.cancel_1day_before,
              ),

            cancel1dayFee:
              toStringValue(
                data.cancel_1day_fee,
                '0',
              ),
          });


          setPricePerNight(
            toStringValue(
              data.price_per_night,
            ),
          );


          setSelectedLanguages(
            Array.isArray(data.languages)
              ? data.languages.map(
                  (language: unknown) =>
                    String(language),
                )
              : [],
          );


          if (
            Array.isArray(data.rooms)
          ) {
            const loadedRooms: RoomForm[] =
              data.rooms
                .filter(
                  (room: unknown): room is RoomApiResponse =>
                    typeof room === 'object' &&
                    room !== null,
                )
                .map(
                  (
                    room: RoomApiResponse,
                  ): RoomForm => ({
                    name:
                      toStringValue(
                        room.name,
                      ),
                  }),
                );

            setRooms(loadedRooms);
          }
        } catch (err: unknown) {
          console.error(
            'Erreur chargement accommodation:',
            err,
          );

          setError(
            getApiErrorMessage(
              err,
              'Impossible de charger cette accommodation.',
            ),
          );
        } finally {
          setIsLoading(false);
        }
      };

    void loadAccommodation();
  }, [
    isEditMode,
    accommodationId,
  ]);


  /* =============================================================================
     INPUT HELPERS
  ============================================================================= */

  const updateField = <
    K extends keyof AccommodationFormData
  >(
    field: K,
    value: AccommodationFormData[K],
  ): void => {
    setFormData(
      previous => ({
        ...previous,
        [field]: value,
      }),
    );
  };


  /* =============================================================================
     SUBMIT
  ============================================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      currentStep <
      totalSteps
    ) {
      setCurrentStep(
        previous =>
          Math.min(
            previous + 1,
            totalSteps,
          ),
      );

      return;
    }


    setIsSubmitting(true);
    setError(null);


    try {
      /*
       * Record<string, unknown> remplace
       * Record<string, any>.
       */
      const submitData: Record<
        string,
        unknown
      > = {

        name:
          formData.name.trim(),

        property_type:
          formData.propertyType,

        description:
          formData.description.trim(),

        address:
          formData.address.trim(),

        apartment_number:
          formData.apartmentNumber.trim(),

        country:
          formData.country.trim(),

        city:
          formData.city.trim(),

        postal_code:
          formData.postalCode.trim(),

        latitude:
          formData.latitude
            ? Number(formData.latitude)
            : null,

        longitude:
          formData.longitude
            ? Number(formData.longitude)
            : null,

        bedrooms:
          Number(formData.bedrooms),

        living_rooms:
          Number(formData.livingRooms),

        other_spaces:
          Number(formData.otherSpaces),

        bathrooms:
          Number(formData.bathrooms),

        surface_area:
          formData.surfaceArea
            ? Number(formData.surfaceArea)
            : 0,

        max_guests:
          Number(formData.maxGuests),

        children_count:
          Number(formData.childrenCount),

        accepts_children:
          formData.acceptsChildren,

        children_max_age:
          Number(
            formData.childrenMaxAge,
          ),

        children_free_under:
          Number(
            formData.childrenFreeUnder,
          ),

        children_price:
          formData.childrenPrice
            ? Number(
                formData.childrenPrice,
              )
            : 0,

        has_baby_bed:
          formData.hasBabyBed,

        baby_bed_free:
          formData.babyBedFree,

        baby_bed_price:
          formData.babyBedPrice
            ? Number(
                formData.babyBedPrice,
              )
            : 0,

        has_ac:
          formData.hasAc,

        has_heating:
          formData.hasHeating,

        has_wifi:
          formData.hasWifi,

        has_kitchen:
          formData.hasKitchen,

        has_washing_machine:
          formData.hasWashingMachine,

        has_tv:
          formData.hasTv,

        has_pool:
          formData.hasPool,

        has_jacuzzi:
          formData.hasJacuzzi,

        has_minibar:
          formData.hasMinibar,

        has_balcony:
          formData.hasBalcony,

        has_garden:
          formData.hasGarden,

        has_terrace:
          formData.hasTerrace,

        breakfast_included:
          formData.breakfastIncluded,

        parking:
          formData.parking,

        parking_price:
          formData.parkingPrice
            ? Number(
                formData.parkingPrice,
              )
            : 0,

        languages: [
          ...selectedLanguages,
          ...customLanguages,
        ],

        smoking_allowed:
          formData.smokingAllowed,

        events_allowed:
          formData.eventsAllowed,

        pets_allowed:
          formData.petsAllowed,

        check_in_from:
          formData.checkInFrom,

        check_in_to:
          formData.checkInTo,

        price_per_night:
          pricePerNight
            ? Number(pricePerNight)
            : 0,

        weekly_discount:
          formData.weeklyDiscount,

        weekly_discount_rate:
          formData.weeklyDiscountRate
            ? Number(
                formData.weeklyDiscountRate,
              )
            : 0,

        available_immediately:
          formData.availableImmediately,

        available_from:
          formData.availableImmediately
            ? null
            : (
                formData.availableFrom ||
                null
              ),

        booking_period_months:
          Number(
            formData.bookingPeriodMonths,
          ),

        booking_period_renewable:
          formData.bookingPeriodRenewable,

        allow_long_stay:
          formData.allowLongStay,

        max_nights:
          Number(
            formData.maxNights,
          ),

        cancel_free_24h:
          formData.cancelFree24h,

        cancel_1day_before:
          formData.cancel1dayBefore,

        cancel_1day_fee:
          formData.cancel1dayFee
            ? Number(
                formData.cancel1dayFee,
              )
            : 0,
      };


      if (
        isEditMode &&
        accommodationId
      ) {
        await api.put(
          `/accommodations/${accommodationId}/`,
          submitData,
        );
      } else {
        await api.post(
          '/accommodations/create/',
          submitData,
        );
      }


      alert(
        isEditMode
          ? 'Accommodation modifiée avec succès.'
          : 'Accommodation créée avec succès.',
      );


      navigate(
        '/partner/lojman',
      );
    } catch (err: unknown) {
      console.error(
        'Erreur lors de la sauvegarde:',
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          "Erreur lors de la sauvegarde de l'accommodation.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  /* =============================================================================
     NAVIGATION
  ============================================================================= */

  const nextStep = (): void => {
    setCurrentStep(
      previous =>
        Math.min(
          previous + 1,
          totalSteps,
        ),
    );
  };


  const previousStep = (): void => {
    setCurrentStep(
      previous =>
        Math.max(
          previous - 1,
          1,
        ),
    );
  };


  /* =============================================================================
     LOADING
  ============================================================================= */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

          <p className="text-gray-600">
            Chargement de l'accommodation...
          </p>
        </div>
      </div>
    );
  }


  /* =============================================================================
     RENDER
  ============================================================================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            type="button"
            onClick={() =>
              navigate('/partner/lojman')
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <MdArrowBack />

            Retour à mes accommodations
          </button>
        </div>
      </header>


      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode
              ? 'Modifier mon accommodation'
              : 'Ajouter une accommodation'}
          </h1>

          <p className="mt-2 text-gray-500">
            {isEditMode
              ? 'Modifiez les informations de votre accommodation.'
              : 'Ajoutez votre logement à TRAPDE.'}
          </p>
        </div>


        {/* ==========================================================
            STEPS
        ========================================================== */}

        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            {
              number: 1,
              label: 'Informations',
            },
            {
              number: 2,
              label: 'Logement',
            },
            {
              number: 3,
              label: 'Services',
            },
            {
              number: 4,
              label: 'Prix',
            },
          ].map(step => (
            <button
              key={step.number}
              type="button"
              onClick={() =>
                setCurrentStep(
                  step.number,
                )
              }
              className={`
                p-3 rounded-lg border
                ${
                  currentStep === step.number
                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-500'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-7 h-7 rounded-full bg-current/10 flex items-center justify-center">
                  {step.number}
                </span>

                <span className="text-sm font-medium">
                  {step.label}
                </span>
              </div>
            </button>
          ))}
        </div>


        {/* ==========================================================
            ERROR
        ========================================================== */}

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50">
            <p className="text-sm font-medium text-red-700 whitespace-pre-line">
              {error}
            </p>
          </div>
        )}


        {/* ==========================================================
            FORM
        ========================================================== */}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 shadow-sm"
        >

          {/* ========================================================
              STEP 1
          ======================================================== */}

          {currentStep === 1 && (
            <div className="p-6 space-y-6">

              <div className="flex items-center gap-3 mb-6">
                <MdHome
                  size={28}
                  className="text-blue-600"
                />

                <div>
                  <h2 className="text-xl font-semibold">
                    Informations générales
                  </h2>

                  <p className="text-sm text-gray-500">
                    Présentez votre accommodation.
                  </p>
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom de l'accommodation *
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    updateField(
                      'name',
                      e.target.value,
                    )
                  }
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Ex: Villa Paradis"
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  Type de propriété *
                </label>

                <select
                  value={formData.propertyType}
                  onChange={e =>
                    updateField(
                      'propertyType',
                      e.target.value,
                    )
                  }
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                >
                  <option value="">
                    Sélectionner
                  </option>

                  <option value="house">
                    Maison
                  </option>

                  <option value="apartment">
                    Appartement
                  </option>

                  <option value="villa">
                    Villa
                  </option>

                  <option value="hotel">
                    Hôtel
                  </option>

                  <option value="guesthouse">
                    Maison d'hôtes
                  </option>

                  <option value="studio">
                    Studio
                  </option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={e =>
                    updateField(
                      'description',
                      e.target.value,
                    )
                  }
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Décrivez votre accommodation..."
                />
              </div>


              <div className="border-t pt-6">

                <div className="flex items-center gap-2 mb-4">
                  <MdLocationOn className="text-blue-600" />

                  <h3 className="font-semibold">
                    Localisation
                  </h3>
                </div>


                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    value={formData.address}
                    onChange={e =>
                      updateField(
                        'address',
                        e.target.value,
                      )
                    }
                    required
                    placeholder="Adresse *"
                    className="px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    value={formData.apartmentNumber}
                    onChange={e =>
                      updateField(
                        'apartmentNumber',
                        e.target.value,
                      )
                    }
                    placeholder="Appartement / numéro"
                    className="px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    value={formData.city}
                    onChange={e =>
                      updateField(
                        'city',
                        e.target.value,
                      )
                    }
                    required
                    placeholder="Ville *"
                    className="px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    value={formData.country}
                    onChange={e =>
                      updateField(
                        'country',
                        e.target.value,
                      )
                    }
                    required
                    placeholder="Pays *"
                    className="px-4 py-3 border rounded-lg"
                  />

                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={e =>
                      updateField(
                        'postalCode',
                        e.target.value,
                      )
                    }
                    placeholder="Code postal"
                    className="px-4 py-3 border rounded-lg"
                  />

                </div>
              </div>
            </div>
          )}


          {/* ========================================================
              STEP 2
          ======================================================== */}

          {currentStep === 2 && (
            <div className="p-6 space-y-6">

              <div className="flex items-center gap-3 mb-6">

                <MdPeople
                  size={28}
                  className="text-blue-600"
                />

                <div>
                  <h2 className="text-xl font-semibold">
                    Logement
                  </h2>

                  <p className="text-sm text-gray-500">
                    Définissez les caractéristiques du logement.
                  </p>
                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chambres
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={e =>
                      updateField(
                        'bedrooms',
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Salons
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.livingRooms}
                    onChange={e =>
                      updateField(
                        'livingRooms',
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Salles de bain
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={e =>
                      updateField(
                        'bathrooms',
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Surface (m²)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={formData.surfaceArea}
                    onChange={e =>
                      updateField(
                        'surfaceArea',
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre maximum de personnes
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={e =>
                      updateField(
                        'maxGuests',
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

              </div>


              <div className="border-t pt-6">

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      formData.acceptsChildren
                    }
                    onChange={e =>
                      updateField(
                        'acceptsChildren',
                        e.target.checked,
                      )
                    }
                  />

                  <span>
                    J'accepte les enfants
                  </span>

                </label>

              </div>


              <div className="border-t pt-6">

                <h3 className="font-semibold mb-4">
                  Équipements
                </h3>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">

                  {[
                    ['hasWifi', 'Wi-Fi'],
                    ['hasAc', 'Climatisation'],
                    ['hasHeating', 'Chauffage'],
                    ['hasKitchen', 'Cuisine'],
                    ['hasWashingMachine', 'Machine à laver'],
                    ['hasTv', 'Télévision'],
                    ['hasPool', 'Piscine'],
                    ['hasJacuzzi', 'Jacuzzi'],
                    ['hasMinibar', 'Minibar'],
                    ['hasBalcony', 'Balcon'],
                    ['hasGarden', 'Jardin'],
                    ['hasTerrace', 'Terrasse'],
                  ].map(
                    ([field, label]) => (
                      <label
                        key={field}
                        className="flex items-center gap-3 p-3 border rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={
                            Boolean(
                              formData[
                                field as keyof AccommodationFormData
                              ],
                            )
                          }
                          onChange={e =>
                            updateField(
                              field as keyof AccommodationFormData,
                              e.target.checked as never,
                            )
                          }
                        />

                        <span className="text-sm">
                          {label}
                        </span>
                      </label>
                    ),
                  )}

                </div>
              </div>

            </div>
          )}


          {/* ========================================================
              STEP 3
          ======================================================== */}

          {currentStep === 3 && (
            <div className="p-6 space-y-6">

              <h2 className="text-xl font-semibold">
                Services et règles
              </h2>


              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={
                    formData.breakfastIncluded
                  }
                  onChange={e =>
                    updateField(
                      'breakfastIncluded',
                      e.target.checked,
                    )
                  }
                />

                Petit-déjeuner inclus

              </label>


              <div>

                <label className="block text-sm font-medium mb-2">
                  Parking
                </label>

                <select
                  value={formData.parking}
                  onChange={e =>
                    updateField(
                      'parking',
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                >

                  <option value="none">
                    Pas de parking
                  </option>

                  <option value="free">
                    Parking gratuit
                  </option>

                  <option value="paid">
                    Parking payant
                  </option>

                </select>

              </div>


              {formData.parking === 'paid' && (
                <input
                  type="number"
                  min="0"
                  value={formData.parkingPrice}
                  onChange={e =>
                    updateField(
                      'parkingPrice',
                      e.target.value,
                    )
                  }
                  placeholder="Prix parking"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              )}


              <div className="border-t pt-6 space-y-4">

                <h3 className="font-semibold">
                  Règles
                </h3>


                <label className="flex gap-3 items-center">

                  <input
                    type="checkbox"
                    checked={
                      formData.smokingAllowed
                    }
                    onChange={e =>
                      updateField(
                        'smokingAllowed',
                        e.target.checked,
                      )
                    }
                  />

                  Fumeurs autorisés

                </label>


                <label className="flex gap-3 items-center">

                  <input
                    type="checkbox"
                    checked={
                      formData.eventsAllowed
                    }
                    onChange={e =>
                      updateField(
                        'eventsAllowed',
                        e.target.checked,
                      )
                    }
                  />

                  Événements autorisés

                </label>

              </div>


              <div className="border-t pt-6">

                <h3 className="font-semibold mb-4">
                  Horaires d'arrivée
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm mb-2">
                      À partir de
                    </label>

                    <input
                      type="time"
                      value={
                        formData.checkInFrom
                      }
                      onChange={e =>
                        updateField(
                          'checkInFrom',
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border rounded-lg"
                    />

                  </div>


                  <div>

                    <label className="block text-sm mb-2">
                      Jusqu'à
                    </label>

                    <input
                      type="time"
                      value={
                        formData.checkInTo
                      }
                      onChange={e =>
                        updateField(
                          'checkInTo',
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border rounded-lg"
                    />

                  </div>

                </div>

              </div>


              <div className="border-t pt-6">

                <h3 className="font-semibold mb-4">
                  Disponibilité
                </h3>


                <label className="flex gap-3 items-center">

                  <input
                    type="checkbox"
                    checked={
                      formData.availableImmediately
                    }
                    onChange={e =>
                      updateField(
                        'availableImmediately',
                        e.target.checked,
                      )
                    }
                  />

                  Disponible immédiatement

                </label>


                {!formData.availableImmediately && (
                  <input
                    type="date"
                    value={
                      formData.availableFrom
                    }
                    onChange={e =>
                      updateField(
                        'availableFrom',
                        e.target.value,
                      )
                    }
                    required
                    className="mt-4 w-full px-4 py-3 border rounded-lg"
                  />
                )}

              </div>

            </div>
          )}


          {/* ========================================================
              STEP 4
          ======================================================== */}

          {currentStep === 4 && (
            <div className="p-6 space-y-6">

              <div className="flex items-center gap-3">

                <MdAttachMoney
                  size={30}
                  className="text-blue-600"
                />

                <h2 className="text-xl font-semibold">
                  Prix et disponibilité
                </h2>

              </div>


              <div>

                <label className="block text-sm font-medium mb-2">
                  Prix par nuit *
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={pricePerNight}
                  onChange={e =>
                    setPricePerNight(
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Ex: 100"
                />

              </div>


              <div className="border-t pt-6">

                <label className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={
                      formData.weeklyDiscount
                    }
                    onChange={e =>
                      updateField(
                        'weeklyDiscount',
                        e.target.checked,
                      )
                    }
                  />

                  Réduction hebdomadaire

                </label>


                {formData.weeklyDiscount && (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      formData.weeklyDiscountRate
                    }
                    onChange={e =>
                      updateField(
                        'weeklyDiscountRate',
                        e.target.value,
                      )
                    }
                    className="mt-4 w-full px-4 py-3 border rounded-lg"
                    placeholder="Pourcentage"
                  />
                )}

              </div>


              <div>

                <label className="block text-sm font-medium mb-2">
                  Nombre maximum de nuits
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    formData.maxNights
                  }
                  onChange={e =>
                    updateField(
                      'maxNights',
                      Number(
                        e.target.value,
                      ),
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg"
                />

              </div>


              <div className="rounded-xl bg-gray-50 border p-5">

                <h3 className="font-semibold mb-4">
                  Résumé
                </h3>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Accommodation
                    </span>

                    <strong>
                      {formData.name || '-'}
                    </strong>
                  </div>


                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Ville
                    </span>

                    <strong>
                      {formData.city || '-'}
                    </strong>
                  </div>


                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Prix / nuit
                    </span>

                    <strong>
                      {pricePerNight || '0'}
                    </strong>
                  </div>


                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Commission TRAPDE
                    </span>

                    <strong>
                      10%
                    </strong>
                  </div>

                </div>

              </div>


              {!isEditMode && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">

                  <p className="text-sm text-blue-800">

                    Après la création, votre accommodation
                    sera envoyée à l'administration pour validation.
                    Elle apparaîtra publiquement après son passage
                    au statut <strong>active</strong>.

                  </p>

                </div>
              )}

            </div>
          )}


          {/* ========================================================
              FOOTER
          ======================================================== */}

          <div className="px-6 py-5 border-t flex items-center justify-between">

            <button
              type="button"
              onClick={
                currentStep === 1
                  ? () =>
                      navigate(
                        '/partner/lojman',
                      )
                  : previousStep
              }
              className="flex items-center gap-2 px-5 py-3 border rounded-lg hover:bg-gray-50"
            >

              <MdArrowBack />

              {currentStep === 1
                ? 'Annuler'
                : 'Précédent'}

            </button>


            {currentStep <
            totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >

                Suivant

                <MdArrowForward />

              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >

                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                    Enregistrement...
                  </>
                ) : (
                  <>
                    <MdSave />

                    {isEditMode
                      ? 'Enregistrer les modifications'
                      : 'Publier mon accommodation'}
                  </>
                )}

              </button>
            )}

          </div>

        </form>

      </main>

    </div>
  );
};


export default AccommodationScreen;