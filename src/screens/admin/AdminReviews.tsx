import React, { useState, useEffect, useCallback } from 'react';
import {
  MdStar, MdFlag, MdDelete, MdVisibility, MdClose,
  MdWarning, MdCheckCircle, MdRefresh, MdSearch,
  MdBlock,
  MdReport, MdShield,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

type TabType = 'reviews' | 'reports';

interface Review {
  id:               number;
  author_name:      string;
  author_email:     string;
  author_role:      string;
  accommodation_name: string;
  partner_name:     string;
  rating:           number;
  comment:          string;
  created_at:       string;
  status:           'visible' | 'hidden' | 'flagged';
  report_count:     number;
  is_spam:          boolean;
}

interface Report {
  id:           number;
  reporter_name:string;
  reporter_email:string;
  target_type:  'listing' | 'user' | 'review' | 'partner';
  target_name:  string;
  reason:       string;
  description:  string;
  status:       'open' | 'resolved' | 'dismissed';
  created_at:   string;
  priority:     'low' | 'medium' | 'high';
}

const PRIORITY_CFG = {
  low:    { label:'Ba',    color:'text-slate-600',  bg:'bg-slate-50 border-slate-200'   },
  medium: { label:'Mwayen',color:'text-amber-700',  bg:'bg-amber-50 border-amber-200'   },
  high:   { label:'Wo',   color:'text-red-700',    bg:'bg-red-50 border-red-200'       },
};

const REPORT_STATUS_CFG = {
  open:      { label:'Ouvè',   color:'text-blue-700',  bg:'bg-blue-50 border-blue-200'  },
  resolved:  { label:'Rezoud', color:'text-green-700', bg:'bg-green-50 border-green-200'},
  dismissed: { label:'Kase',   color:'text-slate-600', bg:'bg-slate-100 border-slate-200'},
};

const AdminReviews: React.FC = () => {
  const [tab, setTab]             = useState<TabType>('reviews');
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [reports, setReports]     = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [selected, setSelected]   = useState<Review | Report | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tab === 'reviews') {
        const res  = await api.get('/admin/reviews/');
        setReviews(res.data.results || res.data);
      } else {
        const res  = await api.get('/admin/reports/');
        setReports(res.data.results || res.data);
      }
    } catch { setReviews([]); setReports([]); }
    finally { setIsLoading(false); }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3500);
  };

  // ── Aksyon sou avi ──
  const hideReview = async (id: number) => {
    try {
      await api.patch(`/admin/reviews/${id}/`, { status: 'hidden' });
      setReviews(p => p.map(r => r.id === id ? { ...r, status: 'hidden' } : r));
      showSuccess('Avi kache avèk siksè.');
    } catch { setError('Pa ka kache avi a.'); }
  };

  const showReview = async (id: number) => {
    try {
      await api.patch(`/admin/reviews/${id}/`, { status: 'visible' });
      setReviews(p => p.map(r => r.id === id ? { ...r, status: 'visible' } : r));
      showSuccess('Avi montre ankò.');
    } catch { setError('Pa ka montre avi a.'); }
  };

  const deleteReview = async (id: number) => {
    try {
      await api.delete(`/admin/reviews/${id}/`);
      setReviews(p => p.filter(r => r.id !== id));
      if ((selected as Review)?.id === id) setSelected(null);
      showSuccess('Avi efase avèk siksè.');
    } catch { setError('Pa ka efase avi a.'); }
  };

  const markSpam = async (id: number) => {
    try {
      await api.patch(`/admin/reviews/${id}/`, { is_spam: true, status: 'hidden' });
      setReviews(p => p.map(r => r.id === id ? { ...r, is_spam: true, status: 'hidden' } : r));
      showSuccess('Avi mak kòm spam epi kache.');
    } catch { setError('Pa ka mak kòm spam.'); }
  };

  // ── Aksyon sou signalman ──
  const resolveReport = async (id: number) => {
    try {
      await api.patch(`/admin/reports/${id}/`, { status: 'resolved' });
      setReports(p => p.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
      showSuccess('Signalman rezoud avèk siksè.');
    } catch { setError('Pa ka rezoud signalman an.'); }
  };

  const dismissReport = async (id: number) => {
    try {
      await api.patch(`/admin/reports/${id}/`, { status: 'dismissed' });
      setReports(p => p.map(r => r.id === id ? { ...r, status: 'dismissed' } : r));
      showSuccess('Signalman kase.');
    } catch { setError('Pa ka kase signalman an.'); }
  };

  const deleteReport = async (id: number) => {
    try {
      await api.delete(`/admin/reports/${id}/`);
      setReports(p => p.filter(r => r.id !== id));
      if ((selected as Report)?.id === id) setSelected(null);
      showSuccess('Signalman efase.');
    } catch { setError('Pa ka efase signalman an.'); }
  };

  // ── Filtre ──
  const filteredReviews = reviews.filter(r => {
    if (filter === 'flagged') return r.report_count > 0;
    if (filter === 'hidden')  return r.status === 'hidden';
    if (filter === 'spam')    return r.is_spam;
    if (filter !== 'all')     return r.rating === +filter;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.author_name.toLowerCase().includes(q) ||
             r.accommodation_name.toLowerCase().includes(q) ||
             r.comment.toLowerCase().includes(q);
    }
    return true;
  }).filter(r => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.author_name.toLowerCase().includes(q) ||
             r.accommodation_name.toLowerCase().includes(q) ||
             r.comment.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredReports = reports.filter(r => {
    if (filter === 'open')     return r.status === 'open';
    if (filter === 'resolved') return r.status === 'resolved';
    if (filter === 'high')     return r.priority === 'high';
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.reporter_name.toLowerCase().includes(q) ||
             r.target_name.toLowerCase().includes(q) ||
             r.reason.toLowerCase().includes(q);
    }
    return true;
  }).filter(r => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.reporter_name.toLowerCase().includes(q) ||
             r.target_name.toLowerCase().includes(q) ||
             r.reason.toLowerCase().includes(q);
    }
    return true;
  });

  const reviewStats = {
    total:   reviews.length,
    flagged: reviews.filter(r => r.report_count > 0).length,
    hidden:  reviews.filter(r => r.status === 'hidden').length,
    spam:    reviews.filter(r => r.is_spam).length,
    avgRating: reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  const reportStats = {
    total:    reports.length,
    open:     reports.filter(r => r.status === 'open').length,
    high:     reports.filter(r => r.priority === 'high').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <MdStar key={i} size={14} className={i < rating ? 'text-amber-400' : 'text-slate-200'} />
      ))}
      <span className="text-xs font-bold text-slate-700 ml-1">{rating}/5</span>
    </div>
  );

  return (
    <AdminLayout title="Avi & Signalman">

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => { setTab('reviews'); setFilter('all'); setSearch(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            tab === 'reviews'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}>
          <MdStar size={16} /> Avi ({reviews.length})
        </button>
        <button onClick={() => { setTab('reports'); setFilter('all'); setSearch(''); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            tab === 'reports'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}>
          <MdFlag size={16} /> Signalman
          {reportStats.open > 0 && (
            <span className="ml-1 bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {reportStats.open}
            </span>
          )}
        </button>
      </div>

      {/* Stats */}
      {tab === 'reviews' ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total avi',    value: reviewStats.total,     color: 'bg-[#0000AA]', icon: MdStar    },
            { label: 'Mwayèn nòt',  value: `★ ${reviewStats.avgRating}`, color: 'bg-amber-500', icon: MdStar },
            { label: 'Signalman',   value: reviewStats.flagged,   color: 'bg-red-500',   icon: MdFlag    },
            { label: 'Kache',       value: reviewStats.hidden,    color: 'bg-slate-500', icon: MdBlock   },
            { label: 'Spam',        value: reviewStats.spam,      color: 'bg-orange-500',icon: MdShield  },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
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
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total signalman', value: reportStats.total,    color: 'bg-[#0000AA]', icon: MdFlag        },
            { label: 'Ouvè',            value: reportStats.open,     color: 'bg-red-500',   icon: MdReport      },
            { label: 'Priyorite wo',    value: reportStats.high,     color: 'bg-orange-500',icon: MdWarning     },
            { label: 'Rezoud',          value: reportStats.resolved, color: 'bg-green-600', icon: MdCheckCircle },
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
      )}

      {/* Filtre + Rechèch */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tab === 'reviews' ? 'Chèche avi yo...' : 'Chèche signalman yo...'}
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {tab === 'reviews' ? (
              [['all','Tout'],['flagged','Signale'],['hidden','Kache'],['spam','Spam'],['5','★5'],['4','★4'],['3','★3'],['2','★2'],['1','★1']].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    filter === v ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>{l}</button>
              ))
            ) : (
              [['all','Tout'],['open','Ouvè'],['high','Wo'],['resolved','Rezoud']].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    filter === v ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>{l}</button>
              ))
            )}
          </div>
          <button onClick={fetchData}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={()=>setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      {/* ── ONGLET AVI ── */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Avi yo ({filteredReviews.length})</h3>
          </div>
          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-1/4"/>
                    <div className="h-3 bg-slate-200 rounded w-1/2"/>
                    <div className="h-3 bg-slate-200 rounded w-3/4"/>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <MdStar size={36} className="text-slate-200 mx-auto mb-3"/>
              <p className="text-slate-400 text-sm">Pa gen avi pou filtre sa a.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReviews.map(review => (
                <div key={review.id}
                  className={`px-5 py-4 hover:bg-slate-50 transition-colors ${
                    review.status === 'hidden' ? 'opacity-60' : ''
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-bold flex-shrink-0">
                      {review.author_name?.[0] ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{review.author_name}</p>
                        {review.is_spam && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">SPAM</span>
                        )}
                        {review.status === 'hidden' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Kache</span>
                        )}
                        {review.report_count > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                            {review.report_count} signalman
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        {renderStars(review.rating)}
                        <span className="text-xs text-slate-400">· {review.accommodation_name}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-slate-400">
                        Patnè: {review.partner_name} · {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {review.status === 'visible'
                        ? <button onClick={() => hideReview(review.id)}
                            className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors" title="Kache">
                            <MdBlock size={15}/>
                          </button>
                        : <button onClick={() => showReview(review.id)}
                            className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors" title="Montre">
                            <MdVisibility size={15}/>
                          </button>
                      }
                      {!review.is_spam && (
                        <button onClick={() => markSpam(review.id)}
                          className="w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 transition-colors" title="Spam">
                          <MdShield size={15}/>
                        </button>
                      )}
                      <button onClick={() => deleteReview(review.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors" title="Efase">
                        <MdDelete size={15}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ONGLET SIGNALMAN ── */}
      {tab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Signalman yo ({filteredReports.length})</h3>
          </div>
          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-5 py-4 animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3"/>
                  <div className="h-3 bg-slate-200 rounded w-2/3"/>
                  <div className="h-3 bg-slate-200 rounded w-1/2"/>
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16">
              <MdFlag size={36} className="text-slate-200 mx-auto mb-3"/>
              <p className="text-slate-400 text-sm">Pa gen signalman pou filtre sa a.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReports.map(report => {
                const pcfg  = PRIORITY_CFG[report.priority] || PRIORITY_CFG.low;
                const scfg  = REPORT_STATUS_CFG[report.status] || REPORT_STATUS_CFG.open;
                return (
                  <div key={report.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MdFlag size={20} className="text-red-500"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-bold text-slate-900">{report.reason}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${pcfg.bg} ${pcfg.color}`}>
                            {pcfg.label}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${scfg.bg} ${scfg.color}`}>
                            {scfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">
                          <span className="font-medium">{report.reporter_name}</span> signale
                          <span className="font-semibold text-slate-700"> {report.target_name}</span>
                          <span className="text-slate-400"> ({report.target_type})</span>
                        </p>
                        {report.description && (
                          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100 mb-2 line-clamp-2">
                            {report.description}
                          </p>
                        )}
                        <p className="text-xs text-slate-400">
                          {new Date(report.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {report.status === 'open' && (
                          <>
                            <button onClick={() => resolveReport(report.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold transition-colors">
                              <MdCheckCircle size={14}/> Rezoud
                            </button>
                            <button onClick={() => dismissReport(report.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors">
                              <MdClose size={14}/> Kase
                            </button>
                          </>
                        )}
                        <button onClick={() => deleteReport(report.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                          <MdDelete size={15}/>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviews;