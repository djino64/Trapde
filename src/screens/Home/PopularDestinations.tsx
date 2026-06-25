import React, { useState } from 'react';
import { MdLocationOn, MdStar, MdFavorite, MdFavoriteBorder } from 'react-icons/md';

// Import des images locales
import capHaitien from '../../assets/images/cap-haitien.jpg';
import citadelle from '../../assets/images/citadelle.jpg';
import palaisSansSouci from '../../assets/images/palais-sans-souci.jpg';
import labadie from '../../assets/images/labadie.jpg';
import jacmel from '../../assets/images/jacmel.jpg';
import bassinBleu from '../../assets/images/bassin-bleu.jpg';
import ileAVache from '../../assets/images/ile-a-vache.jpg';
import portSalut from '../../assets/images/port-salut.jpg';
import sautDEau from '../../assets/images/saut-deau.jpg';
import fortJacques from '../../assets/images/fort-jacques.jpg';

// Image par défaut au cas où certaines images manquent
import defaultImage from '../../assets/images/defaults.jpg';

interface Destination {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  description: string;
}

const PopularDestinations: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const destinations: Destination[] = [
    {
      id: 1,
      name: "Cap-Haïtien",
      location: "Nord, Haïti",
      price: "4500",
      rating: 4.8,
      image: capHaitien,
      description: "La perle du Nord, proche du Palais Sans Souci et de la Citadelle Henry"
    },
    {
      id: 2,
      name: "Citadelle Henry",
      location: "Milot, Haïti",
      price: "2500",
      rating: 4.9,
      image: citadelle,
      description: "Forteresse historique, symbole de la liberté haïtienne"
    },
    {
      id: 3,
      name: "Palais Sans Souci",
      location: "Milot, Haïti",
      price: "2000",
      rating: 4.7,
      image: palaisSansSouci,
      description: "Ancienne résidence royale, chef-d'œuvre architectural"
    },
    {
      id: 4,
      name: "Labadie (Labadee)",
      location: "Nord, Haïti",
      price: "89000",
      rating: 4.9,
      image: labadie,
      description: "Plage paradisiaque et station balnéaire privée"
    },
    {
      id: 5,
      name: "Jacmel",
      location: "Sud-Est, Haïti",
      price: "55000",
      rating: 4.6,
      image: jacmel,
      description: "Ville d'art et de culture, célèbre pour son carnaval"
    },
    {
      id: 6,
      name: "Bassin Bleu",
      location: "Jacmel, Haïti",
      price: "15000",
      rating: 4.8,
      image: bassinBleu,
      description: "Cascades d'eau turquoise au cœur de la montagne"
    },
    {
      id: 7,
      name: "Île à Vache",
      location: "Sud, Haïti",
      price: "75000",
      rating: 4.9,
      image: ileAVache,
      description: "Île paradisiaque aux plages de sable blanc"
    },
    {
      id: 8,
      name: "Port-Salut",
      location: "Sud, Haïti",
      price: "6500",
      rating: 4.7,
      image: portSalut,
      description: "Station balnéaire prisée, plages magnifiques"
    },
    {
      id: 9,
      name: "Saut-d'Eau",
      location: "Centre, Haïti",
      price: "3000",
      rating: 4.5,
      image: sautDEau,
      description: "Cascade sacrée et lieu de pèlerinage"
    },
    {
      id: 10,
      name: "Fort Jacques",
      location: "Port-au-Prince, Haïti",
      price: "1800",
      rating: 4.4,
      image: fortJacques,
      description: "Forteresse historique avec vue imprenable"
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Destinations populaires en <span className="text-[#0000AA]">Haïti</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez les merveilles d'Haïti, de ses plages paradisiaques à ses monuments historiques
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6600]/10 text-[#FF6600] rounded-full text-sm">
            <MdLocationOn size={14} />
            Plages
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0000AA]/10 text-[#0000AA] rounded-full text-sm">
            <MdLocationOn size={14} />
            Historique
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF6600]/10 text-[#FF6600] rounded-full text-sm">
            <MdLocationOn size={14} />
            Nature
          </span>
        </div>
      </div>

      {/* Grille des destinations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {destinations.map((dest) => (
          <div 
            key={dest.id} 
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={dest.image} 
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }}
              />
              {/* Badge prix */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
                <p className="text-[#0000AA] font-bold text-sm">HTG {dest.price} <span className="text-gray-500 text-xs">/ nuit</span></p>
              </div>
              {/* Bouton favori */}
              <button 
                onClick={() => toggleFavorite(dest.id)}
                className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition"
              >
                {favorites.includes(dest.id) ? (
                  <MdFavorite size={18} className="text-red-500 fill-current" />
                ) : (
                  <MdFavoriteBorder size={18} className="text-gray-500" />
                )}
              </button>
            </div>

            {/* Contenu */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#0000AA] transition">
                  {dest.name}
                </h3>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                  <MdStar size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">{dest.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <MdLocationOn size={14} className="text-[#FF6600]" />
                <span>{dest.location}</span>
              </div>
              
              <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                {dest.description}
              </p>
              
              {/* Bouton réserver - Version simplifiée SANS gradient */}
              <button className="w-full mt-2 bg-[#0000AA] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#000088] transition opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Voir les disponibilités
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton voir plus */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0000AA] text-[#0000AA] font-semibold rounded-full hover:bg-[#0000AA] hover:text-white transition-all duration-300">
          Découvrir toutes les destinations
          <MdLocationOn size={18} />
        </button>
      </div>

      {/* Section call-to-action Haïti */}
      <div className="mt-16 bg-gradient-to-r from-[#0000AA]/10 to-[#FF6600]/10 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Prêt à découvrir <span className="text-[#FF6600]">Haïti</span> ?
        </h3>
        <p className="text-gray-600 mb-4">
          Des plages de rêve aux montagnes majestueuses, Haïti vous attend
        </p>
        <button className="bg-[#FF6600] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#E55A00] transition">
          Planifier mon voyage
        </button>
      </div>
    </section>
  );
};

export default PopularDestinations;