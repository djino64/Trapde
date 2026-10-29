import React, { useState } from 'react';
import { 
  MdLocationOn,
  MdBed,
  MdBathroom,
  MdPeople,
  MdStar,
  MdVerified,
  MdWifi,
  MdKitchen,
  MdAcUnit,
  MdPool,
  MdLocalLaundryService,
  MdTv,
  MdHotTub,
  MdFavorite,
  MdFavoriteBorder,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AccommodationCardProps {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities?: string[];
  isVerified?: boolean;
  propertyType: string;
  isFavorite?: boolean;
  isFavoritePending?: boolean;
  onFavoriteToggle?: (id: number) => void;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({
  id,
  name,
  location,
  price,
  rating,
  image,
  bedrooms,
  bathrooms,
  maxGuests,
  amenities = [],
  isVerified = false,
  propertyType,
  isFavorite = false,
  isFavoritePending = false,
  onFavoriteToggle,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/accommodation/${id}`);
  };

  const priceLabel = new Intl.NumberFormat(i18n.resolvedLanguage || 'ht', {
    style: 'currency',
    currency: 'HTG',
    maximumFractionDigits: 0,
  }).format(price);

  const amenityIcons = {
    wifi: { Icon: MdWifi, label: t('accommodations.amenities.wifi') },
    kitchen: { Icon: MdKitchen, label: t('accommodations.amenities.kitchen') },
    ac: { Icon: MdAcUnit, label: t('accommodations.amenities.airConditioning') },
    pool: { Icon: MdPool, label: t('accommodations.amenities.pool') },
    washingMachine: { Icon: MdLocalLaundryService, label: t('accommodations.amenities.washingMachine') },
    tv: { Icon: MdTv, label: t('accommodations.amenities.tv') },
    jacuzzi: { Icon: MdHotTub, label: t('accommodations.amenities.jacuzzi') },
  };

  return (
    <article className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {onFavoriteToggle && (
        <button
          type="button"
          aria-label={t(isFavorite
            ? 'accommodations.detail.removeFavorite'
            : 'accommodations.detail.addFavorite')}
          aria-pressed={isFavorite}
          disabled={isFavoritePending}
          onClick={() => onFavoriteToggle(id)}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-red-500 shadow disabled:opacity-50"
        >
          {isFavorite
            ? <MdFavorite size={20} />
            : <MdFavoriteBorder size={20} className="text-gray-700" />}
        </button>
      )}
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${t('accommodations.card.viewDetails')}: ${name}`}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <div className="relative h-48 bg-gray-100">
          {image && !imageError ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
              {t('accommodations.card.imageUnavailable')}
            </div>
          )}
          {isVerified && (
            <span className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
              <MdVerified size={14} />
              {t('accommodations.card.available')}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-1">
            <div className="min-w-0">
              <span className="text-xs font-medium text-blue-700">
                {t(`accommodations.propertyTypes.${propertyType}`, {
                  defaultValue: propertyType,
                })}
              </span>
              <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                {name}
              </h3>
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <MdStar size={14} className="text-yellow-500" />
                <span className="text-gray-600">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MdLocationOn size={15} />
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <MdBed size={14} />
              {bedrooms} {t(bedrooms === 1
                ? 'accommodations.card.bed'
                : 'accommodations.card.beds')}
            </span>
            <span className="flex items-center gap-1">
              <MdBathroom size={14} />
              {bathrooms} {t(bathrooms === 1
                ? 'accommodations.card.bath'
                : 'accommodations.card.baths')}
            </span>
            <span className="flex items-center gap-1">
              <MdPeople size={14} />
              {maxGuests} {t(maxGuests === 1
                ? 'accommodations.card.guest'
                : 'accommodations.card.guests')}
            </span>
          </div>

          {amenities.length > 0 && (
            <div className="flex gap-3 mb-3 text-gray-500" aria-label={t('accommodations.filters.amenities')}>
              {amenities.slice(0, 4).map((amenity) => {
                const item = amenityIcons[amenity as keyof typeof amenityIcons];
                if (!item) return null;
                const { Icon } = item;
                return <Icon key={amenity} size={16} title={item.label} aria-label={item.label} />;
              })}
              {amenities.length > 4 && (
                <span className="text-xs">+{amenities.length - 4}</span>
              )}
            </div>
          )}

          <div className="border-t pt-3 flex items-baseline justify-between gap-2">
            <span className="text-lg font-bold text-gray-900">{priceLabel}</span>
            <span className="text-xs text-gray-500">
              {t('accommodations.card.perNight')}
            </span>
          </div>

          <span className="mt-3 block text-sm font-medium text-blue-700">
            {t('accommodations.card.viewDetails')}
          </span>
        </div>
      </button>
    </article>
  );
};

export default AccommodationCard;