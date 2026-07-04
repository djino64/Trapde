import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  MdLocalLaundryService,
  MdPool,
  MdHotTub,
  MdTv,
  MdBalcony,
  MdYard,
  MdFreeBreakfast,
  MdLocalParking,
  MdSmokingRooms,
  MdEmojiEvents,
  MdPets,
  MdAccessTime,
  MdCalendarToday,
  MdArrowBack,
  MdShare,
  MdFavorite,
  MdFavoriteBorder
} from 'react-icons/md';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

interface Accommodation {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  images: string[];
  bedrooms: number;
  livingRooms: number;
  bathrooms: number;
  maxGuests: number;
  childrenCount: number;
  acceptsChildren: boolean;
  hasBabyBed: boolean;
  babyBedPrice?: number;
  surfaceArea: number;
  amenities: {
    ac: boolean;
    heating: boolean;
    wifi: boolean;
    kitchen: boolean;
    washingMachine: boolean;
    tv: boolean;
    pool: boolean;
    jacuzzi: boolean;
    minibar: boolean;
    balcony: boolean;
    garden: boolean;
    terrace: boolean;
  };
  breakfastIncluded: boolean;
  parking: 'free' | 'paid' | 'none';
  parkingPrice?: number;
  languages: string[];
  smokingAllowed: boolean;
  eventsAllowed: boolean;
  petsAllowed: 'yes' | 'on_request' | 'no';
  openingHours: {
    start: string;
    end: string;
  };
  rooms: Array<{
    type: string;
    beds: Array<{ type: string; quantity: number }>;
  }>;
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    responseRate: number;
  };
}

const AccommodationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: Accommodation = {
        id: Number(id),
        name: "Villa Belle Vue",
        address: "123 Rue des Palmiers",
        city: "Port-au-Prince",
        country: "Haïti",
        rating: 4.8,
        images: [
          "https://via.placeholder.com/800x500",
          "https://via.placeholder.com/800x500",
          "https://via.placeholder.com/800x500",
          "https://via.placeholder.com/800x500"
        ],
        bedrooms: 3,
        livingRooms: 2,
        bathrooms: 2,
        maxGuests: 6,
        childrenCount: 2,
        acceptsChildren: true,
        hasBabyBed: true,
        babyBedPrice: 10,
        surfaceArea: 120,
        amenities: {
          ac: true,
          heating: false,
          wifi: true,
          kitchen: true,
          washingMachine: true,
          tv: true,
          pool: true,
          jacuzzi: false,
          minibar: true,
          balcony: true,
          garden: true,
          terrace: false
        },
        breakfastIncluded: true,
        parking: 'free',
        parkingPrice: undefined,
        languages: ['Kreyòl', 'Français', 'Anglè'],
        smokingAllowed: false,
        eventsAllowed: true,
        petsAllowed: 'on_request',
        openingHours: {
          start: '08:00',
          end: '20:00'
        },
        rooms: [
          {
            type: "Master Bedroom",
            beds: [{ type: 'king', quantity: 1 }]
          },
          {
            type: "Guest Bedroom 1",
            beds: [{ type: 'double', quantity: 1 }]
          },
          {
            type: "Guest Bedroom 2",
            beds: [{ type: 'single', quantity: 2 }]
          }
        ],
        host: {
          name: "Jean Claude",
          avatar: "https://via.placeholder.com/80",
          isSuperhost: true,
          responseRate: 98
        }
      };
      setAccommodation(mockData);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-700">Accommodation not found</h2>
          <button onClick={() => navigate('/accommodations')} className="mt-4 text-blue-600 hover:underline">
            Back to listings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back button */}
        <button 
          onClick={() => navigate('/accommodations')}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mb-4"
        >
          <MdArrowBack size={18} />
          Back to listings
        </button>

        {/* Title and actions */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{accommodation.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <MdLocationOn size={14} />
              <span>{accommodation.address}, {accommodation.city}, {accommodation.country}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MdShare size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isFavorite ? (
                <MdFavorite size={20} className="text-red-500" />
              ) : (
                <MdFavoriteBorder size={20} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Images gallery */}
        <div className="grid grid-cols-2 gap-1 h-96 mb-6 rounded-lg overflow-hidden">
          <div className="col-span-1">
            <img 
              src={accommodation.images[selectedImage]} 
              alt={accommodation.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(0)}
            />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {accommodation.images.slice(1, 5).map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`${accommodation.name} ${idx + 2}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(idx + 1)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rating and host */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <MdStar size={18} className="text-yellow-500" />
                  <span className="font-semibold">{accommodation.rating}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-600">20 reviews</span>
                </div>
                {accommodation.host.isSuperhost && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <MdVerified size={16} />
                    <span className="text-sm">Superhost</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <img 
                  src={accommodation.host.avatar} 
                  alt={accommodation.host.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{accommodation.host.name}</p>
                  <p className="text-xs text-gray-500">{accommodation.host.responseRate}% response rate</p>
                </div>
              </div>
            </div>

            {/* Property details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">About this property</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <MdBed size={20} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">{accommodation.bedrooms} bedrooms</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <MdBathroom size={20} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">{accommodation.bathrooms} bathrooms</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <MdPeople size={20} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">{accommodation.maxGuests} guests max</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Surface area: {accommodation.surfaceArea} m² · Living rooms: {accommodation.livingRooms}
              </p>
            </div>

            {/* Rooms */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">Rooms & Beds</h2>
              {accommodation.rooms.map((room, idx) => (
                <div key={idx} className="mb-3 pb-3 border-b last:border-0">
                  <h3 className="font-medium text-gray-800 mb-2">{room.type}</h3>
                  {room.beds.map((bed, bedIdx) => (
                    <p key={bedIdx} className="text-sm text-gray-600">
                      {bed.quantity} {bed.type} bed{bed.quantity > 1 ? 's' : ''}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-2">
                {accommodation.amenities.ac && (
                  <div className="flex items-center gap-2 text-sm"><MdAcUnit size={16} /> Air conditioning</div>
                )}
                {accommodation.amenities.wifi && (
                  <div className="flex items-center gap-2 text-sm"><MdWifi size={16} /> WiFi</div>
                )}
                {accommodation.amenities.kitchen && (
                  <div className="flex items-center gap-2 text-sm"><MdKitchen size={16} /> Kitchen</div>
                )}
                {accommodation.amenities.washingMachine && (
                  <div className="flex items-center gap-2 text-sm"><MdLocalLaundryService size={16} /> Washing machine</div>
                )}
                {accommodation.amenities.tv && (
                  <div className="flex items-center gap-2 text-sm"><MdTv size={16} /> TV</div>
                )}
                {accommodation.amenities.pool && (
                  <div className="flex items-center gap-2 text-sm"><MdPool size={16} /> Pool</div>
                )}
                {accommodation.amenities.jacuzzi && (
                  <div className="flex items-center gap-2 text-sm"><MdHotTub size={16} /> Jacuzzi</div>
                )}
                {accommodation.amenities.balcony && (
                  <div className="flex items-center gap-2 text-sm"><MdBalcony size={16} /> Balcony</div>
                )}
                {accommodation.amenities.garden && (
                  <div className="flex items-center gap-2 text-sm"><MdYard size={16} /> Garden</div>
                )}
              </div>
            </div>

            {/* Services & Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-3">Services & Rules</h2>
              <div className="space-y-2 text-sm">
                {accommodation.breakfastIncluded && (
                  <div className="flex items-center gap-2"><MdFreeBreakfast size={16} /> Breakfast included</div>
                )}
                {accommodation.parking === 'free' && (
                  <div className="flex items-center gap-2"><MdLocalParking size={16} /> Free parking</div>
                )}
                {accommodation.parking === 'paid' && (
                  <div className="flex items-center gap-2"><MdLocalParking size={16} /> Paid parking (${accommodation.parkingPrice}/night)</div>
                )}
                <div className="flex items-center gap-2">
                  <MdAccessTime size={16} />
                  Check-in: {accommodation.openingHours.start} - {accommodation.openingHours.end}
                </div>
                {accommodation.smokingAllowed && (
                  <div className="flex items-center gap-2"><MdSmokingRooms size={16} /> Smoking allowed</div>
                )}
                {accommodation.eventsAllowed && (
                  <div className="flex items-center gap-2"><MdEmojiEvents size={16} /> Events allowed</div>
                )}
                {accommodation.petsAllowed === 'yes' && (
                  <div className="flex items-center gap-2"><MdPets size={16} /> Pets allowed</div>
                )}
                {accommodation.petsAllowed === 'on_request' && (
                  <div className="flex items-center gap-2"><MdPets size={16} /> Pets on request</div>
                )}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4">
              <div className="mb-3">
                <span className="text-2xl font-bold">${accommodation.price || 150}</span>
                <span className="text-gray-600"> / night</span>
              </div>

              {/* Booking form */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
                  <div className="relative">
                    <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
                  <div className="relative">
                    <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Guests</label>
                  <div className="flex items-center gap-2">
                    <MdPeople className="text-gray-400" size={16} />
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                    >
                      {Array.from({ length: accommodation.maxGuests }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition mb-3">
                Reserve
              </button>

              <p className="text-xs text-center text-gray-500">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AccommodationDetails;