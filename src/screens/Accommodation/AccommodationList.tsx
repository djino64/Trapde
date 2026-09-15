import React, { useEffect, useState } from 'react';
import AccommodationCard from './AccommodationCard';
import AccommodationFilters from './AccommodationFilters';
import Footer from '../../components/layout/Footer';
import { MdSearch, MdFilterList } from 'react-icons/md';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

interface ApiAccommodation {
  id: number;
  name: string;
  property_type: string;
  city: string;
  country: string;
  price_per_night: number | string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  has_wifi: boolean;
  has_pool: boolean;
  has_ac: boolean;
  main_photo: string | null;
  average_rating: number | string | null;
  review_count: number;
  owner_name: string;
  status: string;
  created_at: string;
}

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
  propertyType: string;
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

interface ApiListResponse {
  results?: ApiAccommodation[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

const EMPTY_FILTERS: Filters = {
  minPrice: 0,
  maxPrice: 0,
  bedrooms: 0,
  bathrooms: 0,
  maxGuests: 0,
  amenities: [],
  propertyType: '',
};

const AccommodationList: React.FC = () => {
  const { t } = useTranslation();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  /*
   * Convertit un objet retourné par Django
   * vers le format utilisé par AccommodationCard.
   */
  const mapAccommodation = (
    item: ApiAccommodation
  ): Accommodation => {
    const amenities: string[] = [];

    if (item.has_wifi) {
      amenities.push('wifi');
    }

    if (item.has_pool) {
      amenities.push('pool');
    }

    if (item.has_ac) {
      amenities.push('ac');
    }

    return {
      id: item.id,
      name: item.name,
      location: `${item.city}, ${item.country}`,
      price: Number(item.price_per_night),
      rating: Number(item.average_rating ?? 0),
      image: item.main_photo || '/images/accommodation-placeholder.jpg',
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      maxGuests: item.max_guests,
      amenities,
      isVerified: item.status === 'active',
      propertyType: item.property_type,
    };
  };

  /*
   * Chargement des logements depuis Django.
   */
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      setError('');

      const params: Record<string, string | number | boolean> = {};
      params.status = 'active';

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (filters.minPrice > 0) {
        params.min_price = filters.minPrice;
      }

      if (filters.maxPrice > 0) {
        params.max_price = filters.maxPrice;
      }

      if (filters.bedrooms > 0) {
        params.bedrooms = filters.bedrooms;
      }

      if (filters.bathrooms > 0) {
        params.bathrooms = filters.bathrooms;
      }

      if (filters.maxGuests > 0) {
        params.max_guests = filters.maxGuests;
      }

      if (filters.propertyType) {
        params.property_type = filters.propertyType;
      }

      /*
       * Amenities
       *
       * On envoie les options connues par ton backend.
       */
      if (filters.amenities.includes('wifi')) {
        params.has_wifi = true;
      }

      if (filters.amenities.includes('pool')) {
        params.has_pool = true;
      }

      if (filters.amenities.includes('ac')) {
        params.has_ac = true;
      }

      const response = await api.get<ApiAccommodation[] | ApiListResponse>(
        'accommodations/',
        {
          params,
        }
      );

      /*
       * DRF peut retourner :
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * ou avec pagination :
       *
       * {
       *   count: 10,
       *   results: [...]
       * }
       */
      const data = response.data;

      const apiResults = Array.isArray(data)
        ? data
        : data.results ?? [];

      setAccommodations(
        apiResults.map(mapAccommodation)
      );
    } catch (err: any) {
      console.error(
        'Erreur lors du chargement des accommodations:',
        err
      );

      if (err.response) {
        setError(
          err.response.data?.detail ||
          err.response.data?.error ||
          t('accommodation.errors.load')
        );
      } else if (err.request) {
        setError(
          t('accommodation.errors.server')
        );
      } else {
        setError(
          t('accommodation.errors.generic')
        );
      }

      setAccommodations([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Recherche / filtres.
   *
   * Petit délai pour éviter d'envoyer une requête
   * à chaque caractère tapé.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccommodations();
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t('accommodation.list.title')}
          </h1>

          <p className="text-sm text-gray-500">
            {loading
              ? t('accommodation.list.loading')
              : t('accommodation.list.available', { count: accommodations.length })}
          </p>
        </div>

        {/* Search and filter bar */}
        <div className="flex gap-3 mb-6">

          <div className="flex-1 relative">
            <MdSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder={t('accommodation.list.search')}
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <MdFilterList size={18} />

            <span className="text-sm">
              {t('accommodation.list.filters')}
            </span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <AccommodationFilters
              filters={filters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              onClose={() =>
                setShowFilters(false)
              }
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAccommodations}
              className="mt-2 text-sm font-medium text-red-700 underline"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

              <p className="text-gray-500 text-sm">
                {t('accommodation.list.loading')}
              </p>
            </div>
          </div>
        ) : accommodations.length === 0 ? (
          /* Empty state */
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t('accommodation.list.empty')}
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 text-blue-600 hover:underline"
            >
              {t('common.reset')}
            </button>
          </div>
        ) : (
          /* Results */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {accommodations.map(
              (accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  {...accommodation}
                />
              )
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AccommodationList;