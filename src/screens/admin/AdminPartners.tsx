import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSearch, MdPeople, MdEmail, MdPhone,
  MdLocationOn, MdCalendarToday, MdVisibility, 
  MdBlock, MdDelete, MdCheckCircle, MdClose, MdWarning,
  MdRefresh, MdDownload,
  MdMessage, MdNotifications, MdLock, MdLockOpen,
  MdVerified, MdPending,  MdBed, MdWork, MdFlight,
  MdShoppingBag, MdCarRental,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface Partner {
  id:             number;
  email:          string;
  first_name:     string;
  last_name:      string;
  full_name:      string;
  phone:          string;
  role:           string;
  business_name:  string;
  city:           string;
  country:        string;
  is_active:      boolean;
  email_verified: boolean;
  date_joined:    string;
  avatar_url:     string | null;
  total_listings: number;
  total_bookings: number;
  total_earned:   number;
  commission_paid:number;
  services:       string[];
  last_login:     string | null;
}

const STATUS_OPTIONS = [
  { value: 'all',      label: 'Tout statè'    },
  { value: 'active',   label: 'Aktif'         },
  { value: 'inactive', label: 'Inaktif'       },
  { value: 'blocked',  label: 'Bloke'         },
];

const SERVICE_OPTIONS = [
  { value: 'all',     label: 'Tout sèvis', icon: MdPeople     },
  { value: 'lojman',  label: 'Lojman',     icon: MdBed        },
  { value: 'travay',  label: 'Travay',     icon: MdWork       },
  { value: 'vwayaj',  label: 'Vwayaj',     icon: MdFlight     },
  { value: 'mache',   label: 'Mache',      icon: MdShoppingBag},
  { value: 'lokasyon',label: 'Lokasyon',   icon: MdCarRental  },
];

