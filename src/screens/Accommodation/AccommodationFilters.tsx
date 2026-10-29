import React, { useState } from 'react';
import { 
  MdClose, 
  MdAttachMoney, 
  MdBed, 
  MdBathroom, 
  MdPeople,
  MdWifi,
  MdKitchen,
  MdAcUnit,
  MdPool,
  MdLocalLaundryService,
  MdTv,
  MdHotTub,
  MdHouse,
  MdApartment
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';

interface Filters {
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  propertyType: string;
}

interface AccommodationFiltersProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
  onReset: () => void;
  onClose: () => void;
}

const AccommodationFilters: React.FC<AccommodationFiltersProps> = ({ 
  filters, 
  onApply, 
  onReset, 
  onClose 
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);
  const { t } = useTranslation();

  const amenitiesList = [
    { id: 'wifi', label: 'wifi', icon: <MdWifi size={16} /> },
    { id: 'kitchen', label: 'kitchen', icon: <MdKitchen size={16} /> },
    { id: 'ac', label: 'airConditioning', icon: <MdAcUnit size={16} /> },
    { id: 'pool', label: 'pool', icon: <MdPool size={16} /> },
    { id: 'washingMachine', label: 'washingMachine', icon: <MdLocalLaundryService size={16} /> },
    { id: 'tv', label: 'tv', icon: <MdTv size={16} /> },
    { id: 'jacuzzi', label: 'jacuzzi', icon: <MdHotTub size={16} /> }
  ];

  const propertyTypes = [
    { id: '', label: 'allTypes' },
    { id: 'house', label: 'house', icon: <MdHouse size={16} /> },
    { id: 'apartment', label: 'apartment', icon: <MdApartment size={16} /> },
    { id: 'villa', label: 'villa', icon: <MdHouse size={16} /> },
    { id: 'hotel', label: 'hotel', icon: <MdApartment size={16} /> },
    { id: 'guesthouse', label: 'guesthouse', icon: <MdHouse size={16} /> },
    { id: 'cabin', label: 'cabin', icon: <MdHouse size={16} /> },
    { id: 'other', label: 'other', icon: <MdHouse size={16} /> }
  ];

  const handleAmenityToggle = (amenityId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">{t('accommodations.filters.title')}</h3>
        <button type="button" onClick={onClose} aria-label={t('accommodations.filters.close')} className="text-gray-400 hover:text-gray-600">
          <MdClose size={20} />
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="accommodation-city" className="block text-sm font-medium text-gray-700 mb-2">
          {t('accommodations.filters.city')}
        </label>
        <input
          id="accommodation-city"
          type="text"
          placeholder={t('accommodations.filters.cityPlaceholder')}
          value={localFilters.city}
          onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
          className="w-full px-2 py-2 text-sm border border-gray-300 rounded"
        />
      </div>

      {/* Price range */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <MdAttachMoney size={16} /> {t('accommodations.booking.pricePerNight')}
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            aria-label={t('accommodations.filters.minPrice')}
            placeholder={t('accommodations.filters.minPrice')}
            value={localFilters.minPrice || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, minPrice: Number(e.target.value) })}
            className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <input
            type="number"
            aria-label={t('accommodations.filters.maxPrice')}
            placeholder={t('accommodations.filters.maxPrice')}
            value={localFilters.maxPrice || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) })}
            className="w-1/2 px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <MdBed size={16} /> {t('accommodations.filters.bedrooms')}
        </h4>
        <select
          value={localFilters.bedrooms}
          onChange={(e) => setLocalFilters({ ...localFilters, bedrooms: Number(e.target.value) })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value={0}>{t('accommodations.filters.any')}</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <MdBathroom size={16} /> {t('accommodations.filters.bathrooms')}
        </h4>
        <select
          value={localFilters.bathrooms}
          onChange={(e) => setLocalFilters({ ...localFilters, bathrooms: Number(e.target.value) })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value={0}>{t('accommodations.filters.any')}</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
        </select>
      </div>

      {/* Max guests */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <MdPeople size={16} /> {t('accommodations.filters.guests')}
        </h4>
        <select
          value={localFilters.maxGuests}
          onChange={(e) => setLocalFilters({ ...localFilters, maxGuests: Number(e.target.value) })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value={0}>{t('accommodations.filters.any')}</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={4}>4+</option>
          <option value={6}>6+</option>
          <option value={8}>8+</option>
        </select>
      </div>

      {/* Property type */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{t('accommodations.filters.propertyType')}</h4>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setLocalFilters({ ...localFilters, propertyType: type.id })}
              className={`px-3 py-1 text-xs rounded-full border ${
                localFilters.propertyType === type.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type.id
                ? t(`accommodations.propertyTypes.${type.label}`)
                : t(`accommodations.filters.${type.label}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{t('accommodations.filters.amenities')}</h4>
        <div className="space-y-1">
          {amenitiesList.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.amenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="text-blue-600"
              />
              {amenity.icon}
              <span>{t(`accommodations.filters.${amenity.label}`)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2 border-t">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
        >
          {t('accommodations.filters.apply')}
        </button>
        <button
          type="button"
          onClick={() => {
            setLocalFilters({
              city: '',
              minPrice: 0,
              maxPrice: 0,
              bedrooms: 0,
              bathrooms: 0,
              maxGuests: 0,
              amenities: [],
              propertyType: '',
            });
            onReset();
          }}
          className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
        >
          {t('accommodations.filters.reset')}
        </button>
      </div>
    </div>
  );
};

export default AccommodationFilters;