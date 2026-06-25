import React, { useState } from 'react';
import { 
  MdSearch, 
  MdLocationOn, 
  MdCalendarToday, 
  MdPeople,
  MdBed,
  MdLocalActivity,
  MdDirectionsCar,
  MdShoppingBag,
  MdWork
} from 'react-icons/md';

const HeroSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'stays' | 'flights' | 'activities' | 'cars' | 'marketplace' | 'jobs'>('stays');

  const categories = [
    { id: 'stays' as const, label: 'Hébergements', icon: MdBed },
    { id: 'activities' as const, label: 'Activités', icon: MdLocalActivity },
    { id: 'cars' as const, label: 'Voitures', icon: MdDirectionsCar },
    { id: 'marketplace' as const, label: 'Marketplace', icon: MdShoppingBag },
    { id: 'jobs' as const, label: 'Jobs', icon: MdWork },
  ];

  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center px-4 py-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600')`
      }}
    >
      {/* Overlay sombre pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Décoration supplémentaire (optionnelle) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0000AA]/30 to-[#FF6600]/30" />

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
        {/* Titre principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Le monde vous attend,<br />
          <span className="text-[#FF6600]">TRAPDE</span> s'occupe du reste.
        </h1>
        <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Réservez des hébergements, vols, voitures, activités, achetez sur notre marketplace ou trouvez un emploi.
        </p>

        {/* Carte de recherche */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
          {/* Onglets de catégorie - Tous les onglets du navbar */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-gray-100 pb-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0000AA] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Champs de recherche dynamiques */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Recherche', activeCategory);
            }}
            className="flex flex-col md:flex-row gap-3"
          >
            {/* Hébergements */}
            {activeCategory === 'stays' && (
              <>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdLocationOn className="text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Destination, établissement ou lieu"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdCalendarToday className="text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Arrivée - Départ"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdPeople className="text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="2 adultes · 0 enfant · 1 chambre"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </>
            )}

            {/* Activités */}
            {activeCategory === 'activities' && (
              <>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdLocationOn className="text-gray-400" size={20} />
                  <input type="text" placeholder="Où voulez-vous aller ?" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdCalendarToday className="text-gray-400" size={20} />
                  <input type="text" placeholder="Date" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdPeople className="text-gray-400" size={20} />
                  <input type="text" placeholder="Nombre de personnes" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              </>
            )}

            {/* Voitures */}
            {activeCategory === 'cars' && (
              <>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdLocationOn className="text-gray-400" size={20} />
                  <input type="text" placeholder="Lieu de prise en charge" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdLocationOn className="text-gray-400" size={20} />
                  <input type="text" placeholder="Lieu de retour" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdCalendarToday className="text-gray-400" size={20} />
                  <input type="text" placeholder="Date et heure" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              </>
            )}

            {/* Marketplace */}
            {activeCategory === 'marketplace' && (
              <>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdSearch className="text-gray-400" size={20} />
                  <input type="text" placeholder="Rechercher un produit..." className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdLocationOn className="text-gray-400" size={20} />
                  <input type="text" placeholder="Catégorie" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              </>
            )}

            {/* Jobs */}
            {activeCategory === 'jobs' && (
              <>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdSearch className="text-gray-400" size={20} />
                  <input type="text" placeholder="Titre du poste, mot-clé" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#0000AA] transition">
                  <MdLocationOn className="text-gray-400" size={20} />
                  <input type="text" placeholder="Ville, région" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-[#FF6600] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#E55A00] transition flex items-center justify-center gap-2 shadow-md"
            >
              <MdSearch size={20} />
              Rechercher
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;