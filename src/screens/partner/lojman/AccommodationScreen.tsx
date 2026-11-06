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
  MdCheck,
  MdHome,
  MdLocationOn,
  MdKingBed,
  MdAttachMoney,
  MdSave,
  MdWifi,
  MdAcUnit,
  MdDeviceThermostat,
  MdKitchen,
  MdLocalLaundryService,
  MdTv,
  MdPool,
  MdHotTub,
  MdLocalBar,
  MdBalcony,
  MdYard,
  MdDeck,
  MdChildCare,
  MdCrib,
  MdLocalParking,
  MdSmokingRooms,
  MdCelebration,
  MdAccessTime,
  MdEventAvailable,
  MdFlightTakeoff,
  MdOutlineFreeBreakfast,
  MdErrorOutline,
} from 'react-icons/md';

import api from '../../../services/api';


/* =============================================================================
   TYPES
============================================================================= */

interface RoomForm {
  name: string;
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
  country: 'HT',
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
  petsAllowed: 'no',

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
   STATIC CONFIG
============================================================================= */

const STEPS = [
  { number: 1, label: 'Informations', hint: 'Le logement' },
  { number: 2, label: 'Logement', hint: 'Capacité' },
  { number: 3, label: 'Services', hint: 'Règles' },
  { number: 4, label: 'Tarif', hint: 'Publication' },
] as const;

const AMENITIES: Array<{
  field: keyof AccommodationFormData;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { field: 'hasWifi', label: 'Wi-Fi', icon: MdWifi },
  { field: 'hasAc', label: 'Climatisation', icon: MdAcUnit },
  { field: 'hasHeating', label: 'Chauffage', icon: MdDeviceThermostat },
  { field: 'hasKitchen', label: 'Cuisine équipée', icon: MdKitchen },
  { field: 'hasWashingMachine', label: 'Machine à laver', icon: MdLocalLaundryService },
  { field: 'hasTv', label: 'Télévision', icon: MdTv },
  { field: 'hasPool', label: 'Piscine', icon: MdPool },
  { field: 'hasJacuzzi', label: 'Jacuzzi', icon: MdHotTub },
  { field: 'hasMinibar', label: 'Minibar', icon: MdLocalBar },
  { field: 'hasBalcony', label: 'Balcon', icon: MdBalcony },
  { field: 'hasGarden', label: 'Jardin', icon: MdYard },
  { field: 'hasTerrace', label: 'Terrasse', icon: MdDeck },
];


/* =============================================================================
   HELPERS
============================================================================= */

const toNumber = (
  value: string | number | null | undefined,
  fallback = 0
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
  fallback = ''
): string => {

  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value);
};


const formatGourdes = (
  value: string
): string => {

  const number = toNumber(value, 0);

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(number);

};


/* =============================================================================
   REUSABLE FIELD PRIMITIVES
============================================================================= */

const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, children }) => (

  <label className="acc-field">
    <span className="acc-field-label">
      {label}
      {required && <span className="acc-required">*</span>}
    </span>
    {children}
    {hint && <span className="acc-field-hint">{hint}</span>}
  </label>

);


const SectionHeading: React.FC<{
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (

  <div className="acc-section-heading">
    <span className="acc-section-icon">
      <Icon size={22} />
    </span>
    <div>
      <h2 className="acc-section-title">{title}</h2>
      <p className="acc-section-subtitle">{subtitle}</p>
    </div>
  </div>

);


/* =============================================================================
   COMPONENT
============================================================================= */

const AccommodationScreen: React.FC = () => {

  const navigate = useNavigate();

  const { id } = useParams<{
    id?: string;
  }>();


  const accommodationId = id ? Number(id) : null;


  const isEditMode =
    Boolean(accommodationId);


  /* ---------------------------------------------------------------------------
     STATE
  --------------------------------------------------------------------------- */

  const [
    formData,
    setFormData,
  ] = useState<AccommodationFormData>(
    DEFAULT_FORM
  );


  const [
    rooms,
    setRooms,
  ] = useState<RoomForm[]>([]);
  void rooms;

  const [
    selectedLanguages,
    setSelectedLanguages,
  ] = useState<string[]>([
    'fr',
    'ht',
  ]);

  const [
    customLanguages,
    setCustomLanguages,
  ] = useState<string[]>([]);
  void setCustomLanguages;

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
  ] = useState(
    isEditMode
  );


  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  const totalSteps = 4;


  /* =============================================================================
     LOAD ACCOMMODATION
  ============================================================================= */

  useEffect(() => {

    if (!isEditMode || !accommodationId) {
      return;
    }


    const loadAccommodation = async () => {

      try {

        setIsLoading(true);
        setError(null);


        const response =
          await api.get(
            `/accommodations/${accommodationId}/`
          );


        const data = response.data;


        /*
         * IMPORTANT :
         *
         * Backend renvoie "name".
         * Ancien frontend utilisait "propertyName".
         */

        setFormData({

          name: toStringValue(
            data.name
          ),

          propertyType:
            toStringValue(
              data.property_type
            ),

          description:
            toStringValue(
              data.description
            ),

          address:
            toStringValue(
              data.address
            ),

          apartmentNumber:
            toStringValue(
              data.apartment_number
            ),

          city:
            toStringValue(
              data.city
            ),

          country:
            (() => {
              const value = toStringValue(data.country, 'HT');
              return value ? value.toUpperCase().slice(0, 2) : 'HT';
            })(),

          postalCode:
            toStringValue(
              data.postal_code
            ),

          latitude:
            toStringValue(
              data.latitude
            ),

          longitude:
            toStringValue(
              data.longitude
            ),

          bedrooms:
            toNumber(
              data.bedrooms,
              1
            ),

          livingRooms:
            toNumber(
              data.living_rooms,
              1
            ),

          otherSpaces:
            toNumber(
              data.other_spaces
            ),

          bathrooms:
            toNumber(
              data.bathrooms,
              1
            ),

          maxGuests:
            toNumber(
              data.max_guests,
              2
            ),

          childrenCount:
            toNumber(
              data.children_count
            ),

          acceptsChildren:
            Boolean(
              data.accepts_children
            ),

          childrenMaxAge:
            toNumber(
              data.children_max_age,
              12
            ),

          childrenFreeUnder:
            toNumber(
              data.children_free_under
            ),

          childrenPrice:
            toStringValue(
              data.children_price,
              '0'
            ),

          hasBabyBed:
            Boolean(
              data.has_baby_bed
            ),

          babyBedFree:
            Boolean(
              data.baby_bed_free
            ),

          babyBedPrice:
            toStringValue(
              data.baby_bed_price,
              '0'
            ),

          surfaceArea:
            toStringValue(
              data.surface_area
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
              data.has_washing_machine
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
              data.breakfast_included
            ),

          parking:
            toStringValue(
              data.parking,
              'none'
            ),

          parkingPrice:
            toStringValue(
              data.parking_price,
              '0'
            ),

          smokingAllowed:
            Boolean(
              data.smoking_allowed
            ),

          eventsAllowed:
            Boolean(
              data.events_allowed
            ),

          petsAllowed:
            (() => {
              const value = toStringValue(data.pets_allowed, 'no');
              return ['yes', 'no', 'on_request'].includes(value) ? value : 'no';
            })(),

          checkInFrom:
            toStringValue(
              data.check_in_from,
              '14:00'
            ),

          checkInTo:
            toStringValue(
              data.check_in_to,
              '22:00'
            ),

          availableImmediately:
            Boolean(
              data.available_immediately
            ),

          availableFrom:
            toStringValue(
              data.available_from
            ),

          bookingPeriodMonths:
            toNumber(
              data.booking_period_months,
              12
            ),

          bookingPeriodRenewable:
            Boolean(
              data.booking_period_renewable
            ),

          allowLongStay:
            Boolean(
              data.allow_long_stay
            ),

          maxNights:
            toNumber(
              data.max_nights,
              30
            ),

          weeklyDiscount:
            Boolean(
              data.weekly_discount
            ),

          weeklyDiscountRate:
            toStringValue(
              data.weekly_discount_rate,
              '0'
            ),

          cancelFree24h:
            Boolean(
              data.cancel_free_24h
            ),

          cancel1dayBefore:
            Boolean(
              data.cancel_1day_before
            ),

          cancel1dayFee:
            toStringValue(
              data.cancel_1day_fee,
              '0'
            ),
        });


        setPricePerNight(
          toStringValue(
            data.price_per_night
          )
        );


        setSelectedLanguages(
          Array.isArray(data.languages)
            ? data.languages
            : []
        );


        if (
          Array.isArray(data.rooms)
        ) {

          setRooms(
            data.rooms.map(
              (room: any) => ({
                name:
                  toStringValue(
                    room.name
                  ),
              })
            )
          );

        }

      } catch (err: any) {

        console.error(
          'Erreur chargement accommodation:',
          err
        );


        setError(
          err.response?.data?.detail ||
          err.response?.data?.error ||
          'Impossible de charger cette accommodation.'
        );

      } finally {

        setIsLoading(false);

      }
    };


    loadAccommodation();

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
    value: AccommodationFormData[K]
  ) => {

    setFormData(
      previous => ({
        ...previous,
        [field]: value,
      })
    );

  };


  const toggleAmenity = (
    field: keyof AccommodationFormData
  ) => {

    updateField(
      field,
      (!formData[field]) as never
    );

  };


  /* =============================================================================
     SUBMIT
  ============================================================================= */

  const handleSubmit = async (
    event: FormEvent
  ) => {

    event.preventDefault();


    if (
      currentStep <
      totalSteps
    ) {

      setCurrentStep(
        previous =>
          Math.min(
            previous + 1,
            totalSteps
          )
      );

      return;
    }


    setIsSubmitting(true);
    setError(null);


    try {

      /*
       * IMPORTANT :
       *
       * Ces noms correspondent exactement
       * aux champs Django.
       */

      const normalizedPropertyType = [
        'house',
        'apartment',
        'villa',
        'hotel',
        'guesthouse',
        'cabin',
        'other',
      ].includes(formData.propertyType)
        ? formData.propertyType
        : 'house';

      const normalizedCountry = (
        formData.country || 'HT'
      ).trim().toUpperCase().slice(0, 2) || 'HT';

      const normalizedPetsAllowed = [
        'yes',
        'no',
        'on_request',
      ].includes(formData.petsAllowed)
        ? formData.petsAllowed
        : 'no';

      const submitData: Record<
        string,
        any
      > = {

        // ---------------------------------------------------------
        // GENERAL
        // ---------------------------------------------------------

        name:
          formData.name.trim(),

        property_type:
          normalizedPropertyType,

        description:
          formData.description.trim(),


        // ---------------------------------------------------------
        // LOCATION
        // ---------------------------------------------------------

        address:
          formData.address.trim(),

        apartment_number:
          formData.apartmentNumber.trim(),

        country:
          normalizedCountry,

        city:
          formData.city.trim(),

        postal_code:
          formData.postalCode.trim(),

        latitude:
          formData.latitude ? Number(formData.latitude) : null,

        longitude:
          formData.longitude ? Number(formData.longitude) : null,


        // ---------------------------------------------------------
        // ACCOMMODATION
        // ---------------------------------------------------------

        bedrooms:
          Number(formData.bedrooms),

        living_rooms:
          Number(formData.livingRooms),

        other_spaces:
          Number(formData.otherSpaces),

        bathrooms:
          Number(formData.bathrooms),

        surface_area:
          formData.surfaceArea ? Number(formData.surfaceArea) : 0,

        max_guests:
          Number(formData.maxGuests),


        // ---------------------------------------------------------
        // CHILDREN
        // ---------------------------------------------------------

        accepts_children:
          formData.acceptsChildren,

        children_max_age:
          Number(
            formData.childrenMaxAge
          ),

        children_free_under:
          Number(
            formData.childrenFreeUnder
          ),

        children_price:
          formData.childrenPrice
            ? Number(
                formData.childrenPrice
              )
            : 0,


        // ---------------------------------------------------------
        // BABY BED
        // ---------------------------------------------------------

        has_baby_bed:
          formData.hasBabyBed,

        baby_bed_free:
          formData.babyBedFree,

        baby_bed_price:
          formData.babyBedPrice
            ? Number(
                formData.babyBedPrice
              )
            : 0,


        // ---------------------------------------------------------
        // EQUIPMENT
        // ---------------------------------------------------------

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


        // ---------------------------------------------------------
        // SERVICES
        // ---------------------------------------------------------

        breakfast_included:
          formData.breakfastIncluded,

        parking:
          formData.parking,

        parking_price:
          formData.parkingPrice
            ? Number(
                formData.parkingPrice
              )
            : 0,

        languages: [
          ...selectedLanguages,
          ...customLanguages,
        ],


        // ---------------------------------------------------------
        // RULES
        // ---------------------------------------------------------

        smoking_allowed:
          formData.smokingAllowed,

        events_allowed:
          formData.eventsAllowed,

        pets_allowed:
          normalizedPetsAllowed,


        // ---------------------------------------------------------
        // CHECK IN
        // ---------------------------------------------------------

        check_in_from:
          formData.checkInFrom,

        check_in_to:
          formData.checkInTo,


        // ---------------------------------------------------------
        // PRICE
        // ---------------------------------------------------------

        price_per_night:
          pricePerNight
            ? Number(
                pricePerNight
              )
            : 0,

        weekly_discount:
          formData.weeklyDiscount,

        weekly_discount_rate:
          formData.weeklyDiscountRate
            ? Number(
                formData.weeklyDiscountRate
              )
            : 0,


        // ---------------------------------------------------------
        // AVAILABILITY
        // ---------------------------------------------------------

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
            formData.bookingPeriodMonths
          ),

        booking_period_renewable:
          formData.bookingPeriodRenewable,

        allow_long_stay:
          formData.allowLongStay,

        max_nights:
          Number(
            formData.maxNights
          ),


        // ---------------------------------------------------------
        // CANCELLATION
        // ---------------------------------------------------------

        cancel_free_24h:
          formData.cancelFree24h,

        cancel_1day_before:
          formData.cancel1dayBefore,

        cancel_1day_fee:
          formData.cancel1dayFee
            ? Number(
                formData.cancel1dayFee
              )
            : 0,
      };


      let response;


      /* =============================================================
         EDIT
      ============================================================= */

      if (
        isEditMode &&
        accommodationId
      ) {

        response =
          await api.put(
            `/accommodations/${accommodationId}/`,
            submitData
          );

      }

      /* =============================================================
         CREATE
      ============================================================= */

      else {

        response =
          await api.post(
            '/accommodations/create/',
            submitData
          );

      }


      console.log(
        'Accommodation sauvegardée:',
        response.data
      );


      navigate(
        '/partner/lojman'
      );

    } catch (err: any) {

      console.error(
        'Erreur lors de la sauvegarde:',
        err
      );


      /*
       * Django REST Framework peut retourner :
       *
       * {
       *   "name": ["..."],
       *   "price_per_night": ["..."]
       * }
       */

      const responseData =
        err.response?.data;


      let message =
        'Erreur lors de la sauvegarde de l accommodation.';


      if (
        responseData
      ) {

        if (
          responseData.detail
        ) {

          message =
            responseData.detail;

        } else if (
          responseData.error
        ) {

          message =
            responseData.error;

        } else {

          const fields =
            Object.entries(
              responseData
            );

          if (
            fields.length
          ) {

            message =
              fields
                .map(
                  ([field, value]) =>
                    `${field} : ${
                      Array.isArray(value)
                        ? value.join(', ')
                        : String(value)
                    }`
                )
                .join('\n');

          }

        }

      }


      setError(
        message
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  /* =============================================================================
     NAVIGATION
  ============================================================================= */

  const nextStep = () => {

    setCurrentStep(
      previous =>
        Math.min(
          previous + 1,
          totalSteps
        )
    );

  };


  const previousStep = () => {

    setCurrentStep(
      previous =>
        Math.max(
          previous - 1,
          1
        )
    );

  };


  /* =============================================================================
     LOADING
  ============================================================================= */

  if (isLoading) {

    return (
      <div className="acc-loading-shell">
        <TrapdeStyles />
        <div className="acc-loading-card">
          <span className="acc-loading-plane">
            <MdFlightTakeoff size={26} />
          </span>
          <p>Chargement de votre accommodation…</p>
        </div>
      </div>
    );

  }


  /* =============================================================================
     RENDER
  ============================================================================= */

  return (

    <div className="acc-shell">

      <TrapdeStyles />

      {/* ============================================================
          HEADER
      ============================================================ */}

      <header className="acc-topbar">

        <div className="acc-topbar-inner">

          <button
            type="button"
            onClick={() =>
              navigate(
                '/partner/lojman'
              )
            }
            className="acc-back-link"
          >

            <MdArrowBack size={18} />

            Retour à mes accommodations

          </button>

          <span className="acc-topbar-brand">
            TRA<span>PDE</span>
            <em>Espace hôte</em>
          </span>

        </div>

      </header>


      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className="acc-main">

        <div className="acc-hero">

          <span className="acc-eyebrow">
            {isEditMode ? 'Modification' : 'Nouvelle annonce'}
          </span>

          <h1 className="acc-title">

            {isEditMode
              ? 'Modifier mon accommodation'
              : 'Faites embarquer votre logement sur TRAPDE'}

          </h1>


          <p className="acc-subtitle">

            {isEditMode
              ? 'Ajustez les informations de votre accommodation, elles seront visibles après validation.'
              : "Quatre étapes courtes suffisent pour préparer votre logement à l'accueil des voyageurs."}

          </p>

        </div>


        {/* ==========================================================
            SIGNATURE STEPPER — "FLIGHT PATH"
        ========================================================== */}

        <nav
          className="acc-flightpath"
          aria-label="Étapes du formulaire"
        >

          <div className="acc-flightpath-track">

            <div
              className="acc-flightpath-fill"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />

            <span
              className="acc-flightpath-plane"
              style={{
                left: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            >
              <MdFlightTakeoff size={16} />
            </span>

          </div>

          <div className="acc-flightpath-stops">

            {STEPS.map(step => {

              const isDone = step.number < currentStep;
              const isActive = step.number === currentStep;

              return (

                <button
                  key={step.number}
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`acc-stop ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                >

                  <span className="acc-stop-dot">
                    {isDone ? <MdCheck size={14} /> : step.number}
                  </span>

                  <span className="acc-stop-text">
                    <strong>{step.label}</strong>
                    <em>{step.hint}</em>
                  </span>

                </button>

              );

            })}

          </div>

        </nav>


        {/* ==========================================================
            ERROR
        ========================================================== */}

        {error && (

          <div className="acc-alert" role="alert">
            <MdErrorOutline size={20} />
            <p>{error}</p>
          </div>

        )}


        {/* ==========================================================
            FORM
        ========================================================== */}

        <form
          onSubmit={handleSubmit}
          className="acc-card"
        >

          {/* ========================================================
              STEP 1 — INFORMATIONS
          ======================================================== */}

          {currentStep === 1 && (

            <div className="acc-panel">

              <SectionHeading
                icon={MdHome}
                title="Présentez votre logement"
                subtitle="Le nom et la description sont ce que les voyageurs lisent en premier."
              />


              <Field label="Nom de l'accommodation" required>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    updateField('name', e.target.value)
                  }
                  required
                  className="acc-input"
                  placeholder="Ex. Villa Paradis, Labadie"
                />
              </Field>


              <Field label="Type de propriété" required>
                <select
                  value={formData.propertyType}
                  onChange={e =>
                    updateField('propertyType', e.target.value)
                  }
                  required
                  className="acc-input"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="house">Maison</option>
                  <option value="apartment">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="hotel">Hôtel</option>
                  <option value="guesthouse">Maison d'hôtes</option>
                  <option value="cabin">Cabin</option>
                  <option value="other">Autre</option>
                </select>
              </Field>


              <Field
                label="Description"
                hint="Parlez du quartier, de la vue, de ce qui rend ce logement unique."
              >
                <textarea
                  value={formData.description}
                  onChange={e =>
                    updateField('description', e.target.value)
                  }
                  rows={5}
                  className="acc-input acc-textarea"
                  placeholder="Décrivez votre accommodation…"
                />
              </Field>


              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <MdLocationOn size={18} />
                  <h3>Localisation</h3>
                </div>

                <div className="acc-grid-2">

                  <Field label="Adresse" required>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={e => updateField('address', e.target.value)}
                      required
                      className="acc-input"
                    />
                  </Field>

                  <Field label="Appartement / numéro">
                    <input
                      type="text"
                      value={formData.apartmentNumber}
                      onChange={e => updateField('apartmentNumber', e.target.value)}
                      className="acc-input"
                    />
                  </Field>

                  <Field label="Ville" required>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => updateField('city', e.target.value)}
                      required
                      className="acc-input"
                    />
                  </Field>

                  <Field label="Pays (code ISO 2 lettres)" required>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={e => updateField('country', e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2) || 'HT')}
                      required
                      className="acc-input"
                      maxLength={2}
                      placeholder="HT"
                    />
                  </Field>

                  <Field label="Code postal">
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={e => updateField('postalCode', e.target.value)}
                      className="acc-input"
                    />
                  </Field>

                </div>

              </div>

            </div>

          )}


          {/* ========================================================
              STEP 2 — LOGEMENT
          ======================================================== */}

          {currentStep === 2 && (

            <div className="acc-panel">

              <SectionHeading
                icon={MdKingBed}
                title="Capacité et confort"
                subtitle="Ces chiffres déterminent les groupes de voyageurs qui pourront réserver."
              />


              <div className="acc-grid-2">

                <Field label="Chambres">
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={e => updateField('bedrooms', Number(e.target.value))}
                    className="acc-input"
                  />
                </Field>

                <Field label="Salons">
                  <input
                    type="number"
                    min="0"
                    value={formData.livingRooms}
                    onChange={e => updateField('livingRooms', Number(e.target.value))}
                    className="acc-input"
                  />
                </Field>

                <Field label="Salles de bain">
                  <input
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={e => updateField('bathrooms', Number(e.target.value))}
                    className="acc-input"
                  />
                </Field>

                <Field label="Surface (m²)">
                  <input
                    type="number"
                    min="0"
                    value={formData.surfaceArea}
                    onChange={e => updateField('surfaceArea', e.target.value)}
                    className="acc-input"
                  />
                </Field>

                <Field label="Nombre maximum de personnes">
                  <input
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={e => updateField('maxGuests', Number(e.target.value))}
                    className="acc-input"
                  />
                </Field>

              </div>


              {/* CHILDREN */}

              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <MdChildCare size={18} />
                  <h3>Enfants</h3>
                </div>

                <label className="acc-toggle-row">
                  <input
                    type="checkbox"
                    checked={formData.acceptsChildren}
                    onChange={e => updateField('acceptsChildren', e.target.checked)}
                  />
                  <span>J'accepte les enfants</span>
                </label>

                {formData.acceptsChildren && (
                  <div className="acc-grid-2">
                    <Field label="Âge maximum">
                      <input
                        type="number"
                        min="0"
                        value={formData.childrenMaxAge}
                        onChange={e => updateField('childrenMaxAge', Number(e.target.value))}
                        className="acc-input"
                      />
                    </Field>
                    <Field label="Gratuit en dessous de (ans)">
                      <input
                        type="number"
                        min="0"
                        value={formData.childrenFreeUnder}
                        onChange={e => updateField('childrenFreeUnder', Number(e.target.value))}
                        className="acc-input"
                      />
                    </Field>
                  </div>
                )}

                <label className="acc-toggle-row">
                  <MdCrib size={18} className="acc-toggle-icon" />
                  <input
                    type="checkbox"
                    checked={formData.hasBabyBed}
                    onChange={e => updateField('hasBabyBed', e.target.checked)}
                  />
                  <span>Lit bébé disponible</span>
                </label>

              </div>


              {/* AMENITIES */}

              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <h3>Équipements</h3>
                  <span className="acc-count-pill">
                    {AMENITIES.filter(a => Boolean(formData[a.field])).length} sélectionnés
                  </span>
                </div>

                <div className="acc-amenity-grid">

                  {AMENITIES.map(({ field, label, icon: Icon }) => {

                    const active = Boolean(formData[field]);

                    return (

                      <button
                        type="button"
                        key={String(field)}
                        onClick={() => toggleAmenity(field)}
                        className={`acc-amenity ${active ? 'is-active' : ''}`}
                        aria-pressed={active}
                      >
                        <Icon size={20} />
                        <span>{label}</span>
                      </button>

                    );

                  })}

                </div>

              </div>

            </div>

          )}


          {/* ========================================================
              STEP 3 — SERVICES
          ======================================================== */}

          {currentStep === 3 && (

            <div className="acc-panel">

              <SectionHeading
                icon={MdOutlineFreeBreakfast}
                title="Services et règles de la maison"
                subtitle="Fixez le cadre pour que les séjours se passent bien, pour vous comme pour vos voyageurs."
              />

              <label className="acc-toggle-row">
                <input
                  type="checkbox"
                  checked={formData.breakfastIncluded}
                  onChange={e => updateField('breakfastIncluded', e.target.checked)}
                />
                <span>Petit-déjeuner inclus</span>
              </label>


              {/* PARKING */}

              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <MdLocalParking size={18} />
                  <h3>Stationnement</h3>
                </div>

                <Field label="Parking">
                  <select
                    value={formData.parking}
                    onChange={e => updateField('parking', e.target.value)}
                    className="acc-input"
                  >
                    <option value="none">Pas de parking</option>
                    <option value="free">Parking gratuit</option>
                    <option value="paid">Parking payant</option>
                  </select>
                </Field>

                {formData.parking === 'paid' && (
                  <Field label="Prix du parking">
                    <input
                      type="number"
                      min="0"
                      value={formData.parkingPrice}
                      onChange={e => updateField('parkingPrice', e.target.value)}
                      className="acc-input"
                    />
                  </Field>
                )}

              </div>


              {/* RULES */}

              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <h3>Règles de la maison</h3>
                </div>

                <div className="acc-grid-2">

                  <label className="acc-toggle-row">
                    <MdSmokingRooms size={18} className="acc-toggle-icon" />
                    <input
                      type="checkbox"
                      checked={formData.smokingAllowed}
                      onChange={e => updateField('smokingAllowed', e.target.checked)}
                    />
                    <span>Fumeurs autorisés</span>
                  </label>

                  <label className="acc-toggle-row">
                    <MdCelebration size={18} className="acc-toggle-icon" />
                    <input
                      type="checkbox"
                      checked={formData.eventsAllowed}
                      onChange={e => updateField('eventsAllowed', e.target.checked)}
                    />
                    <span>Événements autorisés</span>
                  </label>

                </div>

              </div>


              {/* CHECK IN */}

              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <MdAccessTime size={18} />
                  <h3>Horaires d'arrivée</h3>
                </div>

                <div className="acc-grid-2">

                  <Field label="À partir de">
                    <input
                      type="time"
                      value={formData.checkInFrom}
                      onChange={e => updateField('checkInFrom', e.target.value)}
                      className="acc-input"
                    />
                  </Field>

                  <Field label="Jusqu'à">
                    <input
                      type="time"
                      value={formData.checkInTo}
                      onChange={e => updateField('checkInTo', e.target.value)}
                      className="acc-input"
                    />
                  </Field>

                </div>

              </div>


              {/* AVAILABILITY */}

              <div className="acc-subsection">

                <div className="acc-subsection-heading">
                  <MdEventAvailable size={18} />
                  <h3>Disponibilité</h3>
                </div>

                <label className="acc-toggle-row">
                  <input
                    type="checkbox"
                    checked={formData.availableImmediately}
                    onChange={e => updateField('availableImmediately', e.target.checked)}
                  />
                  <span>Disponible immédiatement</span>
                </label>

                {!formData.availableImmediately && (
                  <Field label="Disponible à partir du" required>
                    <input
                      type="date"
                      value={formData.availableFrom}
                      onChange={e => updateField('availableFrom', e.target.value)}
                      required
                      className="acc-input"
                    />
                  </Field>
                )}

              </div>

            </div>

          )}


          {/* ========================================================
              STEP 4 — TARIF
          ======================================================== */}

          {currentStep === 4 && (

            <div className="acc-panel">

              <SectionHeading
                icon={MdAttachMoney}
                title="Tarif et dernières vérifications"
                subtitle="Votre annonce est presque prête à décoller."
              />


              <Field label="Prix par nuit" required>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={pricePerNight}
                  onChange={e => setPricePerNight(e.target.value)}
                  className="acc-input"
                  placeholder="Ex. 100"
                />
              </Field>


              <div className="acc-subsection">

                <label className="acc-toggle-row">
                  <input
                    type="checkbox"
                    checked={formData.weeklyDiscount}
                    onChange={e => updateField('weeklyDiscount', e.target.checked)}
                  />
                  <span>Réduction hebdomadaire</span>
                </label>

                {formData.weeklyDiscount && (
                  <Field label="Pourcentage de réduction">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.weeklyDiscountRate}
                      onChange={e => updateField('weeklyDiscountRate', e.target.value)}
                      className="acc-input"
                    />
                  </Field>
                )}

              </div>


              <Field label="Nombre maximum de nuits">
                <input
                  type="number"
                  min="1"
                  value={formData.maxNights}
                  onChange={e => updateField('maxNights', Number(e.target.value))}
                  className="acc-input"
                />
              </Field>


              {/* BOARDING PASS SUMMARY */}

              <div className="acc-boarding" aria-label="Résumé de l'annonce">

                <div className="acc-boarding-main">

                  <span className="acc-boarding-eyebrow">Carte d'embarquement · TRAPDE</span>

                  <div className="acc-boarding-row">
                    <div>
                      <span className="acc-boarding-label">Accommodation</span>
                      <strong>{formData.name || '—'}</strong>
                    </div>
                    <div>
                      <span className="acc-boarding-label">Ville</span>
                      <strong>{formData.city || '—'}</strong>
                    </div>
                  </div>

                  <div className="acc-boarding-row">
                    <div>
                      <span className="acc-boarding-label">Prix / nuit</span>
                      <strong>{pricePerNight ? formatGourdes(pricePerNight) : '—'}</strong>
                    </div>
                    <div>
                      <span className="acc-boarding-label">Commission TRAPDE</span>
                      <strong>10 %</strong>
                    </div>
                  </div>

                </div>

                <div className="acc-boarding-stub">
                  <MdFlightTakeoff size={22} />
                  <span>{isEditMode ? 'Mise à jour' : 'Prêt à publier'}</span>
                </div>

              </div>


              {!isEditMode && (

                <div className="acc-notice">
                  <p>
                    Après la création, votre accommodation sera envoyée à l'administration
                    pour validation. Elle apparaîtra publiquement dès son passage au statut{' '}
                    <strong>active</strong>.
                  </p>
                </div>

              )}

            </div>

          )}


          {/* ========================================================
              FOOTER
          ======================================================== */}

          <div className="acc-footer">

            <button
              type="button"
              onClick={
                currentStep === 1 ? () => navigate('/partner/lojman') : previousStep
              }
              className="acc-btn acc-btn-ghost"
            >
              <MdArrowBack size={18} />
              {currentStep === 1 ? 'Annuler' : 'Précédent'}
            </button>


            {currentStep < totalSteps ? (

              <button
                type="button"
                onClick={nextStep}
                className="acc-btn acc-btn-primary"
              >
                Suivant
                <MdArrowForward size={18} />
              </button>

            ) : (

              <button
                type="submit"
                disabled={isSubmitting}
                className="acc-btn acc-btn-accent"
              >
                {isSubmitting ? (
                  <>
                    <span className="acc-spinner" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <MdSave size={18} />
                    {isEditMode ? 'Enregistrer les modifications' : 'Publier mon accommodation'}
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


/* =============================================================================
   SCOPED BRAND STYLES
   Palette : #0000AA (primaire), #FF6600 (accent), #F4F7FB (fond),
   #0B1130 (encre), #545B72 (texte), #E2E6F0 (bordure).
   Typo : Fraunces (titres) + Plus Jakarta Sans (interface).
============================================================================= */

const TrapdeStyles: React.FC = () => (

  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    .acc-shell {
      min-height: 100vh;
      background:
        radial-gradient(circle at 12% 0%, rgba(0,0,170,0.06), transparent 45%),
        radial-gradient(circle at 100% 8%, rgba(255,102,0,0.06), transparent 40%),
        #F4F7FB;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #0B1130;
    }

    .acc-loading-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F4F7FB;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .acc-loading-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      color: #545B72;
    }
    .acc-loading-plane {
      width: 52px;
      height: 52px;
      border-radius: 999px;
      background: #0000AA;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: acc-float 1.6s ease-in-out infinite;
    }
    @keyframes acc-float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(6deg); }
    }

    .acc-topbar {
      background: #FFFFFF;
      border-bottom: 1px solid #E2E6F0;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .acc-topbar-inner {
      max-width: 920px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .acc-back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #545B72;
      background: none;
      border: none;
      cursor: pointer;
      transition: color .15s ease;
    }
    .acc-back-link:hover { color: #0000AA; }
    .acc-topbar-brand {
      font-family: 'Fraunces', serif;
      font-weight: 600;
      letter-spacing: .02em;
      color: #0B1130;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .acc-topbar-brand span { color: #FF6600; }
    .acc-topbar-brand em {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-style: normal;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #545B72;
      border-left: 1px solid #E2E6F0;
      padding-left: 8px;
    }

    .acc-main {
      max-width: 920px;
      margin: 0 auto;
      padding: 40px 24px 96px;
    }

    .acc-hero { margin-bottom: 36px; }
    .acc-eyebrow {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: #FF6600;
      margin-bottom: 10px;
    }
    .acc-title {
      font-family: 'Fraunces', serif;
      font-weight: 600;
      font-size: clamp(28px, 4vw, 38px);
      line-height: 1.15;
      color: #0B1130;
      margin: 0 0 10px;
    }
    .acc-subtitle {
      color: #545B72;
      font-size: 16px;
      line-height: 1.6;
      max-width: 60ch;
      margin: 0;
    }

    /* ---------- STEPPER : FLIGHT PATH ---------- */

    .acc-flightpath { margin-bottom: 32px; }
    .acc-flightpath-track {
      position: relative;
      height: 2px;
      background: repeating-linear-gradient(to right, #C7CEE0 0 6px, transparent 6px 12px);
      margin: 0 18px 18px;
    }
    .acc-flightpath-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      background: #FF6600;
      transition: width .35s ease;
    }
    .acc-flightpath-plane {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 30px;
      height: 30px;
      border-radius: 999px;
      background: #FF6600;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(255,102,0,0.35);
      transition: left .35s ease;
    }
    .acc-flightpath-stops {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .acc-stop {
      display: flex;
      align-items: center;
      gap: 10px;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 6px;
      border-radius: 10px;
      transition: background .15s ease;
    }
    .acc-stop:hover { background: rgba(0,0,170,0.05); }
    .acc-stop-dot {
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      border-radius: 999px;
      border: 2px solid #C7CEE0;
      background: #fff;
      color: #545B72;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }
    .acc-stop.is-active .acc-stop-dot {
      border-color: #0000AA;
      background: #0000AA;
      color: #fff;
    }
    .acc-stop.is-done .acc-stop-dot {
      border-color: #FF6600;
      background: #FF6600;
      color: #fff;
    }
    .acc-stop-text { display: flex; flex-direction: column; line-height: 1.25; }
    .acc-stop-text strong {
      font-size: 13px;
      color: #0B1130;
    }
    .acc-stop-text em {
      font-style: normal;
      font-size: 11px;
      color: #8A90A6;
    }
    .acc-stop.is-active .acc-stop-text strong { color: #0000AA; }

    /* ---------- ALERT ---------- */

    .acc-alert {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      background: #FDECEA;
      border: 1px solid #F6C6C0;
      color: #B3261E;
      padding: 14px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .acc-alert p { margin: 0; white-space: pre-line; line-height: 1.5; }

    /* ---------- CARD / PANEL ---------- */

    .acc-card {
      background: #FFFFFF;
      border: 1px solid #E2E6F0;
      border-radius: 24px;
      box-shadow: 0 20px 45px -30px rgba(11,17,48,0.35);
      overflow: hidden;
    }
    .acc-panel { padding: 36px; display: flex; flex-direction: column; gap: 24px; }

    .acc-section-heading {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 4px;
    }
    .acc-section-icon {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #0000AA;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .acc-section-title {
      font-family: 'Fraunces', serif;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #0B1130;
    }
    .acc-section-subtitle {
      margin: 4px 0 0;
      font-size: 13.5px;
      color: #8A90A6;
    }

    .acc-subsection {
      border-top: 1px solid #EEF1F7;
      padding-top: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .acc-subsection-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #0000AA;
    }
    .acc-subsection-heading h3 {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      margin: 0;
      color: #0B1130;
    }
    .acc-count-pill {
      margin-left: auto;
      font-size: 12px;
      font-weight: 600;
      color: #0000AA;
      background: rgba(0,0,170,0.08);
      padding: 4px 10px;
      border-radius: 999px;
    }

    .acc-grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    @media (max-width: 640px) {
      .acc-grid-2 { grid-template-columns: 1fr; }
      .acc-flightpath-stops { grid-template-columns: repeat(2, 1fr); row-gap: 12px; }
      .acc-panel { padding: 24px; }
    }

    /* ---------- FIELDS ---------- */

    .acc-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .acc-field-label {
      font-size: 13px;
      font-weight: 600;
      color: #0B1130;
    }
    .acc-required { color: #FF6600; margin-left: 3px; }
    .acc-field-hint {
      font-size: 12px;
      color: #8A90A6;
    }
    .acc-input {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid #E2E6F0;
      border-radius: 10px;
      font-family: inherit;
      font-size: 14.5px;
      color: #0B1130;
      background: #FBFCFE;
      transition: border-color .15s ease, box-shadow .15s ease;
    }
    .acc-input:focus {
      outline: none;
      border-color: #FF6600;
      box-shadow: 0 0 0 3px rgba(255,102,0,0.15);
      background: #fff;
    }
    .acc-textarea { resize: vertical; min-height: 110px; }

    .acc-toggle-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #0B1130;
      cursor: pointer;
    }
    .acc-toggle-row input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #0000AA;
      cursor: pointer;
    }
    .acc-toggle-icon { color: #0000AA; }

    /* ---------- AMENITY CHIPS ---------- */

    .acc-amenity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    @media (max-width: 640px) {
      .acc-amenity-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .acc-amenity {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border: 1.5px solid #E2E6F0;
      border-radius: 12px;
      background: #FBFCFE;
      color: #545B72;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all .15s ease;
      text-align: left;
    }
    .acc-amenity:hover { border-color: #0000AA; color: #0000AA; }
    .acc-amenity.is-active {
      background: #0000AA;
      border-color: #0000AA;
      color: #fff;
    }

    /* ---------- BOARDING PASS SUMMARY ---------- */

    .acc-boarding {
      display: flex;
      border-radius: 16px;
      overflow: hidden;
      border: 1.5px solid #0B1130;
      background: #0B1130;
      color: #fff;
    }
    .acc-boarding-main {
      flex: 1;
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .acc-boarding-eyebrow {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: #FF6600;
    }
    .acc-boarding-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    .acc-boarding-row > div { display: flex; flex-direction: column; gap: 3px; }
    .acc-boarding-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: rgba(255,255,255,0.55);
    }
    .acc-boarding-row strong { font-size: 15px; font-family: 'Fraunces', serif; }
    .acc-boarding-stub {
      width: 120px;
      flex-shrink: 0;
      background: #FF6600;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      padding: 12px;
      border-left: 2px dashed rgba(255,255,255,0.5);
    }

    .acc-notice {
      background: rgba(0,0,170,0.06);
      border: 1px solid rgba(0,0,170,0.18);
      border-radius: 12px;
      padding: 14px 16px;
    }
    .acc-notice p {
      margin: 0;
      font-size: 13.5px;
      color: #2A2F55;
      line-height: 1.55;
    }

    /* ---------- FOOTER / BUTTONS ---------- */

    .acc-footer {
      padding: 20px 36px;
      border-top: 1px solid #EEF1F7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FBFCFE;
    }
    @media (max-width: 640px) { .acc-footer { padding: 18px 20px; } }

    .acc-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 22px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
    }
    .acc-btn:active { transform: scale(0.98); }
    .acc-btn:focus-visible {
      outline: 2px solid #0000AA;
      outline-offset: 2px;
    }
    .acc-btn-ghost {
      background: transparent;
      color: #545B72;
      border: 1.5px solid #E2E6F0;
    }
    .acc-btn-ghost:hover { border-color: #0000AA; color: #0000AA; }
    .acc-btn-primary {
      background: #0000AA;
      color: #fff;
      box-shadow: 0 10px 20px -8px rgba(0,0,170,0.55);
    }
    .acc-btn-primary:hover { background: #000088; }
    .acc-btn-accent {
      background: #FF6600;
      color: #fff;
      box-shadow: 0 10px 20px -8px rgba(255,102,0,0.55);
    }
    .acc-btn-accent:hover { background: #E65C00; }
    .acc-btn-accent:disabled { opacity: .65; cursor: not-allowed; }

    .acc-spinner {
      width: 15px;
      height: 15px;
      border-radius: 999px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      animation: acc-spin .7s linear infinite;
    }
    @keyframes acc-spin { to { transform: rotate(360deg); } }

    @media (prefers-reduced-motion: reduce) {
      .acc-loading-plane, .acc-spinner { animation: none; }
      .acc-flightpath-fill, .acc-flightpath-plane { transition: none; }
    }
  `}</style>

);


export default AccommodationScreen;