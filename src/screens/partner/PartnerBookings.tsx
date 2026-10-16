/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/immutability, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import {
  MdCalendarToday, MdCheckCircle, MdPending, MdCancel,
  MdClose, MdSearch, MdPerson, MdBed, MdArrowForward,
  MdPhone, MdAttachMoney, MdInfo, MdRefresh, MdCheck,
} from 'react-icons/md';
import PartnerLayout from './PartnerLayout';
import api from '../../services/api';

interface Booking {
  id:                 number;
  guest_name:         string;
  guest_email:        string;
  guest_phone:        string;
  accommodation_name: string;
  accommodation_city: string;
  main_photo:         string | null;
  check_in:           string;
  check_out:          string;
  guests_count:       number;
  children_count:     number;
  total_nights:       number;
  price_per_night:    number;
  total_price:        number;
  host_earnings:      number;
  commission:         number;
  status:             'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests:   string;
  created_at:         string;
}

const STATUS_CFG = {
  pending:   { label: 'Annatant',  icon: MdPending,     color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200'   },
  confirmed: { label: 'Konfime',   icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200'   },
  cancelled: { label: 'Anile',     icon: MdCancel,      color: 'text-red-600',   bg: 'bg-red-50 border-red-200'       },
  completed: { label: 'Konplete',  icon: MdCheckCircle, color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200'     },
};

const PartnerBookings: React.FC = () => {
  const [bookings, setBookings]       = useState<Booking[]>([]);
  const [filtered, setFiltered]       = useState<Booking[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]       = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating]   = useState(false);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    let data = bookings;
    if (statusFilter !== 'all') data = data.filter(b => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(b =>
        b.guest_name.toLowerCase().includes(q) ||
        b.accommodation_name.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [bookings, search, statusFilter]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res  = await api.get('/api/accommodations/bookings/host/');
      const data = res.data.results || res.data;
      setBookings(data);
    } catch {
      setError('Erè pandan chajman rezèvasyon yo.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      const res     = await api.patch(`/api/accommodations/bookings/${id}/`, { status: newStatus });
      const updated = res.data;
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      if (selected?.id === id) setSelected(updated);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Pa ka chanje statè a.');
    } finally {
      setIsUpdating(false);
    }
  };

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue:   bookings
                 .filter(b => ['confirmed','completed'].includes(b.status))
                 .reduce((s, b) => s + b.host_earnings, 0),
  };

  return (
    <PartnerLayout title="Rezèvasyon yo">

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',    value: stats.total,     color: 'bg-[#0000AA]', icon: MdCalendarToday },
          { label: 'Annatant',value: stats.pending,   color: 'bg-amber-500', icon: MdPending       },
          { label: 'Konfime', value: stats.confirmed, color: 'bg-green-600', icon: MdCheckCircle   },
          { label: 'Revni',   value: `HTG ${stats.revenue.toLocaleString()}`, color: 'bg-[#FF6600]', icon: MdAttachMoney },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtre + Rechèch */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Chèche pa non kliyan oswa lojman..."
            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0000AA]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['all','Tout'],['pending','Annatant'],['confirmed','Konfime'],['completed','Konplete'],['cancelled','Anile']].map(([v,l]) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors border ${
                statusFilter === v
                  ? 'bg-[#0000AA] text-white border-[#0000AA]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>{l}
            </button>
          ))}
        </div>
        <button onClick={fetchBookings}
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <MdRefresh size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
          <MdInfo size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button>
        </div>
      )}

      {/* Lis */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-16">
          <MdCalendarToday size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Pa gen rezèvasyon pou filtre sa a.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(b => {
              const cfg = STATUS_CFG[b.status] || STATUS_CFG.pending;
              return (
                <div key={b.id} onClick={() => setSelected(b)}
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                    {b.main_photo
                      ? <img src={b.main_photo} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><MdBed size={22} className="text-slate-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900 truncate">{b.guest_name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{b.accommodation_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {b.check_in} → {b.check_out} · {b.total_nights} nwit · {b.guests_count} moun
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#0000AA]">HTG {b.host_earnings.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">revni ou</p>
                  </div>
                  <MdArrowForward size={18} className="text-slate-300 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drawer detay */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Rezèvasyon #{selected.id}</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* Statè */}
              {(() => {
                const cfg  = STATUS_CFG[selected.status] || STATUS_CFG.pending;
                const Icon = cfg.icon;
                return (
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                    <Icon size={16} /> {cfg.label}
                  </span>
                );
              })()}

              {/* Kliyan */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kliyan</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0000AA]/10 flex items-center justify-center">
                    <MdPerson size={20} className="text-[#0000AA]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selected.guest_name}</p>
                    <p className="text-xs text-slate-500">{selected.guest_email}</p>
                  </div>
                </div>
                {selected.guest_phone && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MdPhone size={14} /> {selected.guest_phone}
                  </p>
                )}
              </div>

              {/* Lojman */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lojman</p>
                <p className="text-sm font-bold text-slate-900">{selected.accommodation_name}</p>
                <p className="text-xs text-slate-500">{selected.accommodation_city}</p>
              </div>

              {/* Dat */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Dat rive',  value: selected.check_in  },
                  { label: 'Dat pati',  value: selected.check_out },
                  { label: 'Nwit',      value: `${selected.total_nights} nwit` },
                  { label: 'Moun',      value: `${selected.guests_count}${selected.children_count > 0 ? ` + ${selected.children_count} timoun` : ''}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Pri */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detay pri</p>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total kliyan peye</span>
                    <span className="font-medium">HTG {selected.total_price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Komisyon TRAPDE (10%)</span>
                    <span className="text-red-500 font-medium">- HTG {selected.commission.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-sm font-bold text-slate-800">Revni ou</span>
                    <span className="text-base font-bold text-[#0000AA]">HTG {selected.host_earnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Demann espesyal */}
              {selected.special_requests && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Demann espesyal</p>
                  <p className="text-sm text-slate-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    {selected.special_requests}
                  </p>
                </div>
              )}

              {/* Aksyon */}
              <div className="space-y-2">
                {selected.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(selected.id, 'confirmed')} disabled={isUpdating}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
                      {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MdCheck size={18} />}
                      Konfime rezèvasyon an
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'cancelled')} disabled={isUpdating}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 text-sm font-bold transition-colors disabled:opacity-50">
                      <MdClose size={18} /> Anile rezèvasyon an
                    </button>
                  </>
                )}
                {selected.status === 'confirmed' && (
                  <button onClick={() => updateStatus(selected.id, 'completed')} disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0000AA] hover:bg-[#000088] text-white text-sm font-bold transition-colors disabled:opacity-50">
                    {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <MdCheckCircle size={18} />}
                    Mak kòm konplete
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </PartnerLayout>
  );
};

export default PartnerBookings;