import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MdAdd, MdEdit, MdDelete, MdVisibility,
  MdCalendarToday, MdAttachMoney, MdCheckCircle, MdPending,
  MdClose, MdSearch, MdWarning, MdRefresh,
  MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
  MdPeople, MdStar, MdMessage, MdLocationOn,
} from 'react-icons/md';
import PartnerLayout from './PartnerLayout';
import api from '../../services/api';

// ─── Config pa sèvis ──────────────────────────────────────────────────────────
const SERVICE_CONFIG = {
  lojman: {
    label:     'Lojman',
    icon:      MdBed,
    color:     '#0000AA',
    bg:        'bg-blue-50',
    border:    'border-blue-200',
    apiBase:   'accommodations',
    addPath:   '/partner/lojman/create',
    viewPath:  '/accommodation',
    addLabel:  'Ajoute yon lojman',
    emptyMsg:  'Ou pako gen lojman. Kòmanse pibliye premye lojman w!',
    actions:   ['view', 'edit', 'toggle', 'delete'],
    cards: [
      { icon: MdCalendarToday, label: 'Rezèvasyon',   key: 'bookings'   },
      { icon: MdAttachMoney,   label: 'Revni',         key: 'revenue'    },
      { icon: MdVisibility,    label: 'Vizit',         key: 'views'      },
      { icon: MdStar,          label: 'Mwayèn nòt',   key: 'rating'     },
    ],
  },
  travay: {
    label:     'Travay',
    icon:      MdWork,
    color:     '#16a34a',
    bg:        'bg-green-50',
    border:    'border-green-200',
    apiBase:   '/api/jobs',
    addPath:   '/partner/travay/create',
    viewPath:  '/travay',
    addLabel:  'Pibliye ofri travay',
    emptyMsg:  'Ou pako gen ofri travay. Pibliye premye ofri w!',
    actions:   ['view', 'edit', 'toggle', 'delete'],
    cards: [
      { icon: MdPeople,        label: 'Kandida',      key: 'applicants' },
      { icon: MdCheckCircle,   label: 'Aksepte',      key: 'hired'      },
      { icon: MdVisibility,    label: 'Vizit',        key: 'views'      },
      { icon: MdCalendarToday, label: 'Aktif depi',   key: 'days_active'},
    ],
  },
  vwayaj: {
    label:     'Vwayaj',
    icon:      MdFlight,
    color:     '#7c3aed',
    bg:        'bg-violet-50',
    border:    'border-violet-200',
    apiBase:   '/api/travels',
    addPath:   '/partner/vwayaj/create',
    viewPath:  '/vwayaj',
    addLabel:  'Ajoute yon vwayaj',
    emptyMsg:  'Ou pako gen ofri vwayaj. Ajoute premye vwayaj ou!',
    actions:   ['view', 'edit', 'toggle', 'delete'],
    cards: [
      { icon: MdCalendarToday, label: 'Rezèvasyon',  key: 'bookings'   },
      { icon: MdPeople,        label: 'Pasaje',       key: 'passengers' },
      { icon: MdAttachMoney,   label: 'Revni',        key: 'revenue'    },
      { icon: MdVisibility,    label: 'Vizit',        key: 'views'      },
    ],
  },
  mache: {
    label:     'Mache anliy',
    icon:      MdShoppingBag,
    color:     '#FF6600',
    bg:        'bg-orange-50',
    border:    'border-orange-200',
    apiBase:   '/api/products',
    addPath:   '/partner/mache/create',
    viewPath:  '/mache',
    addLabel:  'Ajoute yon pwodui',
    emptyMsg:  'Ou pako gen pwodui. Ajoute premye pwodui ou!',
    actions:   ['view', 'edit', 'toggle', 'delete'],
    cards: [
      { icon: MdPeople,        label: 'Achète',       key: 'buyers'     },
      { icon: MdAttachMoney,   label: 'Vant total',   key: 'revenue'    },
      { icon: MdMessage,       label: 'Mesaj',        key: 'messages'   },
      { icon: MdVisibility,    label: 'Vizit',        key: 'views'      },
    ],
  },
  lokasyon: {
    label:     'Lokasyon',
    icon:      MdCarRental,
    color:     '#0891b2',
    bg:        'bg-cyan-50',
    border:    'border-cyan-200',
    apiBase:   '/api/rentals',
    addPath:   '/partner/lokasyon/create',
    viewPath:  '/lokasyon',
    addLabel:  'Ajoute yon lokasyon',
    emptyMsg:  'Ou pako gen lokasyon. Ajoute premye lokasyon ou!',
    actions:   ['view', 'edit', 'toggle', 'delete'],
    cards: [
      { icon: MdCalendarToday, label: 'Rezèvasyon',  key: 'bookings'   },
      { icon: MdAttachMoney,   label: 'Revni',        key: 'revenue'    },
      { icon: MdPeople,        label: 'Kliyan',       key: 'clients'    },
      { icon: MdVisibility,    label: 'Vizit',        key: 'views'      },
    ],
  },
} as const;

