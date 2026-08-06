import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdPeople, MdPerson, MdCampaign, MdCalendarToday,
  MdPayment, MdAttachMoney, MdTrendingUp, MdTrendingDown,
  MdStar, MdMessage, MdNotifications, MdWarning,
  MdNewReleases, MdArrowForward, MdRefresh, MdCheckCircle,
  MdPending, MdCancel, MdBarChart, MdPieChart,
  MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
  MdPersonAdd, MdFactCheck, MdBlock, MdVerified,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface DashboardData {
  stats: {
    total_partners:      number;
    total_users:         number;
    total_listings:      number;
    total_bookings:      number;
    payments_done:       number;
    payments_pending:    number;
    total_revenue:       number;
    total_commission:    number;
    new_partners:        number;
    new_users:           number;
    new_listings:        number;
    reports:             number;
    unread_messages:     number;
    unread_notifications:number;
  };
  bookings_by_status: {
    pending:   number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  services: {
    lojman:   number;
    travay:   number;
    vwayaj:   number;
    mache:    number;
    lokasyon: number;
  };
  monthly_revenue:  number[];
  recent_signups:   any[];
  recent_payments:  any[];
  recent_bookings:  any[];
  recent_reports:   any[];
  recent_activity:  any[];
}

const MONTHS = ['Jan','Feb','Mar','Avr','Me','Jen','Jul','Out','Sep','Okt','Nov','Des'];

const AdminDashboard: React.FC = () => {
  const navigate   = useNavigate();
  const [data, setData]         = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/admin/dashboard/');
      setData(res.data);
    } catch {
      // Moke done pou devlopman
      setData({
        stats: {
          total_partners: 0, total_users: 0, total_listings: 0,
          total_bookings: 0, payments_done: 0, payments_pending: 0,
          total_revenue: 0, total_commission: 0,
          new_partners: 0, new_users: 0, new_listings: 0,
          reports: 0, unread_messages: 0, unread_notifications: 0,
        },
        bookings_by_status: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
        services: { lojman: 0, travay: 0, vwayaj: 0, mache: 0, lokasyon: 0 },
        monthly_revenue: Array(12).fill(0),
        recent_signups: [], recent_payments: [],
        recent_bookings: [], recent_reports: [], recent_activity: [],
      });
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const s = data?.stats;

  // Kart prensipal yo
  const mainCards = [
    { icon: MdPeople,       label: 'Total Patnè',       value: s?.total_partners ?? 0,      sub: `+${s?.new_partners ?? 0} nouvo`,        color: 'from-[#0000AA] to-blue-600',   path: '/admin/partners'   },
    { icon: MdPerson,       label: 'Total Itilizatè',   value: s?.total_users ?? 0,         sub: `+${s?.new_users ?? 0} nouvo`,           color: 'from-purple-600 to-purple-800', path: '/admin/users'      },
    { icon: MdCampaign,     label: 'Total Anonskman',   value: s?.total_listings ?? 0,      sub: `+${s?.new_listings ?? 0} nouvo`,        color: 'from-[#FF6600] to-orange-700', path: '/admin/listings'   },
    { icon: MdCalendarToday,label: 'Total Rezèvasyon',  value: s?.total_bookings ?? 0,      sub: `${data?.bookings_by_status.pending ?? 0} annatant`, color: 'from-teal-500 to-teal-700', path: '/admin/bookings' },
    { icon: MdPayment,      label: 'Peman fèt',         value: s?.payments_done ?? 0,       sub: `${s?.payments_pending ?? 0} annatant`,  color: 'from-green-500 to-green-700',  path: '/admin/payments'   },
    { icon: MdAttachMoney,  label: 'Revni Total',       value: `HTG ${(s?.total_revenue ?? 0).toLocaleString()}`,    sub: 'Anvan komisyon', color: 'from-yellow-500 to-yellow-700', path: '/admin/revenue' },
    { icon: MdBarChart,     label: 'Komisyon TRAPDE',   value: `HTG ${(s?.total_commission ?? 0).toLocaleString()}`, sub: '10% sou chak transaksyon', color: 'from-pink-500 to-pink-700', path: '/admin/revenue' },
    { icon: MdWarning,      label: 'Signalman',         value: s?.reports ?? 0,             sub: 'Pou revize',                            color: 'from-red-500 to-red-700',      path: '/admin/reviews'    },
  ];

  // Kart sekondè yo
  const secondaryCards = [
    { icon: MdMessage,       label: 'Mesaj pa li',      value: s?.unread_messages ?? 0,      color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',   path: '/admin/messages'      },
    { icon: MdNotifications, label: 'Notif pa li',      value: s?.unread_notifications ?? 0, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', path: '/admin/notifications' },
    { icon: MdFactCheck,     label: 'Annatant valid.',  value: 0,                             color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',  path: '/admin/validation'    },
    { icon: MdNewReleases,   label: 'Nouvo patnè',      value: s?.new_partners ?? 0,          color: 'text-green-600',  bg: 'bg-green-50 border-green-200',  path: '/admin/partners'      },
  ];

  const services = [
    { id: 'lojman',  icon: MdBed,          label: 'Lojman',     count: data?.services.lojman ?? 0,   color: '#0000AA' },
    { id: 'travay',  icon: MdWork,         label: 'Travay',     count: data?.services.travay ?? 0,   color: '#16a34a' },
    { id: 'vwayaj',  icon: MdFlight,       label: 'Vwayaj',     count: data?.services.vwayaj ?? 0,   color: '#7c3aed' },
    { id: 'mache',   icon: MdShoppingBag,  label: 'Mache',      count: data?.services.mache ?? 0,    color: '#FF6600' },
    { id: 'lokasyon',icon: MdCarRental,    label: 'Lokasyon',   count: data?.services.lokasyon ?? 0, color: '#0891b2' },
  ];

  const bookingStatus = [
    { label: 'Annatant',  icon: MdPending,     color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', value: data?.bookings_by_status.pending   ?? 0 },
    { label: 'Konfime',   icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200', value: data?.bookings_by_status.confirmed ?? 0 },
    { label: 'Konplete',  icon: MdVerified,    color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200',   value: data?.bookings_by_status.completed ?? 0 },
    { label: 'Anile',     icon: MdCancel,      color: 'text-red-600',   bg: 'bg-red-50 border-red-200',     value: data?.bookings_by_status.cancelled ?? 0 },
  ];

  const maxRevenue = Math.max(...(data?.monthly_revenue ?? [1]), 1);
  const currentMonth = new Date().getMonth();

  return (
    <AdminLayout title="Vue d'ensemble — Dashboard Admin">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Dènye mete ajou: <span className="font-medium">{lastUpdated.toLocaleTimeString('fr-FR')}</span>
          </p>
        </div>
        <button onClick={fetchData} disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
          <MdRefresh size={16} className={isLoading ? 'animate-spin' : ''} /> Aktyalize
        </button>
      </div>

      {/* ── Kart prensipal (8 kart) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mainCards.map((card, i) => (
          <div key={i} onClick={() => navigate(card.path)}
            className="rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-gradient-to-br text-white shadow-lg"
            style={{ backgroundImage: `linear-gradient(135deg, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <card.icon size={20} className="text-white" />
              </div>
              <MdArrowForward size={16} className="text-white/60" />
            </div>
            {isLoading
              ? <div className="h-7 w-20 bg-white/30 rounded-lg animate-pulse mb-1" />
              : <p className="text-2xl font-bold">{card.value}</p>
            }
            <p className="text-xs font-semibold text-white/80 mt-0.5">{card.label}</p>
            <p className="text-xs text-white/50 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Kart sekondè (4 kart) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {secondaryCards.map((card, i) => (
          <div key={i} onClick={() => navigate(card.path)}
            className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 ${card.bg}`}>
            <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <card.icon size={20} className={card.color} />
            </div>
            <div>
              {isLoading
                ? <div className="h-6 w-12 bg-slate-200 rounded animate-pulse mb-0.5" />
                : <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              }
              <p className="text-xs text-slate-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grafik Revni + Sèvis + Statè ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        {/* Grafik revni pa mwa */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Revni pa mwa</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ane {new Date().getFullYear()}</p>
            </div>
            <Link to="/admin/revenue"
              className="text-xs font-semibold text-[#FF6600] hover:underline flex items-center gap-1">
              Detay <MdArrowForward size={13} />
            </Link>
          </div>
          <div className="p-5">
            {/* Grafik baton */}
            <div className="flex items-end gap-1.5 h-36 mb-2">
              {(data?.monthly_revenue ?? Array(12).fill(0)).map((val, i) => {
                const h        = maxRevenue > 0 ? (val / maxRevenue) * 100 : 0;
                const isCur    = i === currentMonth;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <div className="relative w-full flex items-end justify-center" style={{ height: '120px' }}>
                      <div className={`w-full rounded-t-lg transition-all cursor-pointer ${
                        isCur ? 'bg-[#FF6600]' : 'bg-[#0000AA]/20 group-hover:bg-[#0000AA]/50'
                      }`}
                        style={{ height: `${Math.max(h, 3)}%` }} />
                      {val > 0 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          HTG {val.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <p className={`text-[9px] ${isCur ? 'text-[#FF6600] font-bold' : 'text-slate-400'}`}>
                      {MONTHS[i]}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* Lejann */}
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF6600]" /> Mwa koure</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#0000AA]/20" /> Lòt mwa yo</span>
            </div>
          </div>
        </div>

        {/* Sèvis + Statè rezèvasyon */}
        <div className="space-y-4">

          {/* 5 sèvis */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Sèvis yo</h3>
            </div>
            <div className="p-3 space-y-1.5">
              {services.map(svc => (
                <div key={svc.id} onClick={() => navigate(`/admin/services/${svc.id}`)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: svc.color + '15' }}>
                    <svc.icon size={16} style={{ color: svc.color }} />
                  </div>
                  <span className="text-sm text-slate-700 flex-1 group-hover:text-slate-900 font-medium">{svc.label}</span>
                  <span className="text-sm font-bold text-slate-900">{svc.count}</span>
                  <MdArrowForward size={14} className="text-slate-300 group-hover:text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Statè rezèvasyon */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Statè Rezèvasyon</h3>
            </div>
            <div className="p-3 space-y-2">
              {bookingStatus.map((bs, i) => {
                const Icon = bs.icon;
                return (
                  <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${bs.bg}`}>
                    <Icon size={16} className={bs.color} />
                    <span className={`text-xs font-semibold flex-1 ${bs.color}`}>{bs.label}</span>
                    <span className={`text-base font-bold ${bs.color}`}>{bs.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Aktivite resan (4 blok) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* Dènye enskripsyon */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Dènye Enskripsyon</h3>
            <Link to="/admin/users" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
          </div>
          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-5 py-3.5 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5"><div className="h-3 bg-slate-200 rounded w-1/2" /><div className="h-2.5 bg-slate-200 rounded w-1/3" /></div>
                </div>
              ))}
            </div>
          ) : data?.recent_signups.length === 0 ? (
            <div className="text-center py-10"><MdPersonAdd size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen enskripsyon ankò.</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data?.recent_signups.map((u: any, i: number) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#0000AA]/10 flex items-center justify-center text-[#0000AA] text-xs font-bold flex-shrink-0">
                    {u.full_name?.[0] ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.full_name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    u.role === 'partner' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                  }`}>{u.role === 'partner' ? 'Patnè' : 'Itilizatè'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dènye peman */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Dènye Peman</h3>
            <Link to="/admin/payments" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
          </div>
          {data?.recent_payments.length === 0 ? (
            <div className="text-center py-10"><MdPayment size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen peman ankò.</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data?.recent_payments.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <MdAttachMoney size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{p.guest_name}</p>
                    <p className="text-xs text-slate-400">{p.accommodation_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">HTG {p.total_price?.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dènye rezèvasyon */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Dènye Rezèvasyon</h3>
            <Link to="/admin/bookings" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
          </div>
          {data?.recent_bookings.length === 0 ? (
            <div className="text-center py-10"><MdCalendarToday size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen rezèvasyon ankò.</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data?.recent_bookings.map((b: any, i: number) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MdCalendarToday size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{b.guest_name}</p>
                    <p className="text-xs text-slate-400">{b.accommodation_name} · {b.check_in} → {b.check_out}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    b.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200'
                    : b.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {b.status === 'confirmed' ? 'Konfime' : b.status === 'pending' ? 'Annatant' : 'Anile'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dènye signalman */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Dènye Signalman</h3>
            <Link to="/admin/reviews" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
          </div>
          {data?.recent_reports.length === 0 ? (
            <div className="text-center py-10"><MdWarning size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen signalman ankò.</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data?.recent_reports.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MdWarning size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.title || 'Signalman'}</p>
                    <p className="text-xs text-slate-400">{r.reporter || 'Anònim'} · {r.type || 'Jeneral'}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                    Nouvo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Aksyon rapid admin ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Aksyon Rapid Admin</h3>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: MdPeople,       label: 'Patnè yo',         path: '/admin/partners',    color: '#0000AA' },
            { icon: MdFactCheck,    label: 'Validasyon',        path: '/admin/validation',  color: '#16a34a' },
            { icon: MdPayment,      label: 'Peman yo',          path: '/admin/payments',    color: '#FF6600' },
            { icon: MdBarChart,     label: 'Estatistik',        path: '/admin/statistics',  color: '#7c3aed' },
            { icon: MdWarning,      label: 'Signalman',         path: '/admin/reviews',     color: '#dc2626' },
            { icon: MdPieChart,     label: 'Rapò',              path: '/admin/reports',     color: '#0891b2' },
          ].map((action, i) => (
            <button key={i} onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: action.color + '15' }}>
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center group-hover:text-slate-800">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;