import React from 'react';
import { Shield, CreditCard, Headphones, XCircle } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Meilleur prix garanti',
      description: 'Nous vous garantissons les meilleurs prix',
      color: '#0000AA'
    },
    {
      icon: CreditCard,
      title: 'Réservation sécurisée',
      description: 'Réservez en toute confiance avec TRAPDE',
      color: '#FF6600'
    },
    {
      icon: Headphones,
      title: 'Assistance 24/7',
      description: 'Nous sommes là pour vous, à tout moment',
      color: '#0000AA'
    },
    {
      icon: XCircle,
      title: 'Annulation gratuite',
      description: 'Sur la plupart des réservations',
      color: '#FF6600'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center p-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${feature.color}10` }}
              >
                <Icon size={32} style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;