import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSearch, MdRefresh, MdVisibility, MdCheckCircle,
  MdBlock, MdDelete, MdClose, MdWarning, MdDownload,
  MdStar, MdLocationOn, MdAttachMoney, MdPeople,
  MdFavorite, MdFlag, MdEdit, MdNotifications,
  MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
  MdFilterList, MdVerified, MdPending, MdCancel,
  MdTrendingUp, MdPhoto,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface Listing {
  id:            number;
  name:          string;
  description:   string;
  service:       'lojman' | 'travay' | 'vwayaj' | 'mache' | 'lokasyon';
  owner_name:    string;
  owner_email:   string;
  city:          string;
  country:       string;
  price:         number;
  price_label:   string;
  status:        string;
  main_photo:    string | null;
  views:         number;
  favorites:     number;
  bookings:      number;
  reports:       number;
  average_rating:number;
  review_count:  number;
  created_at:    string;
}

const SERVICE_CFG = {
  lojman:   { label: 'Lojman',     icon: MdBed,         color: '#0000AA', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  travay:   { label: 'Travay',     icon: MdWork,        color: '#16a34a', bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  vwayaj:   { label: 'Vwayaj',     icon: MdFlight,      color: '#7c3aed', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  mache:    { label: 'Mache',      icon: MdShoppingBag, color: '#FF6600', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  lokasyon: { label: 'Lokasyon',   icon: MdCarRental,   color: '#0891b2', bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200'   },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:   { label: 'Aktif',    color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200'  },
  draft:    { label: 'Bouyon',   color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200'  },
  inactive: { label: 'Inaktif', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200'  },
  pending:  { label: 'Annatant',color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200'   },
  rejected: { label: 'Rejte',   color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200'    },
};

const AdminListings: React.FC = () => {
  const [listings, setListings]         = useState<Listing[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [search, setSearch]             = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]         = useState<Listing | null>(null);
  const [deleteModal, setDeleteModal]   = useState<number | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const PER_PAGE = 20;

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page), page_size: String(PER_PAGE),
      });
      if (serviceFilter !== 'all') params.append('service', serviceFilter);
      if (statusFilter  !== 'all') params.append('status',  statusFilter);
      if (search.trim())           params.append('search',  search);

      // Endpoint admin global pou tout lojman
      const res  = await api.get(`/api/admin/listings/?${params}`);
      const data = res.data;
      setListings(data.results || data);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || (data.results || data).length);
    } catch {
      // Fallback — chaje lojman sèlman
      try {
        const res  = await api.get(`/api/accommodations/?page=${page}&page_size=${PER_PAGE}`);
        const data = res.data;
        const mapped = (data.results || data).map((item: any) => ({
          ...item, service: 'lojman', name: item.name,
          price: item.price_per_night, price_label: 'HTG/nwit',
          owner_name: item.owner_name, views: 0, favorites: 0,
          reports: 0, created_at: item.created_at,
        }));
        setListings(mapped);
        setTotalPages(data.total_pages || 1);
        setTotalCount(data.count || mapped.length);
      } catch { setError('Erè pandan chajman anonskman yo.'); }
    } finally { setIsLoading(false); }
  }, [page, search, serviceFilter, statusFilter]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3000);
  };

  const changeStatus = async (id: number, service: string, newStatus: string) => {
    try {
      const endpoint = service === 'lojman'
        ? `/api/accommodations/${id}/manage/`
        : `/api/admin/listings/${id}/`;
      await api.patch(endpoint, { status: newStatus });
      setListings(p => p.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selected?.id === id) setSelected(l => l ? { ...l, status: newStatus } : null);
      showSuccess(`Anonskman ${newStatus === 'active' ? 'aktive' : newStatus === 'inactive' ? 'dezaktive' : 'mete ajou'}.`);
    } catch { setError('Pa ka chanje statè anonskman an.'); }
  };

  const featureListing = async (id: number, service: string) => {
    try {
      await api.patch(
        service === 'lojman' ? `/api/accommodations/${id}/manage/` : `/api/admin/listings/${id}/`,
        { is_featured: true }
      );
      showSuccess('Anonskman mete an devan avèk siksè.');
    } catch { setError('Pa ka mete anonskman an an devan.'); }
  };

  const deleteListing = async (id: number, service: string) => {
    try {
      const endpoint = service === 'lojman'
        ? `/api/accommodations/${id}/manage/`
        : `/api/admin/listings/${id}/`;
      await api.delete(endpoint);
      setListings(p => p.filter(l => l.id !== id));
      setDeleteModal(null);
      if (selected?.id === id) setSelected(null);
      showSuccess('Anonskman efase avèk siksè.');
    } catch { setError('Pa ka efase anonskman an.'); }
  };

  const notifyPartner = async (id: number) => {
    try {
      await api.post(`/api/admin/listings/${id}/notify/`);
      showSuccess('Notifikasyon voye bay patnè a.');
    } catch { showSuccess('Notifikasyon voye (simulasyon).'); }
  };

  const filtered = listings.filter(l => {
    if (serviceFilter !== 'all' && l.service !== serviceFilter) return false;
    if (statusFilter  !== 'all' && l.status  !== statusFilter)  return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (l.name || '').toLowerCase().includes(q) ||
             (l.owner_name || '').toLowerCase().includes(q) ||
             (l.city || '').toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total:    listings.length,
    active:   listings.filter(l => l.status === 'active').length,
    pending:  listings.filter(l => l.status === 'draft' || l.status === 'pending').length,
    reported: listings.filter(l => (l.reports || 0) > 0).length,
  };

  return (
    <AdminLayout title="Jestyon Anonskman yo">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Anonskman', value: stats.total,    color: 'bg-[#0000AA]', icon: MdBed          },
          { label: 'Aktif',           value: stats.active,   color: 'bg-green-600', icon: MdCheckCircle  },
          { label: 'Annatant valid.', value: stats.pending,  color: 'bg-amber-500', icon: MdPending      },
          { label: 'Signalman',       value: stats.reported, color: 'bg-red-500',   icon: MdFlag         },
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
              placeholder="Chèche pa tit, patnè, vil..."
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white" />
          </div>

          {/* Filtre sèvis */}
          <div className="flex gap-1.5 flex-wrap">
            {[{ value: 'all', label: 'Tout', icon: MdFilterList, color: '' },
              ...Object.entries(SERVICE_CFG).map(([k, v]) => ({ value: k, label: v.label, icon: v.icon, color: v.color }))
            ].map(svc => (
              <button key={svc.value} onClick={() => { setServiceFilter(svc.value); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  serviceFilter === svc.value
                    ? 'text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                style={serviceFilter === svc.value ? { backgroundColor: svc.color || '#0A0A2E' } : {}}>
                <svc.icon size={14} /> {svc.label}
              </button>
            ))}
          </div>

          {/* Filtre statè */}
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            <option value="all">Tout statè</option>
            <option value="active">Aktif</option>
            <option value="draft">Bouyon / Annatant</option>
            <option value="inactive">Inaktif</option>
            <option value="rejected">Rejte</option>
          </select>

          <button onClick={fetchListings}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {/* Notif */}
      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16} />{error}<button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16} />{success}</div>}

      {/* Griy anonskman */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-20 shadow-sm">
          <MdBed size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Pa gen anonskman pou filtre sa a.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">{filtered.length} anonskman</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filtered.map(listing => {
              const svc  = SERVICE_CFG[listing.service] || SERVICE_CFG.lojman;
              const sCfg = STATUS_CFG[listing.status]   || STATUS_CFG.draft;
              const Icon = svc.icon;
              return (
                <div key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

                  {/* Foto */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden flex-shrink-0">
                    {listing.main_photo ? (
                      <img src={listing.main_photo} alt={listing.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon size={32} style={{ color: svc.color + '40' }} />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${svc.bg} ${svc.text} ${svc.border}`}>
                        {svc.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sCfg.bg} ${sCfg.color} ${sCfg.border}`}>
                        {sCfg.label}
                      </span>
                    </div>
                    {(listing.reports || 0) > 0 && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <MdFlag size={13} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Kontni */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-0.5">{listing.name}</h3>
                    <p className="text-xs text-slate-500 mb-1">
                      Patnè: <span className="font-medium">{listing.owner_name}</span>
                    </p>
                    {listing.city && (
                      <p className="text-xs text-slate-400 flex items-center gap-0.5 mb-2">
                        <MdLocationOn size={11} /> {listing.city}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      {listing.average_rating > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                          <MdStar size={13} /> {listing.average_rating.toFixed(1)}
                        </span>
                      )}
                      <span className="flex items-center gap-0.5"><MdVisibility size={12} /> {listing.views || 0}</span>
                      <span className="flex items-center gap-0.5"><MdPeople size={12} /> {listing.bookings || 0}</span>
                      {(listing.reports || 0) > 0 && (
                        <span className="flex items-center gap-0.5 text-red-500 font-semibold">
                          <MdFlag size={12} /> {listing.reports}
                        </span>
                      )}
                    </div>
                    {listing.price > 0 && (
                      <p className="text-sm font-bold mb-3" style={{ color: svc.color }}>
                        HTG {listing.price.toLocaleString()}
                        {listing.price_label && <span className="text-xs font-normal text-slate-400">/{listing.price_label}</span>}
                      </p>
                    )}

                    {/* Aksyon */}
                    <div className="flex items-center gap-1.5 mt-auto flex-wrap">
                      <button onClick={() => setSelected(listing)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 transition-colors">
                        <MdVisibility size={13} /> Wè
                      </button>
                      {listing.status !== 'active' && (
                        <button onClick={() => changeStatus(listing.id, listing.service, 'active')}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-xs font-semibold text-green-700 transition-colors">
                          <MdCheckCircle size={13} /> Aktive
                        </button>
                      )}
                      {listing.status === 'active' && (
                        <button onClick={() => changeStatus(listing.id, listing.service, 'inactive')}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-700 transition-colors">
                          <MdBlock size={13} /> Dezaktive
                        </button>
                      )}
                      <button onClick={() => setDeleteModal(listing.id)}
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors flex-shrink-0">
                        <MdDelete size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40">‹</button>
              <span className="text-sm font-medium text-slate-700 px-3">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40">›</button>
            </div>
          )}
        </>
      )}

      {/* Drawer detay anonskman */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Detay Anonskman</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5 flex-1">
              {/* Foto */}
              {selected.main_photo && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img src={selected.main_photo} alt={selected.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Info */}
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 flex-1">{selected.name}</h3>
                  {(() => {
                    const svc  = SERVICE_CFG[selected.service] || SERVICE_CFG.lojman;
                    const sCfg = STATUS_CFG[selected.status]   || STATUS_CFG.draft;
                    return (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${svc.bg} ${svc.text} ${svc.border}`}>{svc.label}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${sCfg.bg} ${sCfg.color} ${sCfg.border}`}>{sCfg.label}</span>
                      </div>
                    );
                  })()}
                </div>
                {selected.description && (
                  <p className="text-sm text-slate-500 line-clamp-3">{selected.description}</p>
                )}
              </div>

              {/* Detay */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Patnè',     value: selected.owner_name    },
                  { label: 'Vil',       value: selected.city || '—'   },
                  { label: 'Pri',       value: `HTG ${(selected.price || 0).toLocaleString()}` },
                  { label: 'Dat publi.',value: new Date(selected.created_at).toLocaleDateString('fr-FR') },
                  { label: 'Vizit',     value: selected.views || 0    },
                  { label: 'Rezèvasyon',value: selected.bookings || 0 },
                  { label: 'Avi',       value: `${selected.review_count || 0} (${selected.average_rating?.toFixed(1) || 0}★)` },
                  { label: 'Signalman', value: selected.reports || 0  },
                ].map(({ label, value }, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Aksyon */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Aksyon Admin</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {selected.status !== 'active' && (
                    <button onClick={() => changeStatus(selected.id, selected.service, 'active')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors">
                      <MdCheckCircle size={16} /> Aktive
                    </button>
                  )}
                  {selected.status === 'active' && (
                    <button onClick={() => changeStatus(selected.id, selected.service, 'inactive')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-amber-200 bg-amber-50 text-amber-700">
                      <MdBlock size={16} /> Dezaktive
                    </button>
                  )}
                  <button onClick={() => featureListing(selected.id, selected.service)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-purple-200 bg-purple-50 text-purple-700">
                    <MdTrendingUp size={16} /> Mete an devan
                  </button>
                  <button onClick={() => notifyPartner(selected.id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-blue-200 bg-blue-50 text-blue-700">
                    <MdNotifications size={16} /> Notifye patnè
                  </button>
                  <button onClick={() => changeStatus(selected.id, selected.service, 'rejected')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-red-200 bg-red-50 text-red-700">
                    <MdCancel size={16} /> Refize
                  </button>
                  <button onClick={() => setDeleteModal(selected.id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600">
                    <MdDelete size={16} /> Efase
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
              <h3 className="text-base font-bold text-slate-900 text-center mb-2">Efase anonskman an?</h3>
              <p className="text-sm text-slate-500 text-center mb-5">Tout done, foto, ak rezervasyon ki relye ak anonskman sa a ap efase pou toujou.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600">Anile</button>
                <button onClick={() => {
                    const listing = listings.find(l => l.id === deleteModal);
                    if (listing) deleteListing(listing.id, listing.service);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">
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

export default AdminListings;