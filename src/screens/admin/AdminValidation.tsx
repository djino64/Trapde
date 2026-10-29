/* eslint-disable @typescript-eslint/no-explicit-any, no-empty, no-empty-pattern, react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdCheckCircle, MdCancel, MdVisibility, MdRefresh,
  MdWarning, MdClose, MdComment,
  MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
  MdLocationOn, MdPerson, MdCalendarToday,
  MdPhoto,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface PendingListing {
  id:           number;
  name:         string;
  description:  string;
  service:      string;
  owner_name:   string;
  owner_email:  string;
  city:         string;
  country:      string;
  price:        number;
  price_label:  string;
  main_photo:   string | null;
  photos:      { id: number; image_url: string | null; is_main: boolean }[];
  photos_count: number;
  status:       string;
  created_at:   string;
  rejection_reason: string;
  address: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  surface_area: number | null;
  has_wifi: boolean;
  has_ac: boolean;
  has_kitchen: boolean;
  has_pool: boolean;
}

const SERVICE_CFG: Record<string,{label:string;icon:React.ElementType;color:string;bg:string;border:string}> = {
  lojman:   {label:'Lojman',    icon:MdBed,         color:'#0000AA',bg:'bg-blue-50',  border:'border-blue-200'  },
  travay:   {label:'Travay',    icon:MdWork,        color:'#16a34a',bg:'bg-green-50', border:'border-green-200' },
  vwayaj:   {label:'Vwayaj',   icon:MdFlight,      color:'#7c3aed',bg:'bg-violet-50',border:'border-violet-200'},
  mache:    {label:'Mache',    icon:MdShoppingBag, color:'#FF6600',bg:'bg-orange-50',border:'border-orange-200'},
  lokasyon: {label:'Lokasyon', icon:MdCarRental,   color:'#0891b2',bg:'bg-cyan-50',  border:'border-cyan-200'  },
};

const AdminValidation: React.FC = () => {
  const [listings, setListings]     = useState<PendingListing[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [selected, setSelected]     = useState<PendingListing | null>(null);
  const [commentModal, setCommentModal] = useState<number | null>(null);
  const [comment, setComment]       = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/accommodations/admin/', {
        params: { status: 'pending', ordering: '-created_at', page },
      });
      const data = response.data;
      const results = data.results || data;
      setListings(results.map((item: any) => ({
        ...item,
        service: 'lojman',
        price: Number(item.price_per_night || 0),
        price_label: 'nwit',
        owner_name: item.owner_name || '—',
        owner_email: item.owner_email || '—',
        photos: item.photos || [],
        photos_count: item.photos_count || 0,
        rejection_reason: item.rejection_reason || '',
      })));
      setTotalPages(
        Math.max(1, Math.ceil((data.count || 0) / PAGE_SIZE)),
      );
    } catch (requestError) {
      console.error('Unable to load accommodation approvals.', requestError);
      setError('Erè pandan chajman anonskman annatant yo.');
    } finally { setIsLoading(false); }
  }, [page]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3500);
  };

  const approve = async (id: number) => {
    setIsUpdating(true);
    try {
      await api.patch(`/accommodations/admin/${id}/status/`, {
        status: 'active',
      });
      setListings(p => p.filter(l => l.id !== id));
      if (selected?.id === id) setSelected(null);
      showSuccess('Anonskman apwouve.');
    } catch (requestError) {
      console.error('Unable to approve accommodation.', requestError);
      setError('Pa ka apwouve anonskman an.');
    }
    finally { setIsUpdating(false); }
  };

  const reject = async (id: number, notes: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/accommodations/admin/${id}/status/`, {
        status: 'rejected',
        rejection_reason: notes,
      });
      setListings(p => p.filter(l => l.id !== id));
      if (selected?.id === id) setSelected(null);
      setCommentModal(null);
      setComment('');
      showSuccess('Anonskman refize; rezon an anrejistre.');
    } catch (requestError) {
      console.error('Unable to reject accommodation.', requestError);
      setError('Pa ka refize anonskman an.');
    }
    finally { setIsUpdating(false); }
  };

  const requestChanges = async (id: number, notes: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/accommodations/admin/${id}/status/`, {
        status: 'draft',
        rejection_reason: notes,
      });
      setListings(p => p.filter(l => l.id !== id));
      if (selected?.id === id) setSelected(null);
      setCommentModal(null);
      setComment('');
      showSuccess('Demann modifikasyon anrejistre.');
    } catch (requestError) {
      console.error('Unable to request accommodation changes.', requestError);
      setError('Pa ka voye demann modifikasyon.');
    }
    finally { setIsUpdating(false); }
  };

  return (
    <AdminLayout title="Validasyon Anonskman — Kò de Kontwòl">

      {/* Bannè enpòtans */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <MdCheckCircle size={26} className="text-white"/>
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">Sant Validasyon</h2>
          <p className="text-sm text-white/80 mt-0.5">
            {listings.length} anonskman annatant revizyon ou.
            Chak anonskman nouvo bezwen apwobasyon ou anvan li parèt pou kliyan yo.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={fetchPending}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <MdRefresh size={18}/>
          </button>
        </div>
      </div>

      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={()=>setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      {/* Lis anonskman annatant */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({length:4}).map((_,i)=>(
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse space-y-3">
              <div className="flex gap-3">
                <div className="w-24 h-20 bg-slate-200 rounded-xl flex-shrink-0"/>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3"/>
                  <div className="h-3 bg-slate-200 rounded w-1/2"/>
                  <div className="h-3 bg-slate-200 rounded w-1/3"/>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-slate-200 rounded-xl"/>
                <div className="flex-1 h-10 bg-slate-200 rounded-xl"/>
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-20 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <MdCheckCircle size={32} className="text-green-500"/>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">Tout anonskman yo verifye!</h3>
          <p className="text-sm text-slate-400">Pa gen anonskman annatant pou revizyon kounye a.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {listings.map(listing => {
            const svc  = SERVICE_CFG[listing.service] || SERVICE_CFG.lojman;
            const Icon = svc.icon;
            return (
              <div key={listing.id}
                className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                <div className="flex gap-4 p-5">
                  {/* Foto */}
                  <div className="w-28 h-24 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative">
                    {listing.main_photo
                      ? <img src={listing.main_photo} alt={listing.name} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center"><Icon size={28} style={{color:svc.color+'40'}}/></div>
                    }
                    {listing.photos_count > 0 && (
                      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        <MdPhoto size={10}/>{listing.photos_count}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900 flex-1 line-clamp-1">{listing.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${svc.bg} ${svc.border}`}
                        style={{color:svc.color}}>{svc.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                      <MdPerson size={12}/>{listing.owner_name}
                    </p>
                    {listing.city && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-0.5">
                        <MdLocationOn size={12}/>{listing.city}, {listing.country}
                      </p>
                    )}
                    {listing.price > 0 && (
                      <p className="text-sm font-bold" style={{color:svc.color}}>
                        HTG {listing.price.toLocaleString()}
                        {listing.price_label && <span className="text-xs font-normal text-slate-400"> / {listing.price_label}</span>}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      <MdCalendarToday size={11} className="inline mr-0.5"/>
                      {new Date(listing.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Deskripsyon */}
                {listing.description && (
                  <div className="px-5 pb-3">
                    <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                      {listing.description}
                    </p>
                  </div>
                )}

                {/* Aksyon */}
                <div className="px-5 pb-5 grid grid-cols-3 gap-2">
                  <button onClick={() => setSelected(listing)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
                    <MdVisibility size={16}/> Wè
                  </button>
                  <button onClick={() => approve(listing.id)} disabled={isUpdating}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                    <MdCheckCircle size={16}/> Apwouve
                  </button>
                  <button onClick={() => { setCommentModal(listing.id); setComment(''); }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                    <MdCancel size={16}/> Refize
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(current => Math.max(1, current - 1))}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
          >
            Anvan
          </button>
          <span className="text-sm text-slate-600">
            Paj {page} sou {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(current => Math.min(totalPages, current + 1))}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
          >
            Apre
          </button>
        </div>
      )}

      {/* Drawer detay konplè */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)}/>
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Revizyon Anonskman</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18}/>
              </button>
            </div>
            <div className="p-6 space-y-5 flex-1">
              {/* Foto prensipal */}
              {selected.main_photo && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img src={selected.main_photo} alt={selected.name} className="w-full h-full object-cover"/>
                </div>
              )}
              {selected.photos?.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {selected.photos.filter(photo => photo.image_url).map(photo => (
                    <img
                      key={photo.id}
                      src={photo.image_url || undefined}
                      alt={selected.name}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Tit + Sèvis */}
              <div className="flex items-start gap-2">
                <h3 className="text-lg font-bold text-slate-900 flex-1">{selected.name}</h3>
                {(() => {
                  const svc = SERVICE_CFG[selected.service]||SERVICE_CFG.lojman;
                  return (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${svc.bg} ${svc.border}`}
                      style={{color:svc.color}}>{svc.label}</span>
                  );
                })()}
              </div>

              {/* Detay */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {label:'Patnè',    value:selected.owner_name},
                  {label:'Imèl',     value:selected.owner_email},
                  {label:'Lokalizasyon', value:`${selected.city||'—'}, ${selected.country||'—'}`},
                  {label:'Pri',      value:selected.price>0?`HTG ${selected.price.toLocaleString()}`:'—'},
                  {label:'Foto',     value:`${selected.photos_count} foto`},
                  {label:'Kalite lojman', value:selected.property_type || '—'},
                  {label:'Chanm / twalèt', value:`${selected.bedrooms} / ${selected.bathrooms}`},
                  {label:'Kapasite', value:`${selected.max_guests} moun`},
                  {label:'Sifas', value:selected.surface_area ? `${selected.surface_area} m²` : '—'},
                  {label:'Dat soumèt',value:new Date(selected.created_at).toLocaleDateString('fr-FR')},
                ].map(({label,value},i)=>(
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Deskripsyon */}
              {selected.description && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsyon</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-200 leading-relaxed">
                    {selected.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ekipman</p>
                <p className="text-sm text-slate-700">
                  {[
                    selected.has_wifi && 'Wi-Fi',
                    selected.has_ac && 'È-kondisyone',
                    selected.has_kitchen && 'Kwizin',
                    selected.has_pool && 'Pisin',
                  ].filter(Boolean).join(', ') || 'Pa gen ekipman make.'}
                </p>
                <p className="mt-2 text-sm text-slate-700">{selected.address}</p>
              </div>

              {/* Aksyon final */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Desizyon ou</p>
                <div className="space-y-2.5">
                  <button onClick={() => approve(selected.id)} disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                    <MdCheckCircle size={18}/> Apwouve anonskman an
                  </button>
                  <button onClick={() => { setCommentModal(selected.id); setComment(''); }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold border-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
                    <MdComment size={18}/> Mande modifikasyon
                  </button>
                  <button onClick={() => { setCommentModal(-(selected.id)); setComment(''); }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
                    <MdCancel size={18}/> Refize anonskman an
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal kòmantè */}
      {commentModal !== null && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"/>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                commentModal < 0 ? 'bg-red-100' : 'bg-amber-100'
              }`}>
                {commentModal < 0 ? <MdCancel size={28} className="text-red-500"/> : <MdComment size={28} className="text-amber-600"/>}
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-1">
                {commentModal < 0 ? 'Refize anonskman an' : 'Mande modifikasyon'}
              </h3>
              <p className="text-xs text-slate-500 text-center mb-4">
                Ekri yon rezon ki ap voye bay patnè a otomatikman.
              </p>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-amber-400 resize-none bg-slate-50"
                rows={4} placeholder="Ekri rezon ou eksplikasyon ou isit..."/>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setCommentModal(null); setComment(''); }}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600">Anile</button>
                <button
                  disabled={!comment.trim() || isUpdating}
                  onClick={() => {
                    const id      = Math.abs(commentModal);
                    const listing = listings.find(l => l.id === id) || selected;
                    if (!listing) return;
                    if (commentModal < 0) reject(id, comment);
                    else requestChanges(id, comment);
                  }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 ${
                    commentModal<0?'bg-red-500 hover:bg-red-600':'bg-amber-500 hover:bg-amber-600'
                  }`}>
                  {isUpdating ? 'Ap trete...' : commentModal<0 ? 'Refize' : 'Voye demann'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminValidation;