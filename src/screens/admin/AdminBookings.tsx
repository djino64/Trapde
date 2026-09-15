import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSearch, MdRefresh, MdVisibility, MdCheckCircle,
  MdCancel, MdClose, MdWarning, MdDownload,
  MdCalendarToday, MdAttachMoney,
  MdPhone, MdEmail, MdLocationOn, MdPending,
 MdCheck, MdMessage,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface AdminBooking {
  id:                 number;
  accommodation_name: string;
  accommodation_city: string;
  guest_name:         string;
  guest_email:        string;
  guest_phone:        string;
  host_name:          string;
  host_email:         string;
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
  updated_at:         string;
}

const STATUS_CFG = {
  pending:   { label: 'Annatant', icon: MdPending,     color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200'  },
  confirmed: { label: 'Konfime',  icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200'  },
  cancelled: { label: 'Anile',    icon: MdCancel,      color: 'text-red-600',   bg: 'bg-red-50 border-red-200'      },
  completed: { label: 'Konplete', icon: MdCheckCircle, color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200'    },
};

const AdminBookings: React.FC = () => {
  const [bookings, setBookings]         = useState<AdminBooking[]>([]);
  const [filtered, setFiltered]         = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]         = useState<AdminBooking | null>(null);
  const [isUpdating, setIsUpdating]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const PER_PAGE = 20;

  const fetchBookings = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PER_PAGE) });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search);
      const res  = await api.get(`/admin/bookings/?${params}`);
      const data = res.data;
      setBookings(data.results || data);
      setFiltered(data.results || data);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || (data.results || data).length);
    } catch {
      try {
        const res  = await api.get('accommodations/bookings/host/');
        const data = res.data.results || res.data;
        setBookings(data); setFiltered(data);
        setTotalCount(data.length);
      } catch { setError('Erè pandan chajman rezèvasyon yo.'); }
    } finally { setIsLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  useEffect(() => {
    let data = bookings;
    if (statusFilter !== 'all') data = data.filter(b => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(b =>
        b.guest_name.toLowerCase().includes(q) ||
        b.accommodation_name.toLowerCase().includes(q) ||
        b.host_name?.toLowerCase().includes(q) ||
        b.guest_email?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [bookings, search, statusFilter]);

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };

  const updateStatus = async (id: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`accommodations/bookings/${id}/`, { status: newStatus });
      setBookings(p => p.map(b => b.id === id ? { ...b, status: newStatus as AdminBooking['status'] } : b));
      if (selected?.id === id) setSelected(b => b ? { ...b, status: newStatus as AdminBooking['status'] } : null);
      showSuccess(`Rezèvasyon ${newStatus === 'confirmed' ? 'konfime' : newStatus === 'cancelled' ? 'anile' : 'mete ajou'}.`);
    } catch { setError('Pa ka chanje statè rezèvasyon an.'); }
    finally { setIsUpdating(false); }
  };

  const exportCSV = () => {
    const headers = ['#','Kliyan','Lojman','Patnè','Dat Rive','Dat Pati','Nwit','Total','Revni Patnè','Komisyon','Statè'];
    const rows = filtered.map(b => [
      b.id, b.guest_name, b.accommodation_name, b.host_name,
      b.check_in, b.check_out, b.total_nights,
      b.total_price, b.host_earnings, b.commission, b.status,
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `trapde-bookings-${Date.now()}.csv`; a.click();
  };

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue:   bookings.filter(b => ['confirmed','completed'].includes(b.status)).reduce((s, b) => s + (b.total_price || 0), 0),
    commission:bookings.filter(b => ['confirmed','completed'].includes(b.status)).reduce((s, b) => s + (b.commission || 0), 0),
  };

  return (
    <AdminLayout title="Jestyon Rezèvasyon yo">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',        value: stats.total,                                  color: 'bg-[#0000AA]', icon: MdCalendarToday },
          { label: 'Annatant',     value: stats.pending,                                color: 'bg-amber-500', icon: MdPending       },
          { label: 'Revni Total',  value: `HTG ${stats.revenue.toLocaleString()}`,      color: 'bg-green-600', icon: MdAttachMoney   },
          { label: 'Komisyon',     value: `HTG ${stats.commission.toLocaleString()}`,   color: 'bg-[#FF6600]', icon: MdAttachMoney   },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statè pills */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { v: 'all',       l: `Tout (${stats.total})`,         cfg: null                    },
          { v: 'pending',   l: `Annatant (${stats.pending})`,   cfg: STATUS_CFG.pending      },
          { v: 'confirmed', l: `Konfime (${stats.confirmed})`,  cfg: STATUS_CFG.confirmed    },
          { v: 'completed', l: `Konplete (${stats.completed})`, cfg: STATUS_CFG.completed    },
          { v: 'cancelled', l: `Anile (${stats.cancelled})`,    cfg: STATUS_CFG.cancelled    },
        ].map(({ v, l }) => (
          <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              statusFilter === v
                ? 'bg-[#0A0A2E] text-white border-[#0A0A2E]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>{l}
          </button>
        ))}
      </div>

      {/* Filtre */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Chèche pa kliyan, lojman, patnè..."
            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0000AA]" />
        </div>
        <button onClick={fetchBookings}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <MdRefresh size={18} />
        </button>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
          <MdDownload size={16} /> CSV
        </button>
      </div>

      {/* Notif */}
      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600"><MdWarning size={16} />{error}<button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700"><MdCheckCircle size={16} />{success}</div>}

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Rezèvasyon yo ({totalCount})</h3>
          <p className="text-xs text-slate-400">Paj {page}/{totalPages}</p>
        </div>

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                <div className="w-16 h-12 bg-slate-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3.5 bg-slate-200 rounded w-1/3" /><div className="h-3 bg-slate-200 rounded w-1/2" /></div>
                <div className="h-6 w-20 bg-slate-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <MdCalendarToday size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Pa gen rezèvasyon pou filtre sa a.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['#','Kliyan','Lojman / Patnè','Dat','Nwit','Total','Komisyon','Statè','Aksyon'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(b => {
                    const cfg  = STATUS_CFG[b.status] || STATUS_CFG.pending;
                    const Icon = cfg.icon;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">#{b.id}</td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-slate-900">{b.guest_name}</p>
                          <p className="text-xs text-slate-400">{b.guest_email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-800">{b.accommodation_name}</p>
                          <p className="text-xs text-slate-400">Patnè: {b.host_name}</p>
                          {b.accommodation_city && (
                            <p className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                              <MdLocationOn size={11} /> {b.accommodation_city}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                          <p>{b.check_in}</p>
                          <p className="text-slate-400">→ {b.check_out}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <p className="text-sm font-bold text-slate-800">{b.total_nights}</p>
                          <p className="text-xs text-slate-400">{b.guests_count} moun</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-[#0000AA]">HTG {(b.total_price || 0).toLocaleString()}</p>
                          <p className="text-xs text-green-600">→ {(b.host_earnings || 0).toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-bold text-[#FF6600]">HTG {(b.commission || 0).toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            <Icon size={11} /> {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelected(b)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors">
                              <MdVisibility size={14} />
                            </button>
                            {b.status === 'pending' && (
                              <>
                                <button onClick={() => updateStatus(b.id, 'confirmed')}
                                  className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors"
                                  title="Konfime">
                                  <MdCheck size={14} />
                                </button>
                                <button onClick={() => updateStatus(b.id, 'cancelled')}
                                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                                  title="Anile">
                                  <MdClose size={14} />
                                </button>
                              </>
                            )}
                            {b.status === 'confirmed' && (
                              <button onClick={() => updateStatus(b.id, 'completed')}
                                className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                                title="Konplete">
                                <MdCheckCircle size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan={5} className="px-4 py-3 text-xs font-bold text-slate-600 uppercase">Total ({filtered.length})</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#0000AA]">
                      HTG {filtered.filter(b => ['confirmed','completed'].includes(b.status)).reduce((s, b) => s + (b.total_price || 0), 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-[#FF6600]">
                      HTG {filtered.filter(b => ['confirmed','completed'].includes(b.status)).reduce((s, b) => s + (b.commission || 0), 0).toLocaleString()}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  {Math.min((page-1)*PER_PAGE+1, totalCount)}–{Math.min(page*PER_PAGE, totalCount)} sou {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">‹</button>
                  <span className="text-sm font-medium">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawer detay */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Rezèvasyon #{selected.id}</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5 flex-1">

              {/* Statè */}
              {(() => {
                const cfg = STATUS_CFG[selected.status] || STATUS_CFG.pending;
                return (
                  <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                    <cfg.icon size={16} /> {cfg.label}
                  </span>
                );
              })()}

              {/* Kliyan */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Kliyan</p>
                <p className="text-sm font-bold text-slate-900">{selected.guest_name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MdEmail size={12} />{selected.guest_email}</p>
                {selected.guest_phone && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MdPhone size={12} />{selected.guest_phone}</p>}
              </div>

              {/* Lojman + Patnè */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lojman & Patnè</p>
                <p className="text-sm font-bold text-slate-900">{selected.accommodation_name}</p>
                {selected.accommodation_city && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MdLocationOn size={12} />{selected.accommodation_city}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">Patnè: <span className="font-semibold">{selected.host_name}</span></p>
                {selected.host_email && <p className="text-xs text-slate-400">{selected.host_email}</p>}
              </div>

              {/* Dat */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Dat rive',   v: selected.check_in   },
                  { l: 'Dat pati',   v: selected.check_out  },
                  { l: 'Nwit',       v: `${selected.total_nights} nwit` },
                  { l: 'Moun',       v: `${selected.guests_count}${selected.children_count > 0 ? ` + ${selected.children_count} timoun` : ''}` },
                  { l: 'Dat kreye',  v: new Date(selected.created_at).toLocaleDateString('fr-FR') },
                  { l: 'Mete ajou',  v: new Date(selected.updated_at).toLocaleDateString('fr-FR') },
                ].map(({ l, v }) => (
                  <div key={l} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-400">{l}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {/* Pri */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detay finansye</p>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { l: 'Pri pa nwit',   v: `HTG ${(selected.price_per_night || 0).toLocaleString()}`, c: 'text-slate-700' },
                    { l: 'Total kliyan', v: `HTG ${(selected.total_price || 0).toLocaleString()}`,    c: 'text-slate-700' },
                    { l: 'Revni patnè',  v: `HTG ${(selected.host_earnings || 0).toLocaleString()}`, c: 'text-green-700' },
                    { l: 'Komisyon TRAPDE', v: `HTG ${(selected.commission || 0).toLocaleString()}`, c: 'text-[#FF6600]' },
                  ].map(({ l, v, c }) => (
                    <div key={l} className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">{l}</span>
                      <span className={`text-sm font-bold ${c}`}>{v}</span>
                    </div>
                  ))}
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
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Aksyon Admin</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {selected.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(selected.id, 'confirmed')} disabled={isUpdating}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors col-span-1">
                        <MdCheck size={16} /> Konfime
                      </button>
                      <button onClick={() => updateStatus(selected.id, 'cancelled')} disabled={isUpdating}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-red-200 bg-red-50 text-red-700 col-span-1">
                        <MdClose size={16} /> Anile
                      </button>
                    </>
                  )}
                  {selected.status === 'confirmed' && (
                    <button onClick={() => updateStatus(selected.id, 'completed')} disabled={isUpdating}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-[#0000AA] text-white hover:bg-[#000088] transition-colors col-span-2">
                      <MdCheckCircle size={16} /> Mak kòm konplete
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-blue-200 bg-blue-50 text-blue-700 col-span-1">
                    <MdMessage size={16} /> Mesaj kliyan
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-purple-200 bg-purple-50 text-purple-700 col-span-1">
                    <MdMessage size={16} /> Mesaj patnè
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;