import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import PartnerLayout from '../PartnerLayout';
import {
  MdEdit, MdDelete, MdAdd, MdHotel, MdLocationOn,
  MdBed, MdBathroom, MdAttachMoney, MdStar,
} from 'react-icons/md';
import api from '../../../services/api';

interface Accommodation {
  id: number;
  propertyName: string;
  address: string;
  city: string;
  country: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  rating?: number;
  image?: string;
}

const AccommodationListScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'partner') {
      navigate('/login');
      return;
    }
    fetchAccommodations();
  }, [user, navigate]);

  const fetchAccommodations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/accommodations/partner/');
      setAccommodations(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des logements:', error);
      setAccommodations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/partner/lojman/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/api/accommodations/${id}/`);
      setAccommodations(accommodations.filter(acc => acc.id !== id));
      alert('Logement supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du logement');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PartnerLayout title="Mes logements" activeService="lojman">
      <div className="space-y-6">
        {/* En-tête avec bouton Ajouter */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mes logements</h1>
            <p className="text-sm text-slate-500 mt-1">
              Gérez vos propriétés - {accommodations.length} logement{accommodations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/partner/lojman/create')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0000AA] text-white rounded-xl font-semibold hover:bg-[#000088] transition-colors"
          >
            <MdAdd size={20} />
            Ajouter un logement
          </button>
        </div>

        {/* Liste des logements */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : accommodations.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <MdHotel size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun logement trouvé</h3>
            <p className="text-sm text-slate-500 mb-6">
              Vous n'avez pas encore ajouté de logement. Commencez dès maintenant !
            </p>
            <button
              onClick={() => navigate('/partner/lojman/create')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0000AA] text-white rounded-xl font-semibold hover:bg-[#000088] transition-colors"
            >
              <MdAdd size={18} />
              Ajouter votre premier logement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accommodations.map((accommodation) => (
              <div
                key={accommodation.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                  {accommodation.image ? (
                    <img
                      src={accommodation.image}
                      alt={accommodation.propertyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MdHotel size={48} className="text-slate-300" />
                  )}
                  
                  {/* Badge de tarif */}
                  <div className="absolute top-3 right-3 bg-[#FF6600] text-white px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                    <MdAttachMoney size={14} />
                    {accommodation.pricePerNight.toLocaleString('fr-HT')} HTG
                  </div>

                  {/* Badge de note */}
                  {accommodation.rating && (
                    <div className="absolute top-3 left-3 bg-white text-slate-900 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md">
                      <MdStar size={14} className="text-[#FFB800]" />
                      {accommodation.rating}
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  {/* Nom */}
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2">
                    {accommodation.propertyName}
                  </h3>

                  {/* Localisation */}
                  <div className="flex items-start gap-2 text-sm text-slate-600 mb-3">
                    <MdLocationOn size={16} className="flex-shrink-0 mt-0.5 text-slate-400" />
                    <div className="flex-1 line-clamp-1">
                      {accommodation.address}, {accommodation.city}
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <MdBed size={14} className="text-slate-400" />
                      <span>{accommodation.bedrooms} chambre{accommodation.bedrooms > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdBathroom size={14} className="text-slate-400" />
                      <span>{accommodation.bathrooms} SDB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdHotel size={14} className="text-slate-400" />
                      <span>{accommodation.maxGuests} hôtes</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(accommodation.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-50 text-[#0000AA] border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-semibold"
                    >
                      <MdEdit size={16} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(accommodation.id)}
                      disabled={deletingId === accommodation.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdDelete size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PartnerLayout>
  );
};

export default AccommodationListScreen;
