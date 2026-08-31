import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
  MdCalendarToday, MdAttachMoney, MdAdd, MdArrowForward, MdPending,
} from 'react-icons/md';
import PartnerLayout from './PartnerLayout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface Stats {
  properties: { total: number; active: number };
  bookings:   { total: number; pending: number };
  revenue:    { total: number; this_month: number 
    
  };
}

const SERVICES = [
  {
    id: 'lojman', icon: MdBed, label: 'Lojman', color: '#0000AA',
    bg: 'bg-blue-50', border: 'border-blue-200',
    desc: 'Pibliye kay, apatman, otel ou...',
    path: '/partner/lojman', addPath: '/partner/lojman/create',
  },
  {
    id: 'travay', icon: MdWork, label: 'Travay', color: '#16a34a',
    bg: 'bg-green-50', border: 'border-green-200',
    desc: 'Pibliye ofri travay ou rekroutman...',
    path: '/partner/travay', addPath: '/partner/travay/create',
  },
  {
    id: 'vwayaj', icon: MdFlight, label: 'Vwayaj', color: '#7c3aed',
    bg: 'bg-violet-50', border: 'border-violet-200',
    desc: 'Pibliye vwayaj, transpò, tou...',
    path: '/partner/vwayaj', addPath: '/partner/vwayaj/create',
  },
  {
    id: 'mache', icon: MdShoppingBag, label: 'Mache anliy', color: '#FF6600',
    bg: 'bg-orange-50', border: 'border-orange-200',
    desc: 'Vann pwodui ou sou mache anliy TRAPDE...',
    path: '/partner/mache', addPath: '/partner/mache/create',
  },
  {
    id: 'lokasyon', icon: MdCarRental, label: 'Lokasyon', color: '#0891b2',
    bg: 'bg-cyan-50', border: 'border-cyan-200',
    desc: 'Loye machin, ekipman, espas ou...',
    path: '/partner/lokasyon', addPath: '/partner/lokasyon/create',
  },
];

const PartnerDashboard: React.FC = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjou';
    if (h < 18) return 'Bonswa';
    return 'Bonswa';
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/users/partner/dashboard/');
        setStats(res.data.stats);
      } catch {
        setStats({ properties: { total: 0, active: 0 }, bookings: { total: 0, pending: 0 }, revenue: { total: 0, this_month: 0 } });
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <PartnerLayout title="Tableau de bord">

      {/* Bannè */}
      <div className="bg-gradient-to-r from-[#0A0A2E] to-[#0000AA] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-14 right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-white/60 text-sm">{getGreeting()},</p>
          <h2 className="text-2xl font-bold text-white mt-0.5">
            {user?.first_name} {user?.last_name} 👋
          </h2>
          {user?.business_name && (
            <p className="text-white/50 text-sm mt-0.5">{user.business_name}</p>
          )}
          <p className="text-white/70 text-sm mt-3">
            Chwazi yon sèvis nan sidebar pou kòmanse ajoute ofri ou yo.
          </p>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: MdBed,           label: 'Ofri aktif',     value: stats?.properties.active ?? 0,                            color: 'bg-[#0000AA]' },
          { icon: MdCalendarToday, label: 'Rezèvasyon',     value: stats?.bookings.total ?? 0,                               color: 'bg-[#FF6600]' },
          { icon: MdAttachMoney,   label: 'Revni mwa sa',   value: `HTG ${(stats?.revenue.this_month ?? 0).toLocaleString()}`, color: 'bg-green-600' },
          { icon: MdPending,       label: 'Annatant',       value: stats?.bookings.pending ?? 0,                             color: 'bg-amber-500' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon size={20} className="text-white" />
            </div>
            {isLoading
              ? <div className="h-6 w-16 bg-slate-100 rounded animate-pulse mb-1" />
              : <p className="text-xl font-bold text-slate-900">{card.value}</p>
            }
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 5 Sèvis kart */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Sèvis ou yo — Chwazi yon sèvis pou jere</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(svc => (
            <div key={svc.id}
              className={`bg-white rounded-2xl border-2 ${svc.border} p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group`}>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${svc.bg} flex items-center justify-center`}>
                  <svc.icon size={24} style={{ color: svc.color }} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{svc.label}</h4>
                  <p className="text-xs text-slate-500">{svc.desc}</p>
                </div>
              </div>

              {/* Aksyon */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => navigate(svc.addPath)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: svc.color }}>
                  <MdAdd size={16} /> Ajoute
                </button>
                <button onClick={() => navigate(svc.path)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 ${svc.border} transition-colors ${svc.bg}`}
                  style={{ color: svc.color }}>
                  Wè lis <MdArrowForward size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PartnerLayout>
  );
};

export default PartnerDashboard;