type ServiceKey = keyof typeof SERVICE_CONFIG;

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  active:   { label: 'Aktif',    color: 'text-green-700', bg: 'bg-green-50 border-green-200'  },
  draft:    { label: 'Bouyon',   color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200'  },
  inactive: { label: 'Inaktif', color: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' },
  open:     { label: 'Ouvè',    color: 'text-green-700', bg: 'bg-green-50 border-green-200'  },
  closed:   { label: 'Fèmen',   color: 'text-red-700',   bg: 'bg-red-50 border-red-200'      },
  sold:     { label: 'Vann',    color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200'    },
};

const PartnerServiceHub: React.FC = () => {
  const { service } = useParams<{ service: ServiceKey }>();
  const navigate    = useNavigate();

  const cfg = SERVICE_CONFIG[service as ServiceKey];
  if (!cfg) {
    navigate('/partner/dashboard');
    return null;
  }

  const [items, setItems]           = useState<any[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [stats, setStats]           = useState({ total: 0, active: 0, revenue: 0, views: 0 });

  const Icon = cfg.icon;

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pou lojman — endpoint egziste; lòt yo pral egziste
      if (service === 'lojman') {
        const res = await api.get('accommodations/mine/');
        const data = res.data.results || res.data;
        setItems(data);
        setStats({
          total:   data.length,
          active:  data.filter((i: any) => i.status === 'active').length,
          revenue: 0,
          views:   0,
        });
      } else {
        // Placeholder pou lòt sèvis yo
        setItems([]);
      }
    } catch {
      setError('Erè pandan chajman done yo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [service]);

  const filtered = items.filter(item =>
    !search.trim() ||
    (item.name || item.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const endpoint = service === 'lojman'
        ? `accommodations/${id}/manage/`
        : `${cfg.apiBase}/${id}/`;
      await api.delete(endpoint);
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteModal(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Pa ka efase item sa a.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const endpoint = service === 'lojman'
        ? `accommodations/${id}/manage/`
        : `${cfg.apiBase}/${id}/`;
      await api.patch(endpoint, { status: newStatus });
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    } catch {
      setError('Pa ka chanje statè a.');
    }
  };

  const getItemName = (item: any) => item.name || item.title || `Item #${item.id}`;
  const getItemSub  = (item: any) => {
    if (item.city) return `${item.city}, ${item.country || 'HT'}`;
    if (item.location) return item.location;
    if (item.job_type) return item.job_type;
    if (item.category) return item.category;
    return '';
  };
  const getItemPrice = (item: any) => {
    if (item.price_per_night) return `HTG ${Number(item.price_per_night).toLocaleString()}/nwit`;
    if (item.price_per_day)   return `HTG ${Number(item.price_per_day).toLocaleString()}/jou`;
    if (item.price)           return `HTG ${Number(item.price).toLocaleString()}`;
    if (item.salary_min)      return `HTG ${Number(item.salary_min).toLocaleString()}+`;
    return '';
  };

  return (
    <PartnerLayout title={cfg.label} activeService={service as ServiceKey}>

      {/* Header bannè */}
      <div className={`rounded-2xl p-5 mb-6 border-2 ${cfg.border} ${cfg.bg}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Icon size={26} style={{ color: cfg.color }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{cfg.label}</h2>
              <p className="text-sm text-slate-500">
                {stats.total} ofri · {stats.active} aktif
              </p>
            </div>
          </div>
          <button onClick={() => navigate(cfg.addPath)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: cfg.color }}>
            <MdAdd size={18} /> {cfg.addLabel}
          </button>
        </div>
      </div>

      {/* Kart aksyon rapid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cfg.cards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
              style={{ backgroundColor: cfg.color + '15' }}>
              <card.icon size={18} style={{ color: cfg.color }} />
            </div>
            <p className="text-xl font-bold text-slate-900">—</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Aksyon rapid kart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            icon: MdAdd, label: cfg.addLabel,
            path: cfg.addPath, primary: true,
          },
          {
            icon: MdCalendarToday, label: 'Rezèvasyon yo',
            path: `/partner/${service}/bookings`, primary: false,
          },
          {
            icon: MdMessage, label: 'Mesaj & Notif',
            path: `/partner/${service}/messages`, primary: false,
          },
          {
            icon: MdAttachMoney, label: 'Revni',
            path: '/partner/revenue', primary: false,
          },
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(action.path)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              action.primary
                ? 'text-white shadow-sm hover:opacity-90'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-sm'
            }`}
            style={action.primary ? { backgroundColor: cfg.color } : {}}>
            <action.icon size={18} className="flex-shrink-0" />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Lis ofri yo */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Ofri yo ({items.length})</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Chèche..."
                className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#0000AA] w-48" />
            </div>
            <button onClick={fetchItems}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
              <MdRefresh size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
            <MdWarning size={16} /> {error}
            <button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button>
          </div>
        )}

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                <div className="w-24 h-20 bg-slate-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: cfg.color + '15' }}>
              <Icon size={30} style={{ color: cfg.color }} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">
              {search ? 'Pa gen rezilta' : `Pa gen ${cfg.label.toLowerCase()} ankò`}
            </h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
              {search ? 'Eseye yon lòt rechèch.' : cfg.emptyMsg}
            </p>
            {!search && (
              <button onClick={() => navigate(cfg.addPath)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: cfg.color }}>
                <MdAdd size={18} /> {cfg.addLabel}
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(item => {
              const sCfg   = STATUS_CFG[item.status] || STATUS_CFG.draft;
              const name   = getItemName(item);
              const sub    = getItemSub(item);
              const price  = getItemPrice(item);
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  {/* Foto / Ikòn */}
                  <div className="w-24 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {item.main_photo ? (
                      <img src={item.main_photo} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon size={24} style={{ color: cfg.color + '60' }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${sCfg.bg} ${sCfg.color}`}>
                        {sCfg.label}
                      </span>
                    </div>
                    {sub && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                        <MdLocationOn size={12} /> {sub}
                      </p>
                    )}
                    {price && (
                      <p className="text-sm font-bold" style={{ color: cfg.color }}>{price}</p>
                    )}
                  </div>

                  {/* Aksyon */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`${cfg.viewPath}/${item.id}`}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                      <MdVisibility size={16} />
                    </Link>
                    <Link to={`/partner/${service}/${item.id}/edit`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-80"
                      style={{ backgroundColor: cfg.color + '20', color: cfg.color }}>
                      <MdEdit size={16} />
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        item.status === 'active'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                          : 'bg-green-50 hover:bg-green-100 text-green-600'
                      }`}>
                      {item.status === 'active' ? <MdPending size={16} /> : <MdCheckCircle size={16} />}
                    </button>
                    <button onClick={() => setDeleteModal(item.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal efase */}
      {deleteModal !== null && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => !isDeleting && setDeleteModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MdDelete size={24} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-2">Efase ofri sa a?</h3>
              <p className="text-sm text-slate-500 text-center mb-5">
                Aksyon sa pa ka defèt. Tout done yo ap efase pou toujou.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)} disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  Anile
                </button>
                <button onClick={() => handleDelete(deleteModal)} disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                  {isDeleting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isDeleting ? 'Efase...' : 'Wi, efase l'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </PartnerLayout>
  );
};

export default PartnerServiceHub;