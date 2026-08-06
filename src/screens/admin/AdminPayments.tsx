import React, { useState, useEffect } from 'react';
import {
  MdAttachMoney, MdSearch, MdRefresh, MdVisibility,
  MdDownload, MdClose, MdWarning, MdCheckCircle,
  MdPending, MdCancel, MdReceipt, MdFilterList,
  MdArrowForward, MdPerson, MdBusiness, MdCalendarToday,
  MdCreditCard, MdUndo,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface Payment {
  id:              number;
  guest_name:      string;
  guest_email:     string;
  host_name:       string;
  accommodation_name: string;
  service:         string;
  total_price:     number;
  commission:      number;
  host_earnings:   number;
  status:          'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  created_at:      string;
  check_in?:       string;
  check_out?:      string;
  total_nights?:   number;
}

const STATUS_CFG = {
  pending:   { label: 'Annatant',   icon: MdPending,     color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200'   },
  confirmed: { label: 'Konfime',    icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200'   },
  completed: { label: 'Konplete',   icon: MdCheckCircle, color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200'     },
  cancelled: { label: 'Anile',      icon: MdCancel,      color: 'text-red-600',   bg: 'bg-red-50 border-red-200'       },
  refunded:  { label: 'Ranbouse',   icon: MdUndo,        color: 'text-purple-600',bg: 'bg-purple-50 border-purple-200' },
};

const AdminPayments: React.FC = () => {
  const [payments, setPayments]     = useState<Payment[]>([]);
  const [filtered, setFiltered]     = useState<Payment[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]     = useState<Payment | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchPayments(); }, [page]);

  useEffect(() => {
    let data = payments;
    if (statusFilter !== 'all') data = data.filter(p => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.guest_name.toLowerCase().includes(q) ||
        p.host_name.toLowerCase().includes(q) ||
        p.accommodation_name.toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    }
    setFiltered(data);
  }, [payments, search, statusFilter]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res  = await api.get(`/api/admin/payments/?page=${page}`);
      setPayments(res.data.results || res.data);
      setTotalPages(res.data.total_pages || 1);
    } catch {
      try {
        const res  = await api.get('/api/accommodations/bookings/');
        setPayments(res.data.results || res.data);
      } catch { setError('Erè chajman peman yo.'); }
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/payments/${id}/`, { status });
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: status as Payment['status'] } : p));
      if (selected?.id === id) setSelected(p => p ? { ...p, status: status as Payment['status'] } : null);
    } catch { setError('Pa ka chanje statè a.'); }
    finally { setIsUpdating(false); }
  };

  const stats = {
    total:     payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending:   payments.filter(p => p.status === 'pending').length,
    totalRev:  payments.filter(p => ['confirmed','completed'].includes(p.status)).reduce((s, p) => s + p.total_price, 0),
    totalCom:  payments.filter(p => ['confirmed','completed'].includes(p.status)).reduce((s, p) => s + p.commission, 0),
  };

  return (
    <AdminLayout title="Jestyon Peman yo">

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Transaksyon', value: stats.total,                                         color: 'bg-[#0A0A2E]', icon: MdAttachMoney  },
          { label: 'Konplete',          value: stats.completed,                                     color: 'bg-green-600', icon: MdCheckCircle  },
          { label: 'Annatant',          value: stats.pending,                                       color: 'bg-amber-500', icon: MdPending      },
          { label: 'Revni Total',       value: `HTG ${stats.totalRev.toLocaleString()}`,            color: 'bg-[#FF6600]', icon: MdAttachMoney  },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
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
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-64">
          <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Chèche pa non kliyan, patnè, ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0000AA] shadow-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['all','Tout'],['pending','Annatant'],['confirmed','Konfime'],['completed','Konplete'],['cancelled','Anile'],['refunded','Ranbouse']].map(([v,l]) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                statusFilter === v ? 'bg-[#0A0A2E] text-white border-[#0A0A2E]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>{l}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50">
          <MdDownload size={16} /> Eksporte
        </button>
        <button onClick={fetchPayments}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <MdRefresh size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
          <MdWarning size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button>
        </div>
      )}

      {/* Tablo peman */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Tout Transaksyon yo ({filtered.length})</h3>
        </div>

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full" />
                <div className="h-5 w-24 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <MdAttachMoney size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Pa gen peman pou filtre sa a.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['#ID', 'Kliyan', 'Patnè / Sèvis', 'Montan', 'Komisyon', 'Patnè resevwa', 'Statè', 'Dat', 'Aksyon'].map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(pay => {
                  const cfg  = STATUS_CFG[pay.status] || STATUS_CFG.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">#{pay.id}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-slate-800">{pay.guest_name}</p>
                        <p className="text-xs text-slate-400">{pay.guest_email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-slate-700">{pay.host_name}</p>
                        <p className="text-xs text-slate-400">{pay.accommodation_name}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-bold text-slate-900">HTG {pay.total_price.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-[#FF6600]">HTG {pay.commission.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-green-700">HTG {pay.host_earnings.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                          <Icon size={12} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(pay.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(pay)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#0000AA] hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                            <MdVisibility size={15} />
                          </button>
                          {pay.status === 'confirmed' && (
                            <button onClick={() => updateStatus(pay.id, 'refunded')} title="Ranbouse"
                              className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-600 transition-colors">
                              <MdUndo size={15} />
                            </button>
                          )}
                          <button className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors" title="Telechaje reçu">
                            <MdReceipt size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={3} className="px-4 py-3 text-xs font-bold text-slate-700 uppercase">TOTAL</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">HTG {stats.totalRev.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#FF6600]">HTG {stats.totalCom.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-700">HTG {(stats.totalRev - stats.totalCom).toLocaleString()}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">Paj {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40">‹</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer detay peman */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Detay Peman #{selected.id}</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18} />
              </button>
            </div>
            <div className="p-5 space-y-5">
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
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kliyan</p>
                <p className="text-sm font-bold text-slate-900">{selected.guest_name}</p>
                <p className="text-xs text-slate-500">{selected.guest_email}</p>
              </div>

              {/* Patnè */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patnè</p>
                <p className="text-sm font-bold text-slate-900">{selected.host_name}</p>
                <p className="text-xs text-slate-500">{selected.accommodation_name}</p>
              </div>

              {/* Dat */}
              {selected.check_in && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400">Dat rive</p><p className="text-sm font-bold text-slate-900 mt-0.5">{selected.check_in}</p></div>
                  <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400">Dat pati</p><p className="text-sm font-bold text-slate-900 mt-0.5">{selected.check_out}</p></div>
                </div>
              )}

              {/* Pri */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Detay Finansye</p>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Total kliyan peye</span><span className="font-bold">HTG {selected.total_price.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Komisyon TRAPDE (10%)</span><span className="font-bold text-[#FF6600]">HTG {selected.commission.toLocaleString()}</span></div>
                  <div className="flex justify-between border-t border-slate-100 pt-2"><span className="text-sm font-bold text-slate-800">Patnè resevwa</span><span className="text-base font-bold text-green-700">HTG {selected.host_earnings.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Aksyon admin */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {selected.status === 'pending' && (
                  <button onClick={() => updateStatus(selected.id, 'confirmed')} disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
                    <MdCheckCircle size={18} /> Valide peman an
                  </button>
                )}
                {['pending','confirmed'].includes(selected.status) && (
                  <button onClick={() => updateStatus(selected.id, 'cancelled')} disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50">
                    <MdCancel size={18} /> Anile peman an
                  </button>
                )}
                {selected.status === 'confirmed' && (
                  <button onClick={() => updateStatus(selected.id, 'refunded')} disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-purple-200 bg-purple-50 text-purple-600 text-sm font-bold hover:bg-purple-100 transition-colors disabled:opacity-50">
                    <MdUndo size={18} /> Ranbouse kliyan an
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                  <MdReceipt size={18} /> Telechaje reçu
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPayments;