import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdLocationOn,
  MdBed,
  MdBathroom,
  MdChildCare,
  MdAcUnit,
  MdWifi,
  MdLocalLaundryService,
  MdKitchen,
  MdPool,
  MdHotTub,
  MdTv,
  MdBalcony,
  MdYard,
  MdBreakfastDining,
  MdLocalParking,
  MdLanguage,
  MdSmokingRooms,
  MdEmojiEvents,
  MdPets,
  MdAccessTime,
  MdAdd,
  MdRemove,
  MdDelete,
  MdHome,
  MdLocalFireDepartment,
  MdLiquor,
  MdSingleBed,
  MdKingBed,
  MdCheck,
  MdApartment,
  MdArrowBack,
  MdArrowForward,
  MdAttachMoney,
  MdStar,
  MdCalendarToday,
  MdPerson,
  MdBusiness,
  MdGavel,
  MdInfo,
  // MdEdit,
  MdFamilyRestroom,
  MdDateRange,
  MdLock,
} from 'react-icons/md';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Bed {
  type: 'single' | 'double' | 'king';
  quantity: number;
}

interface Room {
  id: number;
  type: string;
  beds: Bed[];
}

const RegisterAccommodationScreen: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    propertyName: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    gpsLoading: false,
    apartmentNumber: '',
    country: 'HT',
    city: '',
    postalCode: '',
    bedrooms: 1,
    livingRooms: 1,
    otherSpaces: 0,
    maxGuests: 2,
    childrenCount: 0,
    bathrooms: 1,
    acceptsChildren: false,
    hasBabyBed: false,
    babyBedPrice: '',
    isBabyBedFree: true,
    surfaceArea: '',
    amenities: {
      ac: false,
      heating: false,
      wifi: false,
      kitchen: false,
      washingMachine: false,
      tv: false,
      pool: false,
      jacuzzi: false,
      minibar: false,
      balcony: false,
      garden: false,
      terrace: false,
    },
    breakfastIncluded: false,
    parking: 'none',
    parkingPrice: '',
    languages: [] as string[],
    smokingAllowed: false,
    eventsAllowed: false,
    petsAllowed: 'no',
    openingHours: {
      start: '08:00',
      end: '20:00',
    },
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const defaultLanguages = ['Kreyòl', 'Fransè', 'Anglè', 'Panyòl'];

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) return;
    setFormData(prev => ({ ...prev, gpsLoading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          gpsLoading: false,
        }));
      },
      () => setFormData(prev => ({ ...prev, gpsLoading: false }))
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 6 - photos.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos(prev => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const movePhoto = (from: number, to: number) => {
    setPhotos(prev => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  // Step 6 - Pricing
  const [pricing, setPricing] = useState({
    pricePerNight: '',
  });

  // Step 7 - Special plans
  const [specialPlans, setSpecialPlans] = useState({
    cancellation24hEnabled: true,
    cancellation1dayEnabled: true,
    cancellation24hFee: '',
    cancellation1dayFee: '',
    childrenFreeDefault: true,
    childrenAgeMin: 3,
    childrenAgeMax: 17,
    childrenSpecialOption: 'free' as 'free' | 'paid',
    childrenSpecialPrice: '',
    weeklyDiscountEnabled: true,
    weeklyDiscountRate: 15,
  });

  // Step 8 - Availability
  const [availability, setAvailability] = useState({
    availableFrom: 'immediate' as 'immediate' | 'specific',
    availableFromDate: '',
    bookingPeriodType: 'renewable' as 'renewable' | 'fixed',
    bookingPeriodMonths: '3',
    allow30PlusNights: false,
    maxNights: '40',
  });

  // Step 9 - Representative
  const [representative, setRepresentative] = useState({
    ownerType: '' as '' | 'individual' | 'company',
    // Individual fields
    repFirstName: '',
    repLastName: '',
    repBirthDate: '',
    repEmail: '',
    repPhone: '',
    // Additional representatives
    additionalReps: [] as { firstName: string; lastName: string; email: string }[],
    // Company fields
    companyName: '',
    companyReg: '',
    companyAddress: '',
    companyRepName: '',
    companyRepTitle: '',
  });

  // Step 10 - Contract info
  const [contract, setContract] = useState({
    entityType: '' as '' | 'individual' | 'commercial',
    // Individual
    contractFirstName: '',
    contractLastName: '',
    contractEmail: '',
    contractPhone: '',
    contractCountry: 'HT',
    contractAddress: '',
    contractCity: '',
    contractPostalCode: '',
    legalCertification: false,
  });

  const countries = [
    { code: 'HT', name: t('accommodationForm.countries.haiti') },
    { code: 'FR', name: t('accommodationForm.countries.france') },
    { code: 'US', name: t('accommodationForm.countries.usa') },
    { code: 'CA', name: t('accommodationForm.countries.canada') },
    { code: 'DO', name: t('accommodationForm.countries.dominican') },
  ];

  const bedTypes = [
    { value: 'single', label: t('accommodationForm.bedTypes.single'), icon: MdSingleBed },
    { value: 'double', label: t('accommodationForm.bedTypes.double'), icon: MdBed },
    { value: 'king', label: t('accommodationForm.bedTypes.king'), icon: MdKingBed },
  ];

  const steps = [
    { label: t('accommodationForm.generalInfo.title'), icon: MdHome },
    { label: t('accommodationForm.propertyInfo.title'), icon: MdBed },
    { label: t('accommodationForm.amenities.title'), icon: MdAcUnit },
    { label: t('accommodationForm.services.title'), icon: MdLocalParking },
    { label: t('accommodationForm.rules.title'), icon: MdAccessTime },
    { label: t('accommodationForm.pricing.title'), icon: MdAttachMoney },
    { label: t('accommodationForm.specialPlans.title'), icon: MdStar },
    { label: t('accommodationForm.availability.title'), icon: MdCalendarToday },
    { label: t('accommodationForm.representative.title'), icon: MdPerson },
    { label: t('accommodationForm.contract.title'), icon: MdGavel },
  ];

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Validation per step - only blocks on required fields
  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return (
          formData.propertyName.trim() !== '' &&
          formData.address.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.country.trim() !== '' &&
          photos.length >= 4
        );
      case 1:
        return formData.maxGuests >= 1 && formData.bathrooms >= 1;
      case 5:
        return pricing.pricePerNight !== '' && parseFloat(pricing.pricePerNight) > 0;
      case 8:
        return representative.ownerType !== '';
      case 9:
        return (
          contract.entityType !== '' &&
          contract.legalCertification &&
          contract.contractFirstName.trim() !== '' &&
          contract.contractLastName.trim() !== ''
        );
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!isStepValid(currentStep)) return;
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (index: number) => {
    // Allow navigating back freely, or forward only through validated steps
    if (index <= currentStep) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    for (let i = currentStep; i < index; i++) {
      if (!isStepValid(i)) return;
    }
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddRoom = () => {
    const newId = Math.max(...rooms.map((r) => r.id), 0) + 1;
    setRooms([...rooms, { id: newId, type: t('accommodationForm.newRoom'), beds: [{ type: 'double', quantity: 1 }] }]);
  };

  const handleRemoveRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };

  const handleAddBed = (roomId: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, beds: [...room.beds, { type: 'double', quantity: 1 }] } : room
      )
    );
  };

  const handleRemoveBed = (roomId: number, bedIndex: number) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId && room.beds.length > 1) {
          return { ...room, beds: room.beds.filter((_, idx) => idx !== bedIndex) };
        }
        return room;
      })
    );
  };

  const handleBedChange = (roomId: number, bedIndex: number, field: string, value: any) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          const newBeds = [...room.beds];
          newBeds[bedIndex] = { ...newBeds[bedIndex], [field]: value };
          return { ...room, beds: newBeds };
        }
        return room;
      })
    );
  };

  const handleRoomTypeChange = (roomId: number, type: string) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, type } : room)));
  };

  const handleAmenityChange = (amenity: keyof typeof formData.amenities) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity],
      },
    });
  };

  const handleAddLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim()) &&
      !customLanguages.includes(newLanguage.trim())
    ) {
      setCustomLanguages([...customLanguages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setCustomLanguages(customLanguages.filter((l) => l !== lang));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    const submitData = {
      ...formData,
      rooms,
      customLanguages,
    };
    console.log('Données soumises:', submitData);
    alert(t('accommodationForm.successMessage'));
  };

  // Group 1: Peyizaj e Divètisman (Landscape & Entertainment)
  const amenitiesGroupOutdoorEntertainment: { key: keyof typeof formData.amenities; icon: React.ElementType; labelKey: string }[] = [
    { key: 'tv', icon: MdTv, labelKey: 'accommodationForm.amenities.tv' },
    { key: 'pool', icon: MdPool, labelKey: 'accommodationForm.amenities.pool' },
    { key: 'jacuzzi', icon: MdHotTub, labelKey: 'accommodationForm.amenities.jacuzzi' },
    { key: 'minibar', icon: MdLiquor, labelKey: 'accommodationForm.amenities.minibar' },
    { key: 'balcony', icon: MdBalcony, labelKey: 'accommodationForm.amenities.balcony' },
    { key: 'garden', icon: MdYard, labelKey: 'accommodationForm.amenities.garden' },
    { key: 'terrace', icon: MdBalcony, labelKey: 'accommodationForm.amenities.terrace' },
  ];

  // Group 2: Jeneral e Antretyen (General & Maintenance)
  const amenitiesGroupGeneralMaintenance: { key: keyof typeof formData.amenities; icon: React.ElementType; labelKey: string }[] = [
    { key: 'ac', icon: MdAcUnit, labelKey: 'accommodationForm.amenities.ac' },
    { key: 'heating', icon: MdLocalFireDepartment, labelKey: 'accommodationForm.amenities.heating' },
    { key: 'wifi', icon: MdWifi, labelKey: 'accommodationForm.amenities.wifi' },
    { key: 'kitchen', icon: MdKitchen, labelKey: 'accommodationForm.amenities.kitchen' },
    { key: 'washingMachine', icon: MdLocalLaundryService, labelKey: 'accommodationForm.amenities.washingMachine' },
  ];

  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0000AA]/20 focus:border-[#0000AA] transition-colors';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <img src="/src/assets/images/TRAPDELOGO.png" alt="TRAPDE" className="h-9 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0000AA] flex items-center justify-center flex-shrink-0">
              <MdApartment size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{t('accommodationForm.title')}</h1>
              <p className="text-sm text-slate-500">{t('accommodationForm.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Step progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isDone = index < currentStep;
              return (
                <React.Fragment key={index}>
                  <button
                    type="button"
                    onClick={() => goToStep(index)}
                    className="flex flex-col items-center gap-1.5 group flex-shrink-0"
                  >
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0000AA] text-white'
                          : isDone
                          ? 'bg-[#0000AA]/10 text-[#0000AA]'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? <MdCheck size={18} /> : <Icon size={18} />}
                    </span>
                    <span
                      className={`text-xs text-center max-w-[72px] leading-tight hidden sm:block ${
                        isActive ? 'text-[#0000AA] font-medium' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 sm:mx-2 ${index < currentStep ? 'bg-[#0000AA]' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <p className="text-center text-sm text-slate-500 sm:hidden">
            {t('accommodationForm.stepIndicator', { current: currentStep + 1, total: totalSteps })} — {steps[currentStep].label}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: GENERAL INFO */}
          {currentStep === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">
                  1
                </span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.generalInfo.title')}</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className={labelClass}>
                    {t('accommodationForm.generalInfo.propertyName')} <span className="text-[#FF6600]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                    className={inputClass}
                    placeholder={t('accommodationForm.generalInfo.propertyNamePlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    {t('accommodationForm.generalInfo.address')} <span className="text-[#FF6600]">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MdLocationOn size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`${inputClass} pl-10`}
                        placeholder={t('accommodationForm.generalInfo.addressPlaceholder')}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={getGPSLocation}
                      title={t('accommodationForm.generalInfo.getGPS')}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md border text-sm font-medium transition-colors flex-shrink-0 ${
                        formData.latitude
                          ? 'border-green-500 text-green-600 bg-green-50'
                          : 'border-slate-200 text-slate-600 hover:border-[#0000AA] hover:text-[#0000AA]'
                      }`}
                    >
                      {formData.gpsLoading ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <MdLocationOn size={18} className={formData.latitude ? 'text-green-500' : ''} />
                      )}
                      <span className="hidden sm:inline">
                        {formData.latitude ? t('accommodationForm.generalInfo.gpsFound') : t('accommodationForm.generalInfo.getGPS')}
                      </span>
                    </button>
                  </div>
                  {formData.latitude && formData.longitude && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <MdCheck size={14} />
                      {t('accommodationForm.generalInfo.gpsCoords')}: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t('accommodationForm.generalInfo.apartmentNumber')}</label>
                    <input
                      type="text"
                      value={formData.apartmentNumber}
                      onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                      className={inputClass}
                      placeholder={t('accommodationForm.generalInfo.apartmentNumberPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      {t('accommodationForm.generalInfo.country')} <span className="text-[#FF6600]">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={inputClass}
                      required
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>
                      {t('accommodationForm.generalInfo.city')} <span className="text-[#FF6600]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={inputClass}
                      placeholder={t('accommodationForm.generalInfo.cityPlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('accommodationForm.generalInfo.postalCode')}</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className={inputClass}
                      placeholder={t('accommodationForm.generalInfo.postalCodePlaceholder')}
                    />
                  </div>
                </div>

                {/* FOTO KAY LA */}
                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelClass + ' mb-0'}>
                      {t('accommodationForm.generalInfo.photos')} <span className="text-[#FF6600]">*</span>
                    </label>
                    <span className={`text-xs font-medium ${
                      photos.length < 4 ? 'text-slate-400' : photos.length >= 6 ? 'text-[#FF6600]' : 'text-green-600'
                    }`}>
                      {photos.length}/6
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{t('accommodationForm.generalInfo.photosHint')}</p>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Foto ki deja ajoute yo */}
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={photo.preview}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Badge foto prensipal */}
                        {index === 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-[#0000AA] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {t('accommodationForm.generalInfo.mainPhoto')}
                          </span>
                        )}
                        {/* Bouton efase */}
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <MdDelete size={14} />
                        </button>
                        {/* Bouton deplase */}
                        {photos.length > 1 && (
                          <div className="absolute bottom-1.5 left-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => movePhoto(index, index - 1)}
                                className="w-5 h-5 bg-black/50 text-white rounded flex items-center justify-center"
                              >
                                <MdArrowBack size={12} />
                              </button>
                            )}
                            {index < photos.length - 1 && (
                              <button
                                type="button"
                                onClick={() => movePhoto(index, index + 1)}
                                className="w-5 h-5 bg-black/50 text-white rounded flex items-center justify-center"
                              >
                                <MdArrowForward size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Bouton ajoute foto */}
                    {photos.length < 6 && (
                      <label className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        photos.length === 0
                          ? 'border-[#FF6600] bg-[#FF6600]/[0.03] hover:bg-[#FF6600]/[0.06]'
                          : 'border-slate-300 bg-slate-50 hover:border-[#0000AA] hover:bg-[#0000AA]/[0.03]'
                      }`}>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <MdAdd size={22} className={photos.length === 0 ? 'text-[#FF6600]' : 'text-slate-400'} />
                        <span className={`text-xs font-medium mt-1 ${photos.length === 0 ? 'text-[#FF6600]' : 'text-slate-400'}`}>
                          {photos.length === 0 ? t('accommodationForm.generalInfo.addPhotos') : t('accommodationForm.generalInfo.addMore')}
                        </span>
                      </label>
                    )}

                    {/* Slots vid pou montre 6 max */}
                    {Array.from({ length: Math.max(0, Math.min(3, 6 - photos.length - (photos.length < 6 ? 1 : 0))) }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-video rounded-lg border border-dashed border-slate-200 bg-slate-50/50" />
                    ))}
                  </div>

                  {photos.length > 0 && photos.length < 4 && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <MdInfo size={14} />
                      {t('accommodationForm.generalInfo.photosMin')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY DETAILS */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">
                  2
                </span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.propertyInfo.title')}</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Spaces */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <div>
                    <label className={labelClass}>{t('accommodationForm.propertyInfo.bedrooms')}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, bedrooms: Math.max(0, formData.bedrooms - 1) })}
                        className="w-9 h-9 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <MdRemove size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">{formData.bedrooms}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, bedrooms: formData.bedrooms + 1 })}
                        className="w-9 h-9 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <MdAdd size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t('accommodationForm.propertyInfo.livingRooms')}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, livingRooms: Math.max(0, formData.livingRooms - 1) })}
                        className="w-9 h-9 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <MdRemove size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">{formData.livingRooms}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, livingRooms: formData.livingRooms + 1 })}
                        className="w-9 h-9 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <MdAdd size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t('accommodationForm.propertyInfo.otherSpaces')}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, otherSpaces: Math.max(0, formData.otherSpaces - 1) })}
                        className="w-9 h-9 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <MdRemove size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">{formData.otherSpaces}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, otherSpaces: formData.otherSpaces + 1 })}
                        className="w-9 h-9 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <MdAdd size={16} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t('accommodationForm.propertyInfo.surfaceArea')}</label>
                    <input
                      type="number"
                      value={formData.surfaceArea}
                      onChange={(e) => setFormData({ ...formData, surfaceArea: e.target.value })}
                      className={inputClass}
                      placeholder="m²"
                    />
                  </div>
                </div>

                {/* Rooms and beds */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-700">{t('accommodationForm.propertyInfo.roomsAndBeds')}</h3>
                    <button
                      type="button"
                      onClick={handleAddRoom}
                      className="flex items-center gap-1.5 text-sm font-medium text-[#0000AA] hover:bg-[#0000AA]/5 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <MdAdd size={16} /> {t('accommodationForm.propertyInfo.addRoom')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {rooms.map((room) => (
                      <div key={room.id} className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-3">
                          <input
                            type="text"
                            value={room.type}
                            onChange={(e) => handleRoomTypeChange(room.id, e.target.value)}
                            className={`${inputClass} flex-1 mr-3 bg-white`}
                            placeholder={t('accommodationForm.propertyInfo.roomNamePlaceholder')}
                          />
                          {rooms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(room.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <MdDelete size={18} />
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {room.beds.map((bed, bedIndex) => {
                            const BedIcon = bedTypes.find((bt) => bt.value === bed.type)?.icon ?? MdBed;
                            return (
                              <div key={bedIndex} className="flex items-center gap-2">
                                <BedIcon size={18} className="text-slate-400 flex-shrink-0" />
                                <select
                                  value={bed.type}
                                  onChange={(e) => handleBedChange(room.id, bedIndex, 'type', e.target.value)}
                                  className={`${inputClass} flex-1 bg-white py-2`}
                                >
                                  {bedTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleBedChange(room.id, bedIndex, 'quantity', Math.max(1, bed.quantity - 1))}
                                    className="w-8 h-8 rounded-md border border-slate-200 bg-white hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                                  >
                                    <MdRemove size={14} />
                                  </button>
                                  <span className="w-6 text-center text-sm font-medium text-slate-700">{bed.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleBedChange(room.id, bedIndex, 'quantity', bed.quantity + 1)}
                                    className="w-8 h-8 rounded-md border border-slate-200 bg-white hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                                  >
                                    <MdAdd size={14} />
                                  </button>
                                </div>
                                {room.beds.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBed(room.id, bedIndex)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    <MdDelete size={16} />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddBed(room.id)}
                          className="text-sm font-medium text-[#0000AA] hover:underline mt-3"
                        >
                          + {t('accommodationForm.propertyInfo.addBed')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t('accommodationForm.propertyInfo.maxGuests')}</label>
                    <input
                      type="number"
                      value={formData.maxGuests}
                      onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('accommodationForm.propertyInfo.childrenCount')}</label>
                    <input
                      type="number"
                      value={formData.childrenCount}
                      onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t('accommodationForm.propertyInfo.bathrooms')}</label>
                  <div className="relative max-w-[180px]">
                    <MdBathroom size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                      className={`${inputClass} pl-10`}
                      min={1}
                      required
                    />
                  </div>
                </div>

                {/* Children / baby bed */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MdChildCare size={20} className="text-[#0000AA]" />
                    <h3 className="text-sm font-semibold text-slate-700">{t('accommodationForm.propertyInfo.childrenPolicy')}</h3>
                  </div>

                  {/* Règ 1 — Timoun 0-2 an gratis (fiks) */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200 mb-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">{t('accommodationForm.propertyInfo.children02Free')}</p>
                      <p className="text-xs text-green-600 mt-0.5">{t('accommodationForm.propertyInfo.children02FreeDesc')}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      <MdCheck size={14} /> {t('common.free')}
                    </span>
                  </div>

                  {/* Règ 2 — Timoun 3-17 an (modifyab) */}
                  <div className={`p-4 rounded-lg border transition-colors ${
                    formData.acceptsChildren ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{t('accommodationForm.propertyInfo.children317')}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t('accommodationForm.propertyInfo.children317Desc')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, acceptsChildren: !formData.acceptsChildren })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                          formData.acceptsChildren ? 'bg-[#0000AA]' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          formData.acceptsChildren ? 'translate-x-4' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    {formData.acceptsChildren && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 w-24">{t('accommodationForm.propertyInfo.ageUpTo')}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, childrenCount: Math.max(3, (formData.childrenCount || 17) - 1) })}
                              className="w-8 h-8 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                            >
                              <MdRemove size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-slate-800">
                              {formData.childrenCount || 17}
                            </span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, childrenCount: Math.min(17, (formData.childrenCount || 17) + 1) })}
                              className="w-8 h-8 rounded-md border border-slate-200 hover:border-[#0000AA] hover:text-[#0000AA] flex items-center justify-center text-slate-500 transition-colors"
                            >
                              <MdAdd size={14} />
                            </button>
                          </div>
                          <span className="text-xs text-slate-500">{t('accommodationForm.propertyInfo.years')}</span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-2">{t('accommodationForm.propertyInfo.childrenCondition')}</p>
                          <div className="flex gap-4 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={formData.isBabyBedFree === true}
                                onChange={() => setFormData({ ...formData, isBabyBedFree: true, babyBedPrice: '' })}
                                className="accent-[#0000AA]"
                              />
                              <span className="text-slate-700">{t('common.free')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={formData.isBabyBedFree === false}
                                onChange={() => setFormData({ ...formData, isBabyBedFree: false })}
                                className="accent-[#0000AA]"
                              />
                              <span className="text-slate-700">{t('common.paid')}</span>
                            </label>
                          </div>
                          {!formData.isBabyBedFree && (
                            <div className="relative max-w-[180px] mt-2">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">HTG</span>
                              <input
                                type="number"
                                value={formData.babyBedPrice}
                                onChange={(e) => setFormData({ ...formData, babyBedPrice: e.target.value })}
                                placeholder="0.00"
                                className={`${inputClass} pl-12 text-xs py-2`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Baby bed */}
                  <div className="mt-3">
                    <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-2">
                        <MdChildCare size={18} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{t('accommodationForm.propertyInfo.hasBabyBed')}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.hasBabyBed}
                        onChange={(e) => setFormData({ ...formData, hasBabyBed: e.target.checked })}
                        className="accent-[#0000AA]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AMENITIES */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">
                  3
                </span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.amenities.title')}</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Group 1: Peyizaj e Divètisman */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    {t('accommodationForm.amenities.groupOutdoorEntertainment')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenitiesGroupOutdoorEntertainment.map(({ key, icon: Icon, labelKey }) => {
                      const isSelected = formData.amenities[key];
                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border text-sm cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#0000AA] bg-[#0000AA]/[0.04] text-[#0000AA] font-medium'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAmenityChange(key)}
                            className="hidden"
                          />
                          <Icon size={18} className={isSelected ? 'text-[#0000AA]' : 'text-slate-400'} />
                          <span className="flex-1">{t(labelKey)}</span>
                          {isSelected && <MdCheck size={16} className="text-[#0000AA]" />}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Group 2: Jeneral e Antretyen */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    {t('accommodationForm.amenities.groupGeneralMaintenance')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenitiesGroupGeneralMaintenance.map(({ key, icon: Icon, labelKey }) => {
                      const isSelected = formData.amenities[key];
                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border text-sm cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#0000AA] bg-[#0000AA]/[0.04] text-[#0000AA] font-medium'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAmenityChange(key)}
                            className="hidden"
                          />
                          <Icon size={18} className={isSelected ? 'text-[#0000AA]' : 'text-slate-400'} />
                          <span className="flex-1">{t(labelKey)}</span>
                          {isSelected && <MdCheck size={16} className="text-[#0000AA]" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SERVICES */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">
                  4
                </span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.services.title')}</h2>
              </div>
              <div className="p-6 space-y-6">
                <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.breakfastIncluded}
                    onChange={(e) => setFormData({ ...formData, breakfastIncluded: e.target.checked })}
                    className="accent-[#0000AA]"
                  />
                  <MdBreakfastDining size={18} className="text-slate-400" />
                  {t('accommodationForm.services.breakfast')}
                </label>

                <div className="border-t border-slate-100 pt-6">
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <MdLocalParking size={18} className="text-slate-400" />
                    {t('accommodationForm.services.parking')}
                  </label>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="parking"
                        value="free"
                        checked={formData.parking === 'free'}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value, parkingPrice: '' })}
                        className="accent-[#0000AA]"
                      />
                      {t('accommodationForm.services.parkingFree')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="parking"
                        value="paid"
                        checked={formData.parking === 'paid'}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                        className="accent-[#0000AA]"
                      />
                      {t('accommodationForm.services.parkingPaid')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="parking"
                        value="none"
                        checked={formData.parking === 'none'}
                        onChange={(e) => setFormData({ ...formData, parking: e.target.value, parkingPrice: '' })}
                        className="accent-[#0000AA]"
                      />
                      {t('common.no')}
                    </label>
                  </div>
                  {formData.parking === 'paid' && (
                    <input
                      type="number"
                      value={formData.parkingPrice}
                      onChange={(e) => setFormData({ ...formData, parkingPrice: e.target.value })}
                      placeholder={t('accommodationForm.services.parkingPricePlaceholder')}
                      className={`${inputClass} mt-3 sm:w-48`}
                    />
                  )}
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <MdLanguage size={18} className="text-slate-400" />
                    {t('accommodationForm.services.languages')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {defaultLanguages.map((lang) => {
                      const isSelected = selectedLanguages.includes(lang);
                      return (
                        <label
                          key={lang}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#0000AA] bg-[#0000AA]/[0.04] text-[#0000AA] font-medium'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleLanguageToggle(lang)}
                            className="hidden"
                          />
                          {isSelected && <MdCheck size={14} className="text-[#0000AA] flex-shrink-0" />}
                          {lang}
                        </label>
                      );
                    })}
                  </div>
                  {customLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {customLanguages.map((lang) => (
                        <span key={lang} className="inline-flex items-center gap-1.5 bg-[#0000AA]/[0.04] border border-[#0000AA]/20 px-3 py-1.5 rounded-md text-sm text-[#0000AA]">
                          {lang}
                          <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-[#0000AA]/50 hover:text-red-500">
                            <MdDelete size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                      placeholder={t('accommodationForm.services.addLanguagePlaceholder')}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-4 py-2.5 rounded-md text-sm font-medium border border-[#0000AA] text-[#0000AA] hover:bg-[#0000AA]/5 transition-colors flex-shrink-0"
                    >
                      <MdAdd size={18} />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.smokingAllowed}
                      onChange={(e) => setFormData({ ...formData, smokingAllowed: e.target.checked })}
                      className="accent-[#0000AA]"
                    />
                    <MdSmokingRooms size={18} className="text-slate-400" />
                    {t('accommodationForm.services.smokingAllowed')}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: RULES */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">
                  5
                </span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.rules.title')}</h2>
              </div>
              <div className="p-6 space-y-6">
                <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.eventsAllowed}
                    onChange={(e) => setFormData({ ...formData, eventsAllowed: e.target.checked })}
                    className="accent-[#0000AA]"
                  />
                  <MdEmojiEvents size={18} className="text-slate-400" />
                  {t('accommodationForm.rules.eventsAllowed')}
                </label>

                <div className="border-t border-slate-100 pt-6">
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <MdPets size={18} className="text-slate-400" />
                    {t('accommodationForm.rules.petsAllowed')}
                  </label>
                  <div className="flex gap-4 text-sm text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pets"
                        value="yes"
                        checked={formData.petsAllowed === 'yes'}
                        onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value })}
                        className="accent-[#0000AA]"
                      />
                      {t('common.yes')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pets"
                        value="on_request"
                        checked={formData.petsAllowed === 'on_request'}
                        onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value })}
                        className="accent-[#0000AA]"
                      />
                      {t('accommodationForm.rules.petsOnRequest')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pets"
                        value="no"
                        checked={formData.petsAllowed === 'no'}
                        onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value })}
                        className="accent-[#0000AA]"
                      />
                      {t('common.no')}
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <label className={`${labelClass} flex items-center gap-2`}>
                    <MdAccessTime size={18} className="text-slate-400" />
                    {t('accommodationForm.rules.openingHours')}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={formData.openingHours.start}
                      onChange={(e) => setFormData({ ...formData, openingHours: { ...formData.openingHours, start: e.target.value } })}
                      className={`${inputClass} w-auto`}
                    />
                    <span className="text-slate-400 text-sm">{t('common.to')}</span>
                    <input
                      type="time"
                      value={formData.openingHours.end}
                      onChange={(e) => setFormData({ ...formData, openingHours: { ...formData.openingHours, end: e.target.value } })}
                      className={`${inputClass} w-auto`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PRICING */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">6</span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.pricing.title')}</h2>
              </div>
              <div className="p-6 space-y-6">

                {/* Price per night */}
                <div>
                  <label className={labelClass}>
                    {t('accommodationForm.pricing.pricePerNight')} <span className="text-[#FF6600]">*</span>
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">HTG</span>
                    <input
                      type="number"
                      value={pricing.pricePerNight}
                      onChange={(e) => setPricing({ ...pricing, pricePerNight: e.target.value })}
                      className={`${inputClass} pl-14`}
                      placeholder="0.00"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Commission info + real earnings */}
                {pricing.pricePerNight && parseFloat(pricing.pricePerNight) > 0 && (
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-700">{t('accommodationForm.pricing.earningsPreview')}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('accommodationForm.pricing.guestPays')}</span>
                        <span className="font-medium text-slate-800">HTG {parseFloat(pricing.pricePerNight).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('accommodationForm.pricing.trapdeCommission')} (10%)</span>
                        <span className="font-medium text-red-500">- HTG {(parseFloat(pricing.pricePerNight) * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between">
                        <span className="text-sm font-semibold text-slate-700">{t('accommodationForm.pricing.youReceive')}</span>
                        <span className="text-base font-bold text-[#0000AA]">HTG {(parseFloat(pricing.pricePerNight) * 0.9).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TRAPDE advantages */}
                <div className="rounded-lg border border-[#0000AA]/15 bg-[#0000AA]/[0.03] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MdInfo size={18} className="text-[#0000AA]" />
                    <p className="text-sm font-semibold text-[#0000AA]">{t('accommodationForm.pricing.advantagesTitle')}</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <MdCheck size={16} className="text-[#0000AA] mt-0.5 flex-shrink-0" />
                      {t('accommodationForm.pricing.advantageGoogle')}
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <MdCheck size={16} className="text-[#0000AA] mt-0.5 flex-shrink-0" />
                      {t('accommodationForm.pricing.advantageSupport')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: SPECIAL PLANS */}
          {currentStep === 6 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">7</span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.specialPlans.title')}</h2>
              </div>
              <div className="p-6 space-y-8">

                {/* Cancellation conditions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{t('accommodationForm.specialPlans.cancellationTitle')}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{t('accommodationForm.specialPlans.cancellationSubtitle')}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {/* Condition 1: Free cancellation within 24h of booking */}
                    <div className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                      specialPlans.cancellation24hEnabled ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200'
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-800">{t('accommodationForm.specialPlans.cancel24hFree')}</p>
                          <button
                            type="button"
                            onClick={() => setSpecialPlans({ ...specialPlans, cancellation24hEnabled: !specialPlans.cancellation24hEnabled })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              specialPlans.cancellation24hEnabled ? 'bg-[#0000AA]' : 'bg-slate-300'
                            }`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              specialPlans.cancellation24hEnabled ? 'translate-x-4' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">{t('accommodationForm.specialPlans.cancel24hFreeDesc')}</p>
                      </div>
                    </div>

                    {/* Condition 2: Cancel up to 1 day before arrival (with fee) */}
                    <div className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                      specialPlans.cancellation1dayEnabled ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200'
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-800">{t('accommodationForm.specialPlans.cancel1dayFee')}</p>
                          <button
                            type="button"
                            onClick={() => setSpecialPlans({ ...specialPlans, cancellation1dayEnabled: !specialPlans.cancellation1dayEnabled })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              specialPlans.cancellation1dayEnabled ? 'bg-[#0000AA]' : 'bg-slate-300'
                            }`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              specialPlans.cancellation1dayEnabled ? 'translate-x-4' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">{t('accommodationForm.specialPlans.cancel1dayFeeDesc')}</p>
                        {specialPlans.cancellation1dayEnabled && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.specialPlans.cancellationFeeAmount')}</label>
                            <div className="relative max-w-[180px]">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">HTG</span>
                              <input
                                type="number"
                                value={specialPlans.cancellation1dayFee}
                                onChange={(e) => setSpecialPlans({ ...specialPlans, cancellation1dayFee: e.target.value })}
                                className={`${inputClass} pl-12 text-xs py-2`}
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family pricing */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MdFamilyRestroom size={20} className="text-[#0000AA]" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{t('accommodationForm.specialPlans.familyTitle')}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{t('accommodationForm.specialPlans.familySubtitle')}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpecialPlans({ ...specialPlans, childrenFreeDefault: !specialPlans.childrenFreeDefault })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        specialPlans.childrenFreeDefault ? 'bg-[#0000AA]' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        specialPlans.childrenFreeDefault ? 'translate-x-4' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {specialPlans.childrenFreeDefault && (
                    <div className="rounded-lg border border-slate-200 p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.specialPlans.childrenAgeMin')}</label>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setSpecialPlans({ ...specialPlans, childrenAgeMin: Math.max(0, specialPlans.childrenAgeMin - 1) })}
                              className="w-8 h-8 rounded-md border border-slate-200 hover:border-[#0000AA] flex items-center justify-center text-slate-500">
                              <MdRemove size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{specialPlans.childrenAgeMin}</span>
                            <button type="button" onClick={() => setSpecialPlans({ ...specialPlans, childrenAgeMin: Math.min(specialPlans.childrenAgeMax, specialPlans.childrenAgeMin + 1) })}
                              className="w-8 h-8 rounded-md border border-slate-200 hover:border-[#0000AA] flex items-center justify-center text-slate-500">
                              <MdAdd size={14} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.specialPlans.childrenAgeMax')}</label>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setSpecialPlans({ ...specialPlans, childrenAgeMax: Math.max(specialPlans.childrenAgeMin, specialPlans.childrenAgeMax - 1) })}
                              className="w-8 h-8 rounded-md border border-slate-200 hover:border-[#0000AA] flex items-center justify-center text-slate-500">
                              <MdRemove size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{specialPlans.childrenAgeMax}</span>
                            <button type="button" onClick={() => setSpecialPlans({ ...specialPlans, childrenAgeMax: Math.min(17, specialPlans.childrenAgeMax + 1) })}
                              className="w-8 h-8 rounded-md border border-slate-200 hover:border-[#0000AA] flex items-center justify-center text-slate-500">
                              <MdAdd size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">{t('accommodationForm.specialPlans.childrenCondition')}</label>
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={specialPlans.childrenSpecialOption === 'free'}
                              onChange={() => setSpecialPlans({ ...specialPlans, childrenSpecialOption: 'free' })}
                              className="accent-[#0000AA]" />
                            {t('common.free')}
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={specialPlans.childrenSpecialOption === 'paid'}
                              onChange={() => setSpecialPlans({ ...specialPlans, childrenSpecialOption: 'paid' })}
                              className="accent-[#0000AA]" />
                            {t('common.paid')}
                          </label>
                        </div>
                        {specialPlans.childrenSpecialOption === 'paid' && (
                          <div className="relative max-w-[180px] mt-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">HTG</span>
                            <input type="number" value={specialPlans.childrenSpecialPrice}
                              onChange={(e) => setSpecialPlans({ ...specialPlans, childrenSpecialPrice: e.target.value })}
                              className={`${inputClass} pl-12 text-xs py-2`} placeholder="0.00" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly discount */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{t('accommodationForm.specialPlans.weeklyTitle')}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{t('accommodationForm.specialPlans.weeklySubtitle')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSpecialPlans({ ...specialPlans, weeklyDiscountEnabled: !specialPlans.weeklyDiscountEnabled })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        specialPlans.weeklyDiscountEnabled ? 'bg-[#0000AA]' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        specialPlans.weeklyDiscountEnabled ? 'translate-x-4' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  {specialPlans.weeklyDiscountEnabled && pricing.pricePerNight && (
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-500">{t('accommodationForm.specialPlans.standardPrice')}</span>
                        <span className="font-medium">HTG {parseFloat(pricing.pricePerNight || '0').toLocaleString()}/nwit</span>
                      </div>
                      <div className="flex justify-between text-[#0000AA] font-semibold">
                        <span>{t('accommodationForm.specialPlans.weeklyPrice')} (-{specialPlans.weeklyDiscountRate}%)</span>
                        <span>HTG {(parseFloat(pricing.pricePerNight || '0') * 0.85).toLocaleString()}/nwit</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: AVAILABILITY */}
          {currentStep === 7 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">8</span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.availability.title')}</h2>
              </div>
              <div className="p-6 space-y-6">

                {/* Available from */}
                <div>
                  <label className={labelClass}>{t('accommodationForm.availability.availableFrom')}</label>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      availability.availableFrom === 'immediate' ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" checked={availability.availableFrom === 'immediate'}
                        onChange={() => setAvailability({ ...availability, availableFrom: 'immediate' })}
                        className="accent-[#0000AA]" />
                      <span className="text-sm text-slate-700">{t('accommodationForm.availability.immediate')}</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      availability.availableFrom === 'specific' ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" checked={availability.availableFrom === 'specific'}
                        onChange={() => setAvailability({ ...availability, availableFrom: 'specific' })}
                        className="accent-[#0000AA]" />
                      <span className="text-sm text-slate-700">{t('accommodationForm.availability.specificDate')}</span>
                    </label>
                  </div>
                  {availability.availableFrom === 'specific' && (
                    <div className="mt-3 relative max-w-xs">
                      <MdDateRange size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" value={availability.availableFromDate}
                        onChange={(e) => setAvailability({ ...availability, availableFromDate: e.target.value })}
                        className={`${inputClass} pl-10`} min={new Date().toISOString().split('T')[0]} />
                    </div>
                  )}
                </div>

                {/* Booking period type */}
                <div className="border-t border-slate-100 pt-6">
                  <label className={labelClass}>{t('accommodationForm.availability.bookingPeriodType')}</label>
                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      availability.bookingPeriodType === 'renewable' ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" checked={availability.bookingPeriodType === 'renewable'}
                        onChange={() => setAvailability({ ...availability, bookingPeriodType: 'renewable' })}
                        className="accent-[#0000AA] mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-700">{t('accommodationForm.availability.renewable')}</p>
                        {availability.bookingPeriodType === 'renewable' && (
                          <select value={availability.bookingPeriodMonths}
                            onChange={(e) => setAvailability({ ...availability, bookingPeriodMonths: e.target.value })}
                            className={`${inputClass} mt-2 max-w-[180px] text-xs py-1.5`}>
                            {['3','6','9','12'].map(m => (
                              <option key={m} value={m}>{m} {t('accommodationForm.availability.months')}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      availability.bookingPeriodType === 'fixed' ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" checked={availability.bookingPeriodType === 'fixed'}
                        onChange={() => setAvailability({ ...availability, bookingPeriodType: 'fixed' })}
                        className="accent-[#0000AA]" />
                      <div>
                        <p className="text-sm text-slate-700">{t('accommodationForm.availability.fixed')}</p>
                        {availability.bookingPeriodType === 'fixed' && (
                          <select value={availability.bookingPeriodMonths}
                            onChange={(e) => setAvailability({ ...availability, bookingPeriodMonths: e.target.value })}
                            className={`${inputClass} mt-2 max-w-[180px] text-xs py-1.5`}>
                            {['3','6','9','12','18','24'].map(m => (
                              <option key={m} value={m}>{m} {t('accommodationForm.availability.months')}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Allow 30+ nights */}
                <div className="border-t border-slate-100 pt-6">
                  <label className={labelClass}>{t('accommodationForm.availability.allow30Plus')}</label>
                  <div className="flex gap-4 text-sm text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={availability.allow30PlusNights === true}
                        onChange={() => setAvailability({ ...availability, allow30PlusNights: true })}
                        className="accent-[#0000AA]" />
                      {t('common.yes')}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={availability.allow30PlusNights === false}
                        onChange={() => setAvailability({ ...availability, allow30PlusNights: false })}
                        className="accent-[#0000AA]" />
                      {t('common.no')}
                    </label>
                  </div>
                  {availability.allow30PlusNights && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.availability.maxNights')}</label>
                      <select value={availability.maxNights}
                        onChange={(e) => setAvailability({ ...availability, maxNights: e.target.value })}
                        className={`${inputClass} max-w-[180px]`}>
                        {['40','50','60','90','120','180','365'].map(n => (
                          <option key={n} value={n}>{n} {t('accommodationForm.availability.nights')}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: REPRESENTATIVE */}
          {currentStep === 8 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">9</span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.representative.title')}</h2>
              </div>
              <div className="p-6 space-y-6">

                <div>
                  <label className={labelClass}>{t('accommodationForm.representative.ownerType')}</label>
                  <select
                    value={representative.ownerType}
                    onChange={(e) => setRepresentative({ ...representative, ownerType: e.target.value as '' | 'individual' | 'company' })}
                    className={inputClass}
                    required
                  >
                    <option value="">{t('accommodationForm.representative.selectType')}</option>
                    <option value="individual">{t('accommodationForm.representative.individual')}</option>
                    <option value="company">{t('accommodationForm.representative.company')}</option>
                  </select>
                </div>

                {/* Individual representative */}
                {representative.ownerType === 'individual' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{t('accommodationForm.representative.firstName')}</label>
                        <input type="text" value={representative.repFirstName}
                          onChange={(e) => setRepresentative({ ...representative, repFirstName: e.target.value })}
                          className={inputClass} required />
                      </div>
                      <div>
                        <label className={labelClass}>{t('accommodationForm.representative.lastName')}</label>
                        <input type="text" value={representative.repLastName}
                          onChange={(e) => setRepresentative({ ...representative, repLastName: e.target.value })}
                          className={inputClass} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>{t('accommodationForm.representative.birthDate')}</label>
                      <input type="date" value={representative.repBirthDate}
                        onChange={(e) => setRepresentative({ ...representative, repBirthDate: e.target.value })}
                        className={`${inputClass} max-w-xs`} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{t('accommodationForm.representative.email')}</label>
                        <input type="email" value={representative.repEmail}
                          onChange={(e) => setRepresentative({ ...representative, repEmail: e.target.value })}
                          className={inputClass} required />
                      </div>
                      <div>
                        <label className={labelClass}>{t('accommodationForm.representative.phone')}</label>
                        <input type="tel" value={representative.repPhone}
                          onChange={(e) => setRepresentative({ ...representative, repPhone: e.target.value })}
                          className={inputClass} required />
                      </div>
                    </div>

                    {/* Additional reps */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-slate-700">{t('accommodationForm.representative.additionalReps')}</p>
                        <button type="button"
                          onClick={() => setRepresentative({ ...representative, additionalReps: [...representative.additionalReps, { firstName: '', lastName: '', email: '' }] })}
                          className="flex items-center gap-1.5 text-sm font-medium text-[#0000AA] hover:bg-[#0000AA]/5 px-3 py-1.5 rounded-md transition-colors">
                          <MdAdd size={16} /> {t('accommodationForm.representative.addRep')}
                        </button>
                      </div>
                      {representative.additionalReps.map((rep, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-md p-4 mb-3 bg-slate-50/50">
                          <div className="flex justify-end mb-2">
                            <button type="button" className="text-slate-400 hover:text-red-500"
                              onClick={() => setRepresentative({ ...representative, additionalReps: representative.additionalReps.filter((_, i) => i !== idx) })}>
                              <MdDelete size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.representative.firstName')}</label>
                              <input type="text" value={rep.firstName}
                                onChange={(e) => { const r = [...representative.additionalReps]; r[idx].firstName = e.target.value; setRepresentative({ ...representative, additionalReps: r }); }}
                                className={`${inputClass} text-xs py-2`} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.representative.lastName')}</label>
                              <input type="text" value={rep.lastName}
                                onChange={(e) => { const r = [...representative.additionalReps]; r[idx].lastName = e.target.value; setRepresentative({ ...representative, additionalReps: r }); }}
                                className={`${inputClass} text-xs py-2`} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">{t('accommodationForm.representative.email')}</label>
                              <input type="email" value={rep.email}
                                onChange={(e) => { const r = [...representative.additionalReps]; r[idx].email = e.target.value; setRepresentative({ ...representative, additionalReps: r }); }}
                                className={`${inputClass} text-xs py-2`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company representative */}
                {representative.ownerType === 'company' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>{t('accommodationForm.representative.companyName')}</label>
                      <div className="relative">
                        <MdBusiness size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={representative.companyName}
                          onChange={(e) => setRepresentative({ ...representative, companyName: e.target.value })}
                          className={`${inputClass} pl-10`} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>{t('accommodationForm.representative.companyReg')}</label>
                      <input type="text" value={representative.companyReg}
                        onChange={(e) => setRepresentative({ ...representative, companyReg: e.target.value })}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>{t('accommodationForm.representative.companyAddress')}</label>
                      <input type="text" value={representative.companyAddress}
                        onChange={(e) => setRepresentative({ ...representative, companyAddress: e.target.value })}
                        className={inputClass} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{t('accommodationForm.representative.companyRepName')}</label>
                        <input type="text" value={representative.companyRepName}
                          onChange={(e) => setRepresentative({ ...representative, companyRepName: e.target.value })}
                          className={inputClass} required />
                      </div>
                      <div>
                        <label className={labelClass}>{t('accommodationForm.representative.companyRepTitle')}</label>
                        <input type="text" value={representative.companyRepTitle}
                          onChange={(e) => setRepresentative({ ...representative, companyRepTitle: e.target.value })}
                          className={inputClass} required />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 10: CONTRACT INFO */}
          {currentStep === 9 && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0000AA] text-white text-sm font-semibold">10</span>
                <h2 className="text-base font-semibold text-slate-900">{t('accommodationForm.contract.title')}</h2>
              </div>
              <div className="p-6 space-y-6">

                <div>
                  <label className={labelClass}>{t('accommodationForm.contract.entityType')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      contract.entityType === 'individual' ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" checked={contract.entityType === 'individual'}
                        onChange={() => setContract({ ...contract, entityType: 'individual' })}
                        className="accent-[#0000AA] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{t('accommodationForm.contract.individual')}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t('accommodationForm.contract.individualDesc')}</p>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      contract.entityType === 'commercial' ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="radio" checked={contract.entityType === 'commercial'}
                        onChange={() => setContract({ ...contract, entityType: 'commercial' })}
                        className="accent-[#0000AA] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{t('accommodationForm.contract.commercial')}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t('accommodationForm.contract.commercialDesc')}</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Individual contract form */}
                {contract.entityType === 'individual' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">{t('accommodationForm.contract.personalInfo')}</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>
                              {t('accommodationForm.contract.firstName')} <span className="text-[#FF6600]">*</span>
                            </label>
                            <input type="text" value={contract.contractFirstName}
                              onChange={(e) => setContract({ ...contract, contractFirstName: e.target.value })}
                              className={inputClass} placeholder={t('accommodationForm.contract.asOnId')} required />
                          </div>
                          <div>
                            <label className={labelClass}>
                              {t('accommodationForm.contract.lastName')} <span className="text-[#FF6600]">*</span>
                            </label>
                            <input type="text" value={contract.contractLastName}
                              onChange={(e) => setContract({ ...contract, contractLastName: e.target.value })}
                              className={inputClass} placeholder={t('accommodationForm.contract.asOnId')} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>{t('accommodationForm.contract.email')}</label>
                            <input type="email" value={contract.contractEmail}
                              onChange={(e) => setContract({ ...contract, contractEmail: e.target.value })}
                              className={inputClass} required />
                          </div>
                          <div>
                            <label className={labelClass}>{t('accommodationForm.contract.phone')}</label>
                            <input type="tel" value={contract.contractPhone}
                              onChange={(e) => setContract({ ...contract, contractPhone: e.target.value })}
                              className={inputClass} required />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">{t('accommodationForm.contract.residenceInfo')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>{t('accommodationForm.contract.country')}</label>
                          <select value={contract.contractCountry}
                            onChange={(e) => setContract({ ...contract, contractCountry: e.target.value })}
                            className={inputClass}>
                            {countries.map((c) => (
                              <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{t('accommodationForm.contract.address')}</label>
                          <div className="relative">
                            <MdLocationOn size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" value={contract.contractAddress}
                              onChange={(e) => setContract({ ...contract, contractAddress: e.target.value })}
                              className={`${inputClass} pl-10`} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>{t('accommodationForm.contract.city')}</label>
                            <input type="text" value={contract.contractCity}
                              onChange={(e) => setContract({ ...contract, contractCity: e.target.value })}
                              className={inputClass} required />
                          </div>
                          <div>
                            <label className={labelClass}>{t('accommodationForm.contract.postalCode')}</label>
                            <input type="text" value={contract.contractPostalCode}
                              onChange={(e) => setContract({ ...contract, contractPostalCode: e.target.value })}
                              className={inputClass} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Commercial entity - placeholder */}
                {contract.entityType === 'commercial' && (
                  <div className="rounded-lg border border-slate-200 p-4 bg-slate-50 text-sm text-slate-500 text-center">
                    {t('accommodationForm.contract.commercialFormComingSoon')}
                  </div>
                )}

                {/* Legal certification */}
                {contract.entityType && (
                  <div className="border-t border-slate-100 pt-5">
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      contract.legalCertification ? 'border-[#0000AA] bg-[#0000AA]/[0.03]' : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="checkbox" checked={contract.legalCertification}
                        onChange={(e) => setContract({ ...contract, legalCertification: e.target.checked })}
                        className="accent-[#0000AA] mt-0.5" required />
                      <div className="flex items-start gap-2">
                        <MdLock size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-700">{t('accommodationForm.contract.legalCertification')}</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                isFirstStep
                  ? 'opacity-0 pointer-events-none'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MdArrowBack size={18} />
              {t('accommodationForm.previousButton')}
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-sm text-white bg-[#0000AA] hover:bg-[#000088] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t('accommodationForm.nextButton')}
                <MdArrowForward size={18} />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-sm text-white bg-[#FF6600] hover:bg-[#e65c00] transition-colors"
              >
                <MdCheck size={18} />
                {t('accommodationForm.submitButton')}
              </button>
            )}
          </div>

          {!isStepValid(currentStep) && currentStep <= 1 && (
            <p className="text-xs text-[#FF6600] text-right mt-2">{t('accommodationForm.requiredFieldsNote')}</p>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterAccommodationScreen;