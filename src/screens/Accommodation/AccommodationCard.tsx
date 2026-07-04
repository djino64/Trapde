import React from 'react';
import { 
  MdLocationOn, 
  MdBed, 
  MdBathroom, 
  MdPeople,
  MdStar,
  MdVerified,
  MdWifi,
  MdKitchen,
  MdAcUnit
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

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
  isVerified = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/accommodation/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {isVerified && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
            <MdVerified size={16} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title and rating */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 text-sm">
            <MdStar size={14} className="text-yellow-500" />
            <span className="text-gray-600">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MdLocationOn size={12} />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Features */}
        <div className="flex gap-3 mb-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MdBed size={12} />
            <span>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MdBathroom size={12} />
            <span>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MdPeople size={12} />
            <span>{maxGuests} guests</span>
          </div>
        </div>

        {/* Amenities preview */}
        {amenities.length > 0 && (
          <div className="flex gap-2 mb-2">
            {amenities.slice(0, 3).map((amenity, index) => {
              if (amenity === 'wifi') return <MdWifi key={index} size={12} className="text-gray-400" />;
              if (amenity === 'kitchen') return <MdKitchen key={index} size={12} className="text-gray-400" />;
              if (amenity === 'ac') return <MdAcUnit key={index} size={12} className="text-gray-400" />;
              return null;
            })}
            {amenities.length > 3 && (
              <span className="text-xs text-gray-400">+{amenities.length - 3}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="border-t pt-2 mt-1">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-gray-900">${price}</span>
            <span className="text-xs text-gray-500">per night</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;