const AdminPartners: React.FC = () => {
  const [partners, setPartners]     = useState<Partner[]>([]);
  const [filtered, setFiltered]     = useState<Partner[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy]         = useState('date_joined');
  const [sortDir, setSortDir]       = useState<'asc'|'desc'>('desc');
  const [selected, setSelected]     = useState<Partner | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PER_PAGE = 20;

  const fetchPartners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        role: 'partner', page: String(page), page_size: String(PER_PAGE),
        ordering: `${sortDir === 'desc' ? '-' : ''}${sortBy}`,
      });
      if (statusFilter !== 'all') params.append('is_active', String(statusFilter === 'active'));
      if (search.trim()) params.append('search', search);
      const res  = await api.get(`/admin/users/?${params}`);
      const data = res.data;
      setPartners(data.results || data);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || (data.results || data).length);
    } catch {
      setError('Erè pandan chajman patnè yo.');
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, sortBy, sortDir]);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  useEffect(() => {
    let data = partners;
    if (serviceFilter !== 'all') {
      data = data.filter(p => p.services?.includes(serviceFilter));
    }
    setFiltered(data);
  }, [partners, serviceFilter]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const toggleActive = async (id: number, current: boolean) => {
    setIsUpdating(true);
    try {
      await api.patch(`/admin/users/${id}/`, { is_active: !current });
      setPartners(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
      if (selected?.id === id) setSelected(p => p ? { ...p, is_active: !current } : null);
      showSuccess(!current ? 'Patnè aktive avèk siksè.' : 'Patnè dezaktive avèk siksè.');
    } catch { setError('Pa ka chanje statè a.'); }
    finally { setIsUpdating(false); }
  };

  const validatePartner = async (id: number) => {
    setIsUpdating(true);
    try {
      await api.patch(`/admin/users/${id}/`, { is_active: true, email_verified: true });
      setPartners(prev => prev.map(p => p.id === id ? { ...p, is_active: true, email_verified: true } : p));
      showSuccess('Patnè valide avèk siksè.');
    } catch { setError('Pa ka valide patnè a.'); }
    finally { setIsUpdating(false); }
  };

  const deletePartner = async (id: number) => {
    try {
      await api.delete(`/admin/users/${id}/`);
      setPartners(prev => prev.filter(p => p.id !== id));
      setDeleteModal(null);
      if (selected?.id === id) setSelected(null);
      showSuccess('Patnè efase avèk siksè.');
    } catch { setError('Pa ka efase patnè a.'); }
  };

  const exportCSV = () => {
    const headers = ['ID','Non','Imèl','Telefòn','Biznis','Vil','Peyi','Aktif','Dat Rejistre'];
    const rows = filtered.map(p => [
      p.id, p.full_name, p.email, p.phone, p.business_name,
      p.city, p.country, p.is_active ? 'Wi' : 'Non',
      new Date(p.date_joined).toLocaleDateString('fr-FR'),
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url;
    a.download = `trapde-partners-${Date.now()}.csv`; a.click();
  };

  const stats = {
    total:    partners.length,
    active:   partners.filter(p => p.is_active).length,
    inactive: partners.filter(p => !p.is_active).length,
    verified: partners.filter(p => p.email_verified).length,
  };

  return (
    <AdminLayout title="Jesyon Patnè yo">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Patnè',   value: stats.total,    color: 'bg-[#0000AA]', icon: MdPeople      },
          { label: 'Aktif',         value: stats.active,   color: 'bg-green-600', icon: MdCheckCircle  },
          { label: 'Inaktif',       value: stats.inactive, color: 'bg-amber-500', icon: MdPending      },
          { label: 'Imèl verifye',  value: stats.verified, color: 'bg-purple-600',icon: MdVerified     },
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

      {/* Filtre */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-60">
            <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Chèche pa non, imèl, biznis, vil..."
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white transition-colors" />
          </div>

          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select value={`${sortBy}_${sortDir}`} onChange={e => { const [k,d] = e.target.value.split('_'); setSortBy(k); setSortDir(d as 'asc'|'desc'); }}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            <option value="date_joined_desc">Dat rejis. (pi resan)</option>
            <option value="date_joined_asc">Dat rejis. (pi ansyen)</option>
            <option value="full_name_asc">Non (A-Z)</option>
          </select>

          <div className="flex gap-2">
            <button onClick={fetchPartners}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
              <MdRefresh size={18} />
            </button>
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
              <MdDownload size={16} /> CSV
            </button>
          </div>
        </div>
      </div>

      {/* Notifikasyon */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm">
          <MdWarning size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm">
          <MdCheckCircle size={16} /> {success}
        </div>
      )}

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">
            Patnè yo ({totalCount})
          </h3>
          <p className="text-xs text-slate-400">Paj {page}/{totalPages}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['#', 'Patnè', 'Kontakt', 'Lokalizasyon', 'Biznis', 'Sèvis', 'Estatistik', 'Statè', 'Dat Rejis.', 'Aksyon'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 bg-slate-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <MdPeople size={36} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Pa gen patnè pou filtre sa a.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(partner => (
                  <tr key={partner.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">#{partner.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#0000AA]/10 flex items-center justify-center text-[#0000AA] text-xs font-bold flex-shrink-0">
                          {partner.full_name?.[0] ?? '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{partner.full_name}</p>
                          {partner.email_verified
                            ? <span className="text-[10px] text-green-600 flex items-center gap-0.5"><MdVerified size={11} /> Verifye</span>
                            : <span className="text-[10px] text-amber-600 flex items-center gap-0.5"><MdPending size={11} /> Pa verifye</span>
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-600 flex items-center gap-1"><MdEmail size={12} /> {partner.email}</p>
                      {partner.phone && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MdPhone size={12} /> {partner.phone}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <MdLocationOn size={12} /> {partner.city || '—'}, {partner.country || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-slate-700">{partner.business_name || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {(partner.services || []).map((svc, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{svc}</span>
                        ))}
                        {(!partner.services || partner.services.length === 0) && <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>{partner.total_listings ?? 0} ofri</p>
                        <p>{partner.total_bookings ?? 0} rez.</p>
                        <p className="font-semibold text-green-700">HTG {(partner.total_earned ?? 0).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        partner.is_active
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {partner.is_active ? <MdCheckCircle size={12} /> : <MdBlock size={12} />}
                        {partner.is_active ? 'Aktif' : 'Bloke'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(partner.date_joined).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(partner)} title="Wè fich"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors">
                          <MdVisibility size={14} />
                        </button>
                        {!partner.email_verified && (
                          <button onClick={() => validatePartner(partner.id)} title="Valide"
                            className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors">
                            <MdVerified size={14} />
                          </button>
                        )}
                        <button onClick={() => toggleActive(partner.id, partner.is_active)}
                          title={partner.is_active ? 'Bloke' : 'Aktive'}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            partner.is_active
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                              : 'bg-green-50 hover:bg-green-100 text-green-600'
                          }`}>
                          {partner.is_active ? <MdLock size={14} /> : <MdLockOpen size={14} />}
                        </button>
                        <button onClick={() => setDeleteModal(partner.id)} title="Efase"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                          <MdDelete size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              {Math.min((page-1)*PER_PAGE+1, totalCount)}–{Math.min(page*PER_PAGE, totalCount)} sou {totalCount} patnè
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">
                ‹ Anvan
              </button>
              <span className="text-sm font-medium text-slate-700">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">
                Suivan ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ DRAWER — Fich patnè ═══ */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Fich Patnè</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Profil */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#0A0A2E] to-[#0000AA] rounded-2xl p-5">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {selected.full_name?.[0] ?? '?'}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{selected.full_name}</p>
                  {selected.business_name && <p className="text-sm text-white/60">{selected.business_name}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selected.is_active ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'
                    }`}>
                      {selected.is_active ? '● Aktif' : '● Bloke'}
                    </span>
                    {selected.email_verified && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/20 text-blue-300">
                        ✓ Verifye
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enfòmasyon kontak */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Enfòmasyon Kontak</p>
                <div className="space-y-2.5">
                  {[
                    { icon: MdEmail,        value: selected.email                                },
                    { icon: MdPhone,        value: selected.phone || 'Pa gen telefòn'            },
                    { icon: MdLocationOn,   value: `${selected.city || '—'}, ${selected.country || '—'}` },
                    { icon: MdCalendarToday,value: `Rejistre: ${new Date(selected.date_joined).toLocaleDateString('fr-FR')}` },
                  ].map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Icon size={16} className="text-slate-400 flex-shrink-0" />
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatistik */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Estatistik</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Ofri total',     value: selected.total_listings ?? 0   },
                    { label: 'Rezèvasyon',     value: selected.total_bookings ?? 0   },
                    { label: 'Revni total',    value: `HTG ${(selected.total_earned ?? 0).toLocaleString()}`    },
                    { label: 'Komisyon TRAPDE',value: `HTG ${(selected.commission_paid ?? 0).toLocaleString()}` },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3.5 text-center border border-slate-200">
                      <p className="text-base font-bold text-slate-900">{value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sèvis yo */}
              {selected.services && selected.services.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sèvis yo</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.services.map((svc, i) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#0000AA]/10 text-[#0000AA] border border-[#0000AA]/20">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Aksyon */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Aksyon Admin</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => toggleActive(selected.id, selected.is_active)} disabled={isUpdating}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors border-2 ${
                      selected.is_active
                        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>
                    {selected.is_active ? <><MdLock size={16} /> Dezaktive</> : <><MdLockOpen size={16} /> Aktive</>}
                  </button>
                  {!selected.email_verified && (
                    <button onClick={() => validatePartner(selected.id)} disabled={isUpdating}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors">
                      <MdVerified size={16} /> Valide
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <MdMessage size={16} /> Mesaj
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                    <MdNotifications size={16} /> Notifye
                  </button>
                  <button onClick={() => { setDeleteModal(selected.id); }}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <MdDelete size={16} /> Efase kont patnè a
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal efase */}
      {deleteModal !== null && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MdDelete size={28} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-2">Efase patnè a?</h3>
              <p className="text-sm text-slate-500 text-center mb-5">
                Tout done, ofri, ak istorik patnè sa a ap efase pou toujou. Aksyon sa irevèsib.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Anile
                </button>
                <button onClick={() => deletePartner(deleteModal)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                  Wi, efase l
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPartners;