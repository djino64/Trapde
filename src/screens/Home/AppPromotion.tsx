import React from 'react';
import { 
  MdQrCodeScanner, 
  MdStar,
  MdSecurity,
  MdPayment,
  MdSupportAgent
} from 'react-icons/md';
import { FaGooglePlay, FaAppStore } from 'react-icons/fa';

const AppPromotion: React.FC = () => {
  const features = [
    { icon: MdSecurity, text: 'Paiement sécurisé' },
    { icon: MdPayment, text: 'Meilleurs prix' },
    { icon: MdSupportAgent, text: 'Support 24/7' },
  ];

  return (
    <section 
      className="relative overflow-hidden py-16 md:py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600')`
      }}
    >

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Partie gauche : Téléphone réel */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300" 
                alt="Application TRAPDE sur smartphone"
                className="w-64 md:w-80 h-auto rounded-3xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500"
              />
              
              {/* Badge QR Code */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3 animate-bounce">
                <MdQrCodeScanner size={32} className="text-[#0000AA]" />
              </div>
              
              {/* Badge étoiles */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg px-3 py-2">
                <div className="flex items-center gap-1">
                  <MdStar size={16} className="text-yellow-400 fill-current" />
                  <MdStar size={16} className="text-yellow-400 fill-current" />
                  <MdStar size={16} className="text-yellow-400 fill-current" />
                  <MdStar size={16} className="text-yellow-400 fill-current" />
                  <MdStar size={16} className="text-yellow-400 fill-current" />
                </div>
                <p className="text-xs text-gray-600 font-medium mt-1">4.8 • 10k+ avis</p>
              </div>
            </div>
          </div>

          {/* Partie droite */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Des voyages encore plus simples avec l'application <span className="text-[#FF6600]">TRAPDE</span>
            </h2>
            
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-lg mx-auto lg:mx-0">
              Réservez, gérez et profitez de vos voyages, où que vous soyez. 
              Téléchargez l'application et bénéficiez d'offres exclusives.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-white/90">
                    <Icon size={18} />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#" className="flex items-center gap-3 bg-black/40 backdrop-blur-sm hover:bg-black/50 rounded-xl px-5 py-3 border border-white/20">
                <FaAppStore size={28} className="text-white" />
                <div className="text-left">
                  <p className="text-white/70 text-xs">Télécharger sur</p>
                  <p className="text-white font-semibold text-sm">App Store</p>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 bg-black/40 backdrop-blur-sm hover:bg-black/50 rounded-xl px-5 py-3 border border-white/20">
                <FaGooglePlay size={28} className="text-white" />
                <div className="text-left">
                  <p className="text-white/70 text-xs">Disponible sur</p>
                  <p className="text-white font-semibold text-sm">Google Play</p>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl px-5 py-3 border border-white/20">
                <MdQrCodeScanner size={24} className="text-white" />
                <div className="text-left">
                  <p className="text-white/70 text-xs">Scanner le</p>
                  <p className="text-white font-semibold text-sm">QR Code</p>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8 pt-6 border-t border-white/20">
              <div>
                <p className="text-2xl font-bold text-white">500k+</p>
                <p className="text-white/70 text-xs">Téléchargements</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">4.8</p>
                <p className="text-white/70 text-xs">Note moyenne</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-white/70 text-xs">Pays disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromotion;