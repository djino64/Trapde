/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   MdPeople, MdPerson, MdCampaign, MdCalendarToday,
//   MdPayment, MdAttachMoney, MdTrendingUp, MdTrendingDown,
//   MdStar, MdMessage, MdNotifications, MdWarning,
//   MdNewReleases, MdArrowForward, MdRefresh, MdCheckCircle,
//   MdPending, MdCancel, MdBarChart, MdPieChart,
//   MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
//   MdPersonAdd, MdFactCheck, MdBlock, MdVerified,
// } from 'react-icons/md';
// import AdminLayout from './AdminLayout';
// import api from '../../services/api';

// interface DashboardData {
//   stats: {
//     total_partners:      number;
//     total_users:         number;
//     total_listings:      number;
//     total_bookings:      number;
//     payments_done:       number;
//     payments_pending:    number;
//     total_revenue:       number;
//     total_commission:    number;
//     new_partners:        number;
//     new_users:           number;
//     new_listings:        number;
//     reports:             number;
//     unread_messages:     number;
//     unread_notifications:number;
//   };
//   bookings_by_status: {
//     pending:   number;
//     confirmed: number;
//     completed: number;
//     cancelled: number;
//   };
//   services: {
//     lojman:   number;
//     travay:   number;
//     vwayaj:   number;
//     mache:    number;
//     lokasyon: number;
//   };
//   monthly_revenue:  number[];
//   recent_signups:   any[];
//   recent_payments:  any[];
//   recent_bookings:  any[];
//   recent_reports:   any[];
//   recent_activity:  any[];
// }

// const MONTHS = ['Jan','Feb','Mar','Avr','Me','Jen','Jul','Out','Sep','Okt','Nov','Des'];

// const AdminDashboard: React.FC = () => {
//   const navigate   = useNavigate();
//   const [data, setData]         = useState<DashboardData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState(new Date());

//   const fetchData = useCallback(async () => {
//   setIsLoading(true);

//   try {
//     const res = await api.get('/api/admin/dashboard/');
//     console.log('ADMIN DASHBOARD:', res.data);
//     setData(res.data);
//   } catch (error) {
//     console.error(
//       'Erreur chargement dashboard admin:',
//       error
//     );

//     setData(null);
//   } finally {
//     setIsLoading(false);
//     setLastUpdated(new Date());
//   }
// }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const s = data?.stats;

//   // Kart prensipal yo
//   const mainCards = [
//     { icon: MdPeople,       label: 'Total Patnè',       value: s?.total_partners ?? 0,      sub: `+${s?.new_partners ?? 0} nouvo`,        color: 'from-[#0000AA] to-blue-600',   path: '/admin/partners'   },
//     { icon: MdPerson,       label: 'Total Itilizatè',   value: s?.total_users ?? 0,         sub: `+${s?.new_users ?? 0} nouvo`,           color: 'from-purple-600 to-purple-800', path: '/admin/users'      },
//     { icon: MdCampaign,     label: 'Total Anonskman',   value: s?.total_listings ?? 0,      sub: `+${s?.new_listings ?? 0} nouvo`,        color: 'from-[#FF6600] to-orange-700', path: '/admin/listings'   },
//     { icon: MdCalendarToday,label: 'Total Rezèvasyon',  value: s?.total_bookings ?? 0,      sub: `${data?.bookings_by_status.pending ?? 0} annatant`, color: 'from-teal-500 to-teal-700', path: '/admin/bookings' },
//     { icon: MdPayment,      label: 'Peman fèt',         value: s?.payments_done ?? 0,       sub: `${s?.payments_pending ?? 0} annatant`,  color: 'from-green-500 to-green-700',  path: '/admin/payments'   },
//     { icon: MdAttachMoney,  label: 'Revni Total',       value: `HTG ${(s?.total_revenue ?? 0).toLocaleString()}`,    sub: 'Anvan komisyon', color: 'from-yellow-500 to-yellow-700', path: '/admin/revenue' },
//     { icon: MdBarChart,     label: 'Komisyon TRAPDE',   value: `HTG ${(s?.total_commission ?? 0).toLocaleString()}`, sub: '10% sou chak transaksyon', color: 'from-pink-500 to-pink-700', path: '/admin/revenue' },
//     { icon: MdWarning,      label: 'Signalman',         value: s?.reports ?? 0,             sub: 'Pou revize',                            color: 'from-red-500 to-red-700',      path: '/admin/reviews'    },
//   ];

//   // Kart sekondè yo
//   const secondaryCards = [
//     { icon: MdMessage,       label: 'Mesaj pa li',      value: s?.unread_messages ?? 0,      color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',   path: '/admin/messages'      },
//     { icon: MdNotifications, label: 'Notif pa li',      value: s?.unread_notifications ?? 0, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', path: '/admin/notifications' },
//     { icon: MdFactCheck,     label: 'Annatant valid.',  value: 0,                             color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200',  path: '/admin/validation'    },
//     { icon: MdNewReleases,   label: 'Nouvo patnè',      value: s?.new_partners ?? 0,          color: 'text-green-600',  bg: 'bg-green-50 border-green-200',  path: '/admin/partners'      },
//   ];

// const services = [
//   {
//     id: 'lojman',
//     icon: MdBed,
//     label: 'Lojman',
//     count: data?.services?.lojman ?? 0,
//     color: '#0000AA',
//   },
//   {
//     id: 'travay',
//     icon: MdWork,
//     label: 'Travay',
//     count: data?.services?.travay ?? 0,
//     color: '#16a34a',
//   },
//   {
//     id: 'vwayaj',
//     icon: MdFlight,
//     label: 'Vwayaj',
//     count: data?.services?.vwayaj ?? 0,
//     color: '#7c3aed',
//   },
//   {
//     id: 'mache',
//     icon: MdShoppingBag,
//     label: 'Mache',
//     count: data?.services?.mache ?? 0,
//     color: '#FF6600',
//   },
//   {
//     id: 'lokasyon',
//     icon: MdCarRental,
//     label: 'Lokasyon',
//     count: data?.services?.lokasyon ?? 0,
//     color: '#0891b2',
//   },
// ];
//   const bookingStatus = [
//     { label: 'Annatant',  icon: MdPending,     color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', value: data?.bookings_by_status.pending   ?? 0 },
//     { label: 'Konfime',   icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200', value: data?.bookings_by_status.confirmed ?? 0 },
//     { label: 'Konplete',  icon: MdVerified,    color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200',   value: data?.bookings_by_status.completed ?? 0 },
//     { label: 'Anile',     icon: MdCancel,      color: 'text-red-600',   bg: 'bg-red-50 border-red-200',     value: data?.bookings_by_status.cancelled ?? 0 },
//   ];

//   const maxRevenue = Math.max(...(data?.monthly_revenue ?? [1]), 1);
//   const currentMonth = new Date().getMonth();

//   return (
//     <AdminLayout title="Vue d'ensemble — Dashboard Admin">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
//         <div>
//           <p className="text-sm text-slate-500">
//             Dènye mete ajou: <span className="font-medium">{lastUpdated.toLocaleTimeString('fr-FR')}</span>
//           </p>
//         </div>
//         <button onClick={fetchData} disabled={isLoading}
//           className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
//           <MdRefresh size={16} className={isLoading ? 'animate-spin' : ''} /> Aktyalize
//         </button>
//       </div>

//       {/* ── Kart prensipal (8 kart) ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {mainCards.map((card, i) => (
//           <div key={i} onClick={() => navigate(card.path)}
//             className="rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-gradient-to-br text-white shadow-lg"
//             style={{ backgroundImage: `linear-gradient(135deg, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})` }}
//           >
//             <div className="flex items-center justify-between mb-3">
//               <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
//                 <card.icon size={20} className="text-white" />
//               </div>
//               <MdArrowForward size={16} className="text-white/60" />
//             </div>
//             {isLoading
//               ? <div className="h-7 w-20 bg-white/30 rounded-lg animate-pulse mb-1" />
//               : <p className="text-2xl font-bold">{card.value}</p>
//             }
//             <p className="text-xs font-semibold text-white/80 mt-0.5">{card.label}</p>
//             <p className="text-xs text-white/50 mt-0.5">{card.sub}</p>
//           </div>
//         ))}
//       </div>

//       {/* ── Kart sekondè (4 kart) ── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {secondaryCards.map((card, i) => (
//           <div key={i} onClick={() => navigate(card.path)}
//             className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 ${card.bg}`}>
//             <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
//               <card.icon size={20} className={card.color} />
//             </div>
//             <div>
//               {isLoading
//                 ? <div className="h-6 w-12 bg-slate-200 rounded animate-pulse mb-0.5" />
//                 : <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
//               }
//               <p className="text-xs text-slate-500">{card.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Grafik Revni + Sèvis + Statè ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

//         {/* Grafik revni pa mwa */}
//         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//             <div>
//               <h3 className="text-sm font-bold text-slate-800">Revni pa mwa</h3>
//               <p className="text-xs text-slate-400 mt-0.5">Ane {new Date().getFullYear()}</p>
//             </div>
//             <Link to="/admin/revenue"
//               className="text-xs font-semibold text-[#FF6600] hover:underline flex items-center gap-1">
//               Detay <MdArrowForward size={13} />
//             </Link>
//           </div>
//           <div className="p-5">
//             {/* Grafik baton */}
//             <div className="flex items-end gap-1.5 h-36 mb-2">
//               {(data?.monthly_revenue ?? Array(12).fill(0)).map((val, i) => {
//                 const h        = maxRevenue > 0 ? (val / maxRevenue) * 100 : 0;
//                 const isCur    = i === currentMonth;
//                 return (
//                   <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
//                     <div className="relative w-full flex items-end justify-center" style={{ height: '120px' }}>
//                       <div className={`w-full rounded-t-lg transition-all cursor-pointer ${
//                         isCur ? 'bg-[#FF6600]' : 'bg-[#0000AA]/20 group-hover:bg-[#0000AA]/50'
//                       }`}
//                         style={{ height: `${Math.max(h, 3)}%` }} />
//                       {val > 0 && (
//                         <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
//                           HTG {val.toLocaleString()}
//                         </div>
//                       )}
//                     </div>
//                     <p className={`text-[9px] ${isCur ? 'text-[#FF6600] font-bold' : 'text-slate-400'}`}>
//                       {MONTHS[i]}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//             {/* Lejann */}
//             <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
//               <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF6600]" /> Mwa koure</span>
//               <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#0000AA]/20" /> Lòt mwa yo</span>
//             </div>
//           </div>
//         </div>

//         {/* Sèvis + Statè rezèvasyon */}
//         <div className="space-y-4">

//           {/* 5 sèvis */}
//           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//             <div className="px-4 py-3 border-b border-slate-100">
//               <h3 className="text-sm font-bold text-slate-800">Sèvis yo</h3>
//             </div>
//             <div className="p-3 space-y-1.5">
//               {services.map(svc => (
//                 <div key={svc.id} onClick={() => navigate(`/admin/services/${svc.id}`)}
//                   className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors group">
//                   <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
//                     style={{ backgroundColor: svc.color + '15' }}>
//                     <svc.icon size={16} style={{ color: svc.color }} />
//                   </div>
//                   <span className="text-sm text-slate-700 flex-1 group-hover:text-slate-900 font-medium">{svc.label}</span>
//                   <span className="text-sm font-bold text-slate-900">{svc.count}</span>
//                   <MdArrowForward size={14} className="text-slate-300 group-hover:text-slate-500" />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Statè rezèvasyon */}
//           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//             <div className="px-4 py-3 border-b border-slate-100">
//               <h3 className="text-sm font-bold text-slate-800">Statè Rezèvasyon</h3>
//             </div>
//             <div className="p-3 space-y-2">
//               {bookingStatus.map((bs, i) => {
//                 const Icon = bs.icon;
//                 return (
//                   <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${bs.bg}`}>
//                     <Icon size={16} className={bs.color} />
//                     <span className={`text-xs font-semibold flex-1 ${bs.color}`}>{bs.label}</span>
//                     <span className={`text-base font-bold ${bs.color}`}>{bs.value}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Aktivite resan (4 blok) ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

//         {/* Dènye enskripsyon */}
//         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//             <h3 className="text-sm font-bold text-slate-800">Dènye Enskripsyon</h3>
//             <Link to="/admin/users" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
//           </div>
//           {isLoading ? (
//             <div className="divide-y divide-slate-100">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="flex gap-3 px-5 py-3.5 animate-pulse">
//                   <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
//                   <div className="flex-1 space-y-1.5"><div className="h-3 bg-slate-200 rounded w-1/2" /><div className="h-2.5 bg-slate-200 rounded w-1/3" /></div>
//                 </div>
//               ))}
//             </div>
//           ) : data?.recent_signups.length === 0 ? (
//             <div className="text-center py-10"><MdPersonAdd size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen enskripsyon ankò.</p></div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {data?.recent_signups.map((u: any, i: number) => (
//                 <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
//                   <div className="w-9 h-9 rounded-full bg-[#0000AA]/10 flex items-center justify-center text-[#0000AA] text-xs font-bold flex-shrink-0">
//                     {u.full_name?.[0] ?? '?'}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-slate-800 truncate">{u.full_name}</p>
//                     <p className="text-xs text-slate-400">{u.email}</p>
//                   </div>
//                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//                     u.role === 'partner' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
//                   }`}>{u.role === 'partner' ? 'Patnè' : 'Itilizatè'}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Dènye peman */}
//         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//             <h3 className="text-sm font-bold text-slate-800">Dènye Peman</h3>
//             <Link to="/admin/payments" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
//           </div>
//           {data?.recent_payments.length === 0 ? (
//             <div className="text-center py-10"><MdPayment size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen peman ankò.</p></div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {data?.recent_payments.map((p: any, i: number) => (
//                 <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
//                   <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
//                     <MdAttachMoney size={18} className="text-green-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-slate-800">{p.guest_name}</p>
//                     <p className="text-xs text-slate-400">{p.accommodation_name}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-bold text-green-700">HTG {p.total_price?.toLocaleString()}</p>
//                     <p className="text-xs text-slate-400">{p.status}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Dènye rezèvasyon */}
//         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//             <h3 className="text-sm font-bold text-slate-800">Dènye Rezèvasyon</h3>
//             <Link to="/admin/bookings" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
//           </div>
//           {data?.recent_bookings.length === 0 ? (
//             <div className="text-center py-10"><MdCalendarToday size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen rezèvasyon ankò.</p></div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {data?.recent_bookings.map((b: any, i: number) => (
//                 <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
//                   <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
//                     <MdCalendarToday size={16} className="text-blue-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-slate-800 truncate">{b.guest_name}</p>
//                     <p className="text-xs text-slate-400">{b.accommodation_name} · {b.check_in} → {b.check_out}</p>
//                   </div>
//                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
//                     b.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200'
//                     : b.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200'
//                     : 'bg-red-50 text-red-700 border-red-200'
//                   }`}>
//                     {b.status === 'confirmed' ? 'Konfime' : b.status === 'pending' ? 'Annatant' : 'Anile'}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Dènye signalman */}
//         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//             <h3 className="text-sm font-bold text-slate-800">Dènye Signalman</h3>
//             <Link to="/admin/reviews" className="text-xs font-semibold text-[#FF6600] hover:underline">Wè tout</Link>
//           </div>
//           {data?.recent_reports.length === 0 ? (
//             <div className="text-center py-10"><MdWarning size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Pa gen signalman ankò.</p></div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {data?.recent_reports.map((r: any, i: number) => (
//                 <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
//                   <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
//                     <MdWarning size={16} className="text-red-500" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-semibold text-slate-800 truncate">{r.title || 'Signalman'}</p>
//                     <p className="text-xs text-slate-400">{r.reporter || 'Anònim'} · {r.type || 'Jeneral'}</p>
//                   </div>
//                   <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
//                     Nouvo
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Aksyon rapid admin ── */}
//       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//         <div className="px-5 py-4 border-b border-slate-100">
//           <h3 className="text-sm font-bold text-slate-800">Aksyon Rapid Admin</h3>
//         </div>
//         <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//           {[
//             { icon: MdPeople,       label: 'Patnè yo',         path: '/admin/partners',    color: '#0000AA' },
//             { icon: MdFactCheck,    label: 'Validasyon',        path: '/admin/validation',  color: '#16a34a' },
//             { icon: MdPayment,      label: 'Peman yo',          path: '/admin/payments',    color: '#FF6600' },
//             { icon: MdBarChart,     label: 'Estatistik',        path: '/admin/statistics',  color: '#7c3aed' },
//             { icon: MdWarning,      label: 'Signalman',         path: '/admin/reviews',     color: '#dc2626' },
//             { icon: MdPieChart,     label: 'Rapò',              path: '/admin/reports',     color: '#0891b2' },
//           ].map((action, i) => (
//             <button key={i} onClick={() => navigate(action.path)}
//               className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center"
//                 style={{ backgroundColor: action.color + '15' }}>
//                 <action.icon size={20} style={{ color: action.color }} />
//               </div>
//               <span className="text-xs font-semibold text-slate-600 text-center group-hover:text-slate-800">{action.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdPeople,
  MdPerson,
  MdCampaign,
  MdCalendarToday,
  MdPayment,
  MdAttachMoney,
  MdArrowForward,
  MdRefresh,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdBarChart,
  MdPieChart,
  MdBed,
  MdWork,
  MdFlight,
  MdShoppingBag,
  MdCarRental,
  MdPersonAdd,
  MdFactCheck,
  MdWarning,
  MdMessage,
  MdNotifications,
  MdNewReleases,
  MdVerified,
} from 'react-icons/md';

import AdminLayout from './AdminLayout';
import api from '../../services/api';

/* ============================================================================
   TYPES
============================================================================ */

interface DashboardStats {
  total_partners: number;
  total_users: number;
  total_admins: number;
  total_listings: number;
  total_bookings: number;
  payments_done: number;
  payments_pending: number;
  total_revenue: number;
  total_commission: number;
  new_partners: number;
  new_users: number;
  new_listings: number;
  reports: number;
  unread_messages: number;
  unread_notifications: number;
}

interface BookingStatus {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface ServicesData {
  lojman: number;
  travay: number;
  vwayaj: number;
  mache: number;
  lokasyon: number;
}

interface RecentSignup {
  last_name: string;
  first_name: string;
  id?: number;
  full_name?: string;
  email?: string;
  role?: string;
}

interface RecentPayment {
  id?: number;
  guest_name?: string;
  accommodation_name?: string;
  total_price?: number;
  status?: string;
}

interface RecentBooking {
  id?: number;
  guest_name?: string;
  accommodation_name?: string;
  check_in?: string;
  check_out?: string;
  status?: string;
}

interface RecentReport {
  id?: number;
  title?: string;
  reporter?: string;
  type?: string;
}

interface DashboardData {
  stats: DashboardStats;
  bookings_by_status: BookingStatus;

  services?: ServicesData;

  monthly_revenue?: number[];

  recent_signups?: RecentSignup[];
  recent_payments?: RecentPayment[];
  recent_bookings?: RecentBooking[];
  recent_reports?: RecentReport[];
  recent_activity?: any[];
}

/* ============================================================================
   DEFAULT DATA
============================================================================ */

const EMPTY_STATS: DashboardStats = {
  total_partners: 0,
  total_users: 0,
  total_admins: 0,
  total_listings: 0,
  total_bookings: 0,
  payments_done: 0,
  payments_pending: 0,
  total_revenue: 0,
  total_commission: 0,
  new_partners: 0,
  new_users: 0,
  new_listings: 0,
  reports: 0,
  unread_messages: 0,
  unread_notifications: 0,
};

const EMPTY_BOOKING_STATUS: BookingStatus = {
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
};

const EMPTY_SERVICES: ServicesData = {
  lojman: 0,
  travay: 0,
  vwayaj: 0,
  mache: 0,
  lokasyon: 0,
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Avr',
  'Me',
  'Jen',
  'Jul',
  'Out',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/* ============================================================================
   HELPERS
============================================================================ */

const formatNumber = (value: number | undefined | null): string => {
  return Number(value ?? 0).toLocaleString('fr-FR');
};

const formatMoney = (value: number | undefined | null): string => {
  return `HTG ${formatNumber(value)}`;
};

const normalizeDashboardData = (raw: any): DashboardData => {
  const stats = raw?.stats ?? {};
  const bookingStatus = raw?.bookings_by_status ?? {};
  const services = raw?.services ?? {};

  return {
    stats: {
      total_partners: Number(stats.total_partners ?? 0),
      total_users: Number(stats.total_users ?? 0),
      total_admins: Number(stats.total_admins ?? 0),
      total_listings: Number(stats.total_listings ?? 0),
      total_bookings: Number(stats.total_bookings ?? 0),
      payments_done: Number(stats.payments_done ?? 0),
      payments_pending: Number(stats.payments_pending ?? 0),
      total_revenue: Number(stats.total_revenue ?? 0),
      total_commission: Number(stats.total_commission ?? 0),
      new_partners: Number(stats.new_partners ?? 0),
      new_users: Number(stats.new_users ?? 0),
      new_listings: Number(stats.new_listings ?? 0),
      reports: Number(stats.reports ?? 0),
      unread_messages: Number(stats.unread_messages ?? 0),
      unread_notifications: Number(stats.unread_notifications ?? 0),
    },

    bookings_by_status: {
      pending: Number(bookingStatus.pending ?? 0),
      confirmed: Number(bookingStatus.confirmed ?? 0),
      completed: Number(bookingStatus.completed ?? 0),
      cancelled: Number(bookingStatus.cancelled ?? 0),
    },

    services: {
      lojman: Number(services.lojman ?? 0),
      travay: Number(services.travay ?? 0),
      vwayaj: Number(services.vwayaj ?? 0),
      mache: Number(services.mache ?? 0),
      lokasyon: Number(services.lokasyon ?? 0),
    },

    monthly_revenue: Array.isArray(raw?.monthly_revenue)
      ? raw.monthly_revenue.map((value: unknown) => Number(value ?? 0))
      : Array(12).fill(0),

    recent_signups: Array.isArray(raw?.recent_signups)
      ? raw.recent_signups
      : [],

    recent_payments: Array.isArray(raw?.recent_payments)
      ? raw.recent_payments
      : [],

    recent_bookings: Array.isArray(raw?.recent_bookings)
      ? raw.recent_bookings
      : [],

    recent_reports: Array.isArray(raw?.recent_reports)
      ? raw.recent_reports
      : [],

    recent_activity: Array.isArray(raw?.recent_activity)
      ? raw.recent_activity
      : [],
  };
};

/* ============================================================================
   COMPONENT
============================================================================ */

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData>({
    stats: EMPTY_STATS,
    bookings_by_status: EMPTY_BOOKING_STATUS,
    services: EMPTY_SERVICES,
    monthly_revenue: Array(12).fill(0),
    recent_signups: [],
    recent_payments: [],
    recent_bookings: [],
    recent_reports: [],
    recent_activity: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  /* ==========================================================================
     FETCH DASHBOARD
  ========================================================================== */

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('/admin/dashboard/');

      console.log('ADMIN DASHBOARD:', res.data);

      const normalizedData = normalizeDashboardData(res.data);

      setData(normalizedData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Erreur chargement dashboard admin:', err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          'Impossible de charger les données du dashboard.'
      );

      /*
       * On garde des données vides afin d'éviter
       * un écran blanc en cas d'erreur API.
       */
      setData({
        stats: EMPTY_STATS,
        bookings_by_status: EMPTY_BOOKING_STATUS,
        services: EMPTY_SERVICES,
        monthly_revenue: Array(12).fill(0),
        recent_signups: [],
        recent_payments: [],
        recent_bookings: [],
        recent_reports: [],
        recent_activity: [],
      });

      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ==========================================================================
     DATA
  ========================================================================== */

  const s = data.stats ?? EMPTY_STATS;

  const bookingData =
    data.bookings_by_status ?? EMPTY_BOOKING_STATUS;

  const serviceData =
    data.services ?? EMPTY_SERVICES;

  const monthlyRevenue =
    Array.isArray(data.monthly_revenue)
      ? data.monthly_revenue
      : Array(12).fill(0);

  const recentSignups =
    Array.isArray(data.recent_signups)
      ? data.recent_signups
      : [];

  const recentPayments =
    Array.isArray(data.recent_payments)
      ? data.recent_payments
      : [];

  const recentBookings =
    Array.isArray(data.recent_bookings)
      ? data.recent_bookings
      : [];

  const recentReports =
    Array.isArray(data.recent_reports)
      ? data.recent_reports
      : [];

  /* ==========================================================================
     MAIN CARDS
  ========================================================================== */

  const mainCards = [
    {
      icon: MdPeople,
      label: 'Total Patnè',
      value: formatNumber(s.total_partners),
      sub: `+${formatNumber(s.new_partners)} nouvo`,
      gradient: 'from-[#0000AA] to-blue-600',
      path: '/admin/partners',
    },

    {
      icon: MdPerson,
      label: 'Total Itilizatè',
      value: formatNumber(s.total_users),
      sub: `+${formatNumber(s.new_users)} nouvo`,
      gradient: 'from-purple-600 to-purple-800',
      path: '/admin/users',
    },

    {
      icon: MdCampaign,
      label: 'Total Anonskman',
      value: formatNumber(s.total_listings),
      sub: `+${formatNumber(s.new_listings)} nouvo`,
      gradient: 'from-[#FF6600] to-orange-700',
      path: '/admin/listings',
    },

    {
      icon: MdCalendarToday,
      label: 'Total Rezèvasyon',
      value: formatNumber(s.total_bookings),
      sub: `${formatNumber(bookingData.pending)} annatant`,
      gradient: 'from-teal-500 to-teal-700',
      path: '/admin/bookings',
    },

    {
      icon: MdPayment,
      label: 'Peman fèt',
      value: formatNumber(s.payments_done),
      sub: `${formatNumber(s.payments_pending)} annatant`,
      gradient: 'from-green-500 to-green-700',
      path: '/admin/payments',
    },

    {
      icon: MdAttachMoney,
      label: 'Revni Total',
      value: formatMoney(s.total_revenue),
      sub: 'Anvan komisyon',
      gradient: 'from-yellow-500 to-yellow-700',
      path: '/admin/revenue',
    },

    {
      icon: MdBarChart,
      label: 'Komisyon TRAPDE',
      value: formatMoney(s.total_commission),
      sub: '10% sou chak transaksyon',
      gradient: 'from-pink-500 to-pink-700',
      path: '/admin/revenue',
    },

    {
      icon: MdWarning,
      label: 'Signalman',
      value: formatNumber(s.reports),
      sub: 'Pou revize',
      gradient: 'from-red-500 to-red-700',
      path: '/admin/reviews',
    },
  ];

  /* ==========================================================================
     SECONDARY CARDS
  ========================================================================== */

  const secondaryCards = [
    {
      icon: MdMessage,
      label: 'Mesaj pa li',
      value: s.unread_messages,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      path: '/admin/messages',
    },

    {
      icon: MdNotifications,
      label: 'Notif pa li',
      value: s.unread_notifications,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      path: '/admin/notifications',
    },

    {
      icon: MdFactCheck,
      label: 'Annatant valid.',
      value: 0,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      path: '/admin/validation',
    },

    {
      icon: MdNewReleases,
      label: 'Nouvo patnè',
      value: s.new_partners,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      path: '/admin/partners',
    },
  ];

  /* ==========================================================================
     SERVICES
  ========================================================================== */

  const services = [
    {
      id: 'lojman',
      icon: MdBed,
      label: 'Lojman',
      count: serviceData.lojman,
      color: '#0000AA',
    },

    {
      id: 'travay',
      icon: MdWork,
      label: 'Travay',
      count: serviceData.travay,
      color: '#16a34a',
    },

    {
      id: 'vwayaj',
      icon: MdFlight,
      label: 'Vwayaj',
      count: serviceData.vwayaj,
      color: '#7c3aed',
    },

    {
      id: 'mache',
      icon: MdShoppingBag,
      label: 'Mache',
      count: serviceData.mache,
      color: '#FF6600',
    },

    {
      id: 'lokasyon',
      icon: MdCarRental,
      label: 'Lokasyon',
      count: serviceData.lokasyon,
      color: '#0891b2',
    },
  ];

  /* ==========================================================================
     BOOKING STATUS
  ========================================================================== */

  const bookingStatus = [
    {
      label: 'Annatant',
      icon: MdPending,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      value: bookingData.pending,
    },

    {
      label: 'Konfime',
      icon: MdCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      value: bookingData.confirmed,
    },

    {
      label: 'Konplete',
      icon: MdVerified,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      value: bookingData.completed,
    },

    {
      label: 'Anile',
      icon: MdCancel,
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      value: bookingData.cancelled,
    },
  ];

  /* ==========================================================================
     REVENUE CHART
  ========================================================================== */

  const revenueValues = monthlyRevenue.length
    ? monthlyRevenue
    : Array(12).fill(0);

  const maxRevenue = Math.max(
    ...revenueValues.map((value) => Number(value) || 0),
    1
  );

  const currentMonth = new Date().getMonth();

  /* ==========================================================================
     RENDER
  ========================================================================== */

  return (
    <AdminLayout title="Vue d'ensemble — Dashboard Admin">

      {/* ======================================================================
          HEADER
      ====================================================================== */}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">

        <div>
          <p className="text-sm text-slate-500">
            Dènye mete ajou:{' '}
            <span className="font-medium">
              {lastUpdated.toLocaleTimeString('fr-FR')}
            </span>
          </p>

          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <MdRefresh
            size={16}
            className={isLoading ? 'animate-spin' : ''}
          />

          Aktyalize
        </button>
      </div>

      {/* ======================================================================
          MAIN CARDS
      ====================================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {mainCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">

                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon
                    size={20}
                    className="text-white"
                  />
                </div>

                <MdArrowForward
                  size={16}
                  className="text-white/60"
                />
              </div>

              {isLoading ? (
                <div className="h-7 w-20 bg-white/30 rounded-lg animate-pulse mb-1" />
              ) : (
                <p className="text-2xl font-bold">
                  {card.value}
                </p>
              )}

              <p className="text-xs font-semibold text-white/80 mt-0.5">
                {card.label}
              </p>

              <p className="text-xs text-white/50 mt-0.5">
                {card.sub}
              </p>
            </div>
          );
        })}

      </div>

      {/* ======================================================================
          SECONDARY CARDS
      ====================================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {secondaryCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 ${card.bg}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">

                <Icon
                  size={20}
                  className={card.color}
                />

              </div>

              <div>

                {isLoading ? (
                  <div className="h-6 w-12 bg-slate-200 rounded animate-pulse mb-0.5" />
                ) : (
                  <p className={`text-xl font-bold ${card.color}`}>
                    {formatNumber(card.value)}
                  </p>
                )}

                <p className="text-xs text-slate-500">
                  {card.label}
                </p>

              </div>
            </div>
          );
        })}

      </div>

      {/* ======================================================================
          REVENUE + SERVICES + BOOKINGS
      ====================================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        {/* REVENUE */}

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Revni pa mwa
              </h3>

              <p className="text-xs text-slate-400 mt-0.5">
                Ane {new Date().getFullYear()}
              </p>
            </div>

            <Link
              to="/admin/revenue"
              className="text-xs font-semibold text-[#FF6600] hover:underline flex items-center gap-1"
            >
              Detay
              <MdArrowForward size={13} />
            </Link>

          </div>

          <div className="p-5">

            <div className="flex items-end gap-1.5 h-36 mb-2">

              {revenueValues
                .slice(0, 12)
                .map((value, index) => {

                  const numericValue =
                    Number(value) || 0;

                  const height =
                    maxRevenue > 0
                      ? (numericValue / maxRevenue) * 100
                      : 0;

                  const isCurrentMonth =
                    index === currentMonth;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-1.5 group relative"
                    >

                      <div
                        className="relative w-full flex items-end justify-center"
                        style={{ height: '120px' }}
                      >

                        <div
                          className={`w-full rounded-t-lg transition-all cursor-pointer ${
                            isCurrentMonth
                              ? 'bg-[#FF6600]'
                              : 'bg-[#0000AA]/20 group-hover:bg-[#0000AA]/50'
                          }`}
                          style={{
                            height: `${Math.max(height, numericValue > 0 ? 3 : 1)}%`,
                          }}
                        />

                        {numericValue > 0 && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {formatMoney(numericValue)}
                          </div>
                        )}

                      </div>

                      <p
                        className={`text-[9px] ${
                          isCurrentMonth
                            ? 'text-[#FF6600] font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {MONTHS[index]}
                      </p>

                    </div>
                  );
                })}

            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">

              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#FF6600]" />
                Mwa koure
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0000AA]/20" />
                Lòt mwa yo
              </span>

            </div>

          </div>
        </div>

        {/* SERVICES + BOOKINGS */}

        <div className="space-y-4">

          {/* SERVICES */}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

            <div className="px-4 py-3 border-b border-slate-100">

              <h3 className="text-sm font-bold text-slate-800">
                Sèvis yo
              </h3>

            </div>

            <div className="p-3 space-y-1.5">

              {services.map((service) => {

                const Icon = service.icon;

                return (
                  <div
                    key={service.id}
                    onClick={() =>
                      navigate(
                        `/admin/services/${service.id}`
                      )
                    }
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors group"
                  >

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor:
                          `${service.color}15`,
                      }}
                    >
                      <Icon
                        size={16}
                        style={{
                          color: service.color,
                        }}
                      />
                    </div>

                    <span className="text-sm text-slate-700 flex-1 group-hover:text-slate-900 font-medium">
                      {service.label}
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {formatNumber(service.count)}
                    </span>

                    <MdArrowForward
                      size={14}
                      className="text-slate-300 group-hover:text-slate-500"
                    />

                  </div>
                );
              })}

            </div>
          </div>

          {/* BOOKING STATUS */}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

            <div className="px-4 py-3 border-b border-slate-100">

              <h3 className="text-sm font-bold text-slate-800">
                Statè Rezèvasyon
              </h3>

            </div>

            <div className="p-3 space-y-2">

              {bookingStatus.map((status, index) => {

                const Icon = status.icon;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${status.bg}`}
                  >

                    <Icon
                      size={16}
                      className={status.color}
                    />

                    <span
                      className={`text-xs font-semibold flex-1 ${status.color}`}
                    >
                      {status.label}
                    </span>

                    <span
                      className={`text-base font-bold ${status.color}`}
                    >
                      {formatNumber(status.value)}
                    </span>

                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>

      {/* ======================================================================
          RECENT ACTIVITY
      ====================================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* RECENT SIGNUPS */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

            <h3 className="text-sm font-bold text-slate-800">
              Dènye Enskripsyon
            </h3>

            <Link
              to="/admin/users"
              className="text-xs font-semibold text-[#FF6600] hover:underline"
            >
              Wè tout
            </Link>

          </div>

          {isLoading ? (

            <div className="divide-y divide-slate-100">

              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-3 px-5 py-3.5 animate-pulse"
                >

                  <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />

                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-2.5 bg-slate-200 rounded w-1/3" />
                  </div>

                </div>
              ))}

            </div>

          ) : recentSignups.length === 0 ? (

            <div className="text-center py-10">

              <MdPersonAdd
                size={28}
                className="text-slate-200 mx-auto mb-2"
              />

              <p className="text-sm text-slate-400">
                Pa gen enskripsyon ankò.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentSignups.map((user, index) => {

                const fullName =
                  user.full_name ||
                  `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() ||
                  'Itilizatè';

                return (
                  <div
                    key={user.id ?? index}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  >

                    <div className="w-9 h-9 rounded-full bg-[#0000AA]/10 flex items-center justify-center text-[#0000AA] text-xs font-bold flex-shrink-0">
                      {fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {fullName}
                      </p>

                      <p className="text-xs text-slate-400 truncate">
                        {user.email || '—'}
                      </p>

                    </div>

                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.role === 'partner'
                          ? 'bg-purple-50 text-purple-700'
                          : user.role === 'admin'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {user.role === 'partner'
                        ? 'Patnè'
                        : user.role === 'admin'
                        ? 'Admin'
                        : 'Itilizatè'}
                    </span>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* RECENT PAYMENTS */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

            <h3 className="text-sm font-bold text-slate-800">
              Dènye Peman
            </h3>

            <Link
              to="/admin/payments"
              className="text-xs font-semibold text-[#FF6600] hover:underline"
            >
              Wè tout
            </Link>

          </div>

          {recentPayments.length === 0 ? (

            <div className="text-center py-10">

              <MdPayment
                size={28}
                className="text-slate-200 mx-auto mb-2"
              />

              <p className="text-sm text-slate-400">
                Pa gen peman ankò.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentPayments.map((payment, index) => (

                <div
                  key={payment.id ?? index}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >

                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">

                    <MdAttachMoney
                      size={18}
                      className="text-green-600"
                    />

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {payment.guest_name || 'Kliyan'}
                    </p>

                    <p className="text-xs text-slate-400 truncate">
                      {payment.accommodation_name || '—'}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-bold text-green-700">
                      {formatMoney(payment.total_price)}
                    </p>

                    <p className="text-xs text-slate-400">
                      {payment.status || '—'}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* RECENT BOOKINGS */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

            <h3 className="text-sm font-bold text-slate-800">
              Dènye Rezèvasyon
            </h3>

            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-[#FF6600] hover:underline"
            >
              Wè tout
            </Link>

          </div>

          {recentBookings.length === 0 ? (

            <div className="text-center py-10">

              <MdCalendarToday
                size={28}
                className="text-slate-200 mx-auto mb-2"
              />

              <p className="text-sm text-slate-400">
                Pa gen rezèvasyon ankò.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentBookings.map((booking, index) => (

                <div
                  key={booking.id ?? index}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >

                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                    <MdCalendarToday
                      size={16}
                      className="text-blue-600"
                    />

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {booking.guest_name || 'Kliyan'}
                    </p>

                    <p className="text-xs text-slate-400 truncate">

                      {booking.accommodation_name || '—'}

                      {booking.check_in &&
                        ` · ${booking.check_in}`}

                      {booking.check_out &&
                        ` → ${booking.check_out}`}

                    </p>

                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      booking.status === 'confirmed'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : booking.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : booking.status === 'completed'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {booking.status === 'confirmed'
                      ? 'Konfime'
                      : booking.status === 'pending'
                      ? 'Annatant'
                      : booking.status === 'completed'
                      ? 'Konplete'
                      : booking.status === 'cancelled'
                      ? 'Anile'
                      : booking.status || '—'}
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* RECENT REPORTS */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

            <h3 className="text-sm font-bold text-slate-800">
              Dènye Signalman
            </h3>

            <Link
              to="/admin/reviews"
              className="text-xs font-semibold text-[#FF6600] hover:underline"
            >
              Wè tout
            </Link>

          </div>

          {recentReports.length === 0 ? (

            <div className="text-center py-10">

              <MdWarning
                size={28}
                className="text-slate-200 mx-auto mb-2"
              />

              <p className="text-sm text-slate-400">
                Pa gen signalman ankò.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentReports.map((report, index) => (

                <div
                  key={report.id ?? index}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >

                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">

                    <MdWarning
                      size={16}
                      className="text-red-500"
                    />

                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {report.title || 'Signalman'}
                    </p>

                    <p className="text-xs text-slate-400">
                      {report.reporter || 'Anònim'}
                      {' · '}
                      {report.type || 'Jeneral'}
                    </p>

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

      {/* ======================================================================
          QUICK ACTIONS
      ====================================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="px-5 py-4 border-b border-slate-100">

          <h3 className="text-sm font-bold text-slate-800">
            Aksyon Rapid Admin
          </h3>

        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

          {[
            {
              icon: MdPeople,
              label: 'Patnè yo',
              path: '/admin/partners',
              color: '#0000AA',
            },

            {
              icon: MdFactCheck,
              label: 'Validasyon',
              path: '/admin/validation',
              color: '#16a34a',
            },

            {
              icon: MdPayment,
              label: 'Peman yo',
              path: '/admin/payments',
              color: '#FF6600',
            },

            {
              icon: MdBarChart,
              label: 'Estatistik',
              path: '/admin/statistics',
              color: '#7c3aed',
            },

            {
              icon: MdWarning,
              label: 'Signalman',
              path: '/admin/reviews',
              color: '#dc2626',
            },

            {
              icon: MdPieChart,
              label: 'Rapò',
              path: '/admin/reports',
              color: '#0891b2',
            },
          ].map((action, index) => {

            const Icon = action.icon;

            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group"
              >

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      `${action.color}15`,
                  }}
                >

                  <Icon
                    size={20}
                    style={{
                      color: action.color,
                    }}
                  />

                </div>

                <span className="text-xs font-semibold text-slate-600 text-center group-hover:text-slate-800">
                  {action.label}
                </span>

              </button>
            );
          })}

        </div>
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;