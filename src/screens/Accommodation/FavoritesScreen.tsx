import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  accommodationService,
  type AccommodationFavorite,
} from '../../services/accommodationService';

const FavoritesScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [favorites, setFavorites] = useState<AccommodationFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const fetchFavorites = async () => {
      try {
        const result = await accommodationService.getFavorites();
        if (active) {
          setFavorites(result);
          setError('');
        }
      } catch (loadError: unknown) {
        console.error('Unable to load saved accommodations:', loadError);
        if (active) setError(t('favorites.loadError'));
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchFavorites();
    return () => {
      active = false;
    };
  }, [t]);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      setFavorites(await accommodationService.getFavorites());
    } catch (loadError: unknown) {
      console.error('Unable to reload saved accommodations:', loadError);
      setError(t('favorites.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: number) => {
    setPendingId(id);
    setError('');
    try {
      await accommodationService.removeFavorite(id);
      setFavorites((current) => current.filter(
        ({ accommodation }) => accommodation.id !== id
      ));
    } catch (removeError: unknown) {
      console.error('Unable to remove saved accommodation:', removeError);
      setError(t('favorites.updateError'));
    } finally {
      setPendingId(null);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat(
    i18n.resolvedLanguage || 'ht',
    { style: 'currency', currency: 'HTG', maximumFractionDigits: 0 }
  ).format(Number(price));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('favorites.title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('favorites.subtitle')}</p>

        {error && (
          <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button type="button" onClick={() => void loadFavorites()} className="mt-2 font-medium underline">
              {t('accommodations.search.retry')}
            </button>
          </div>
        )}

        {loading ? (
          <p role="status" className="py-16 text-center text-gray-500">{t('favorites.loading')}</p>
        ) : favorites.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-600">{t('favorites.empty')}</p>
            <Link to="/accommodation" className="mt-4 inline-block font-medium text-blue-700 underline">
              {t('favorites.browse')}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map(({ accommodation }) => {
              const isActive = accommodation.status === 'active';
              return (
                <article key={accommodation.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {accommodation.main_photo ? (
                    <img
                      src={accommodation.main_photo}
                      alt={accommodation.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-gray-500">
                      {t('accommodations.card.imageUnavailable')}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-gray-900">{accommodation.name}</h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {accommodation.city}, {accommodation.country}
                        </p>
                      </div>
                      {!isActive && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                          {t('favorites.unavailable')}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 font-semibold text-gray-900">
                      {formatPrice(accommodation.price_per_night)}
                      <span className="ml-1 text-xs font-normal text-gray-500">
                        {t('accommodations.card.perNight')}
                      </span>
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {isActive ? (
                        <Link to={`/accommodation/${accommodation.id}`} className="text-sm font-medium text-blue-700 underline">
                          {t('accommodations.card.viewDetails')}
                        </Link>
                      ) : <span />}
                      <button
                        type="button"
                        disabled={pendingId === accommodation.id}
                        onClick={() => void removeFavorite(accommodation.id)}
                        className="text-sm font-medium text-red-700 underline disabled:opacity-50"
                      >
                        {t('favorites.remove')}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesScreen;
