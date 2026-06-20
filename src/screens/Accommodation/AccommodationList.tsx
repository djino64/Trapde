import React, { useState, useEffect } from 'react';
import AccommodationCard from './AccommodationCard';
import AccommodationFilters from './AccommodationFilters';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { MdSearch, MdFilterList } from 'react-icons/md';

interface Accommodation {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  isVerified: boolean;
}

interface Filters {
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  propertyType: string;
}

const AccommodationList: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 1000,
    bedrooms: 0,
    bathrooms: 0,
    maxGuests: 0,
    amenities: [],
    propertyType: ''
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: Accommodation[] = [
        {
          id: 1,
          name: "Villa Belle Vue",
          location: "Port-au-Prince, Haiti",
          price: 120,
          rating: 4.8,
          image: "https://via.placeholder.com/400x300",
          bedrooms: 3,
          bathrooms: 2,
          maxGuests: 6,
          amenities: ["wifi", "kitchen", "ac", "pool"],
          isVerified: true
        },
        {
          id: 2,
          name: "Beachfront Apartment",
          location: "Jacmel, Haiti",
          price: 95,
          rating: 4.6,
          image: "https://via.placeholder.com/400x300",
          bedrooms: 2,
          bathrooms: 1,
          maxGuests: 4,
          amenities: ["wifi", "kitchen", "ac"],
          isVerified: false
        },
        {
          id: 3,
          name: "Mountain Retreat",
          location: "Kenscoff, Haiti",
          price: 150,
          rating: 4.9,
          image: "https://via.placeholder.com/400x300",
          bedrooms: 4,
          bathrooms: 3,
          maxGuests: 8,
          amenities: ["wifi", "kitchen", "ac", "pool", "jacuzzi"],
          isVerified: true
        },
        {
          id: 4,
          name: "City Center Loft",
          location: "Pétion-Ville, Haiti",
          price: 85,
          rating: 4.5,
          image: "https://via.placeholder.com/400x300",
          bedrooms: 1,
          bathrooms: 1,
          maxGuests: 2,
          amenities: ["wifi", "kitchen"],
          isVerified: false
        },
        {
          id: 5,
          name: "Luxury Ocean Villa",
          location: "Cap-Haïtien, Haiti",
          price: 250,
          rating: 5.0,
          image: "https://via.placeholder.com/400x300",
          bedrooms: 5,
          bathrooms: 4,
          maxGuests: 10,
          amenities: ["wifi", "kitchen", "ac", "pool", "jacuzzi", "gym"],
          isVerified: true
        }
      ];
      setAccommodations(mockData);
      setFilteredAccommodations(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let results = [...accommodations];

    // Search filter
    if (searchTerm) {
      results = results.filter(acc => 
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    results = results.filter(acc => 
      acc.price >= filters.minPrice && acc.price <= filters.maxPrice
    );

    // Bedrooms filter
    if (filters.bedrooms > 0) {
      results = results.filter(acc => acc.bedrooms >= filters.bedrooms);
    }

    // Bathrooms filter
    if (filters.bathrooms > 0) {
      results = results.filter(acc => acc.bathrooms >= filters.bathrooms);
    }

    // Guests filter
    if (filters.maxGuests > 0) {
      results = results.filter(acc => acc.maxGuests >= filters.maxGuests);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      results = results.filter(acc => 
        filters.amenities.every(amenity => acc.amenities.includes(amenity))
      );
    }

    setFilteredAccommodations(results);
  }, [searchTerm, filters, accommodations]);

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
      bedrooms: 0,
      bathrooms: 0,
      maxGuests: 0,
      amenities: [],
      propertyType: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Find your perfect stay</h1>
          <p className="text-sm text-gray-500">{filteredAccommodations.length} accommodations available</p>
        </div>

        {/* Search and filter bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <MdFilterList size={18} />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-6">
            <AccommodationFilters
              filters={filters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : filteredAccommodations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No accommodations found matching your criteria.</p>
            <button 
              onClick={handleResetFilters}
              className="mt-2 text-blue-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAccommodations.map(accommodation => (
              <AccommodationCard key={accommodation.id} {...accommodation} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AccommodationList;