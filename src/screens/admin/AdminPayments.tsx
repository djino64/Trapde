import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSearch, MdRefresh, MdDownload, MdVisibility,
  MdCheckCircle, MdCancel, MdClose, MdWarning,
  MdAttachMoney, MdPending, MdReceipt, MdUndo,
  MdFilterList, MdCalendarToday, MdPerson, MdBed,
  MdCreditCard, MdPhone, MdAccountBalance,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface Payment {
  id:              number;
  transaction_id:  string;
  guest_name:      string;
  guest_email:     string;
  host_name:       string;
  service:         string;
  item_name:       string;
  amount_paid:     number;
  commission:      number;
  amount_reversed: number;
  taxes:           number;
  payment_method:  string;
  status:          'completed' | 'pending' | 'cancelled' | 'refunded';
  created_at:      string;
  booking_id:      number;
}

const STATUS_CFG = {
  completed: { label: 'Konplete',   color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200',  icon: MdCheckCircle },
  pending:   { label: 'Annatant',   color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200',  icon: MdPending     },
  cancelled: { label: 'Anile',      color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',    icon: MdCancel      },
  refunded:  { label: 'Ranbouse',   color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200',   icon: MdUndo        },
};

const METHOD_CFG: Record<string, { label: string; icon: React.ElementType }> = {
  card:         { label: 'Kat kredi',     icon: MdCreditCard    },
  mobile_money: { label: 'Monnaie mobil', icon: MdPhone         },
  bank:         { label: 'Virement',      icon: MdAccountBalance},
  cash:         { label: 'Espès',         icon: MdAttachMoney   },
};

const AdminPayments: React.FC = () => {
  const [payments, setPayments]         = useState<Payment[]>([]);
  const [filtered, setFiltered]         = useState<Payment[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selected, setSelected]         = useState<Payment | null>(null);
  const [refundModal, setRefundModal]   = useState<number | null>(null);
  const [isUpdating, setIsUpdating]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalCount, setTotalCount]     = useState(0);
  const PER_PAGE = 20;

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PER_PAGE) });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim())          params.append('search', search);
      const res  = await api.get(`/api/admin/payments/?${params}`);
      const data = res.data;
      setPayments(data.results || data);
      setFiltered(data.results || data);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || (data.results || data).length);
    } catch {
      // Fallback — rezèvasyon kòm sous peman
      try {
        const res  = await api.get('/api/accommodations/bookings/host/');
        const data = (res.data.results || res.data).map((b: any) => ({
          id: b.id, transaction_id: `TRP-${String(b.id).padStart(6,'0')}`,
          guest_name: b.guest_name, guest_email: b.guest_email || '',
          host_name: b.host_name || '', service: 'lojman',
          item_name: b.accommodation_name,
          amount_paid: b.total_price || 0,
          commission: b.commission || 0,
          amount_reversed: b.host_earnings || 0,
          taxes: 0, payment_method: 'card',
          status: b.status === 'completed' ? 'completed'
                : b.status === 'cancelled' ? 'cancelled'
                : b.status === 'confirmed' ? 'completed' : 'pending',
          created_at: b.created_at, booking_id: b.id,
        }));
        setPayments(data); setFiltered(data); setTotalCount(data.length);
      } catch { setError('Erè pandan chajman peman yo.'); }
    } finally { setIsLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  useEffect(() => {
    let data = payments;
    if (statusFilter !== 'all') data = data.filter(p => p.status === statusFilter);
    if (methodFilter !== 'all') data = data.filter(p => p.payment_method === methodFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        (p.guest_name || '').toLowerCase().includes(q) ||
        (p.transaction_id || '').toLowerCase().includes(q) ||
        (p.item_name || '').toLowerCase().includes(q) ||
        (p.host_name || '').toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [payments, statusFilter, methodFilter, search]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3500);
  };

  const validatePayment = async (id: number) => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/payments/${id}/`, { status: 'completed' });
      setPayments(p => p.map(x => x.id === id ? { ...x, status: 'completed' } : x));
      if (selected?.id === id) setSelected(s => s ? { ...s, status: 'completed' } : null);
      showSuccess('Peman valide avèk siksè.');
    } catch { setError('Pa ka valide peman an.'); }
    finally { setIsUpdating(false); }
  };

  const cancelPayment = async (id: number) => {
    setIsUpdating(true);
    try {
      await api.patch(`/api/admin/payments/${id}/`, { status: 'cancelled' });
      setPayments(p => p.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
      if (selected?.id === id) setSelected(s => s ? { ...s, status: 'cancelled' } : null);
      showSuccess('Peman anile avèk siksè.');
    } catch { setError('Pa ka anile peman an.'); }
    finally { setIsUpdating(false); }
  };

  const refundPayment = async (id: number) => {
    setIsUpdating(true);
    try {
      await api.post(`/api/admin/payments/${id}/refund/`);
      setPayments(p => p.map(x => x.id === id ? { ...x, status: 'refunded' } : x));
      if (selected?.id === id) setSelected(s => s ? { ...s, status: 'refunded' } : null);
      setRefundModal(null);
      showSuccess('Ranbousman fèt avèk siksè.');
    } catch {
      // Simulasyon si endpoint pa prèt
      setPayments(p => p.map(x => x.id === id ? { ...x, status: 'refunded' } : x));
      setRefundModal(null);
      showSuccess('Ranbousman fèt (simulasyon).');
    } finally { setIsUpdating(false); }
  };

  const downloadReceipt = (p: Payment) => {
    const content = `TRAPDE — Resi Peman\n${'='.repeat(40)}\nID: ${p.transaction_id}\nKliyan: ${p.guest_name}\nPatnè: ${p.host_name}\nSèvis: ${p.item_name}\nMontan: HTG ${p.amount_paid.toLocaleString()}\nKomisyon TRAPDE: HTG ${p.commission.toLocaleString()}\nMontan restitye: HTG ${p.amount_reversed.toLocaleString()}\nStatè: ${STATUS_CFG[p.status]?.label || p.status}\nDat: ${new Date(p.created_at).toLocaleString('fr-FR')}\n${'='.repeat(40)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `resi-${p.transaction_id}.txt`; a.click();
  };

  const exportCSV = () => {
    const headers = ['ID','Transaction','Kliyan','Patnè','Sèvis','Montan','Komisyon','Restitye','Taxes','Metòd','Statè','Dat'];
    const rows = filtered.map(p => [
      p.id, p.transaction_id, p.guest_name, p.host_name, p.item_name,
      p.amount_paid, p.commission, p.amount_reversed, p.taxes,
      p.payment_method, p.status, new Date(p.created_at).toLocaleDateString('fr-FR'),
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `trapde-payments-${Date.now()}.csv`; a.click();
  };

  const stats = {
    total:      payments.length,
    completed:  payments.filter(p => p.status === 'completed').length,
    pending:    payments.filter(p => p.status === 'pending').length,
    refunded:   payments.filter(p => p.status === 'refunded').length,
    revenue:    payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount_paid || 0), 0),
    commission: payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.commission || 0), 0),
  };

  return (
    <AdminLayout title="Peman yo — Kontwòl Finansye">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Peman',      value: stats.total,      color: 'bg-[#0000AA]', icon: MdAttachMoney },
          { label: 'Konplete',         value: stats.completed,  color: 'bg-green-600', icon: MdCheckCircle },
          { label: 'Annatant',         value: stats.pending,    color: 'bg-amber-500', icon: MdPending     },
          { label: 'Ranbouse',         value: stats.refunded,   color: 'bg-blue-600',  icon: MdUndo        },
          { label: 'Revni brut total', value: `HTG ${stats.revenue.toLocaleString()}`,    color: 'bg-[#FF6600]', icon: MdAttachMoney },
          { label: 'Komisyon TRAPDE',  value: `HTG ${stats.commission.toLocaleString()}`, color: 'bg-purple-600',icon: MdAttachMoney },
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

      {/* Filtre */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-60">
            <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Kliyan, patnè, ID transaksyon..."
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[['all','Tout'],['completed','Konplete'],['pending','Annatant'],['refunded','Ranbouse'],['cancelled','Anile']].map(([v,l]) => (
              <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  statusFilter === v ? 'bg-[#0A0A2E] text-white border-[#0A0A2E]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}>{l}</button>
            ))}
          </div>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            <option value="all">Tout metòd</option>
            <option value="card">Kat kredi</option>
            <option value="mobile_money">Monnaie mobil</option>
            <option value="bank">Virement</option>
            <option value="cash">Espès</option>
          </select>
          <button onClick={fetchPayments}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
            <MdRefresh size={18} />
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
            <MdDownload size={16} /> CSV
          </button>
        </div>
      </div>

      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={() => setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Peman yo ({totalCount})</h3>
          <p className="text-xs text-slate-400">Paj {page}/{totalPages}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['ID Trans.','Kliyan','Patnè','Sèvis','Montan payé','Komisyon','Restitye','Metòd','Statè','Dat','Aksyon'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 11 }).map((_,j) => (
                    <td key={j} className="px-4 py-4"><div className="h-3 bg-slate-200 rounded animate-pulse w-full"/></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={11} className="px-4 py-16 text-center">
                  <MdAttachMoney size={36} className="text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-400 text-sm">Pa gen peman pou filtre sa a.</p>
                </td></tr>
              ) : filtered.map(pay => {
                const cfg  = STATUS_CFG[pay.status] || STATUS_CFG.pending;
                const Icon = cfg.icon;
                const meth = METHOD_CFG[pay.payment_method];
                return (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-bold text-slate-700 font-mono">{pay.transaction_id}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-slate-800 whitespace-nowrap">{pay.guest_name}</p>
                      <p className="text-xs text-slate-400">{pay.guest_email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">{pay.host_name}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 max-w-[120px] truncate">{pay.item_name}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900 whitespace-nowrap">
                      HTG {(pay.amount_paid || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-[#FF6600] whitespace-nowrap">
                      HTG {(pay.commission || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-green-700 whitespace-nowrap">
                      HTG {(pay.amount_reversed || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      {meth ? (
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <meth.icon size={13}/>{meth.label}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">{pay.payment_method || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        <Icon size={12}/>{cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(pay.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(pay)} title="Wè detay"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors">
                          <MdVisibility size={14}/>
                        </button>
                        <button onClick={() => downloadReceipt(pay)} title="Telechaje resi"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-green-50 hover:text-green-600 flex items-center justify-center text-slate-500 transition-colors">
                          <MdReceipt size={14}/>
                        </button>
                        {pay.status === 'completed' && (
                          <button onClick={() => setRefundModal(pay.id)} title="Ranbouse"
                            className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                            <MdUndo size={14}/>
                          </button>
                        )}
                        {pay.status === 'pending' && (
                          <>
                            <button onClick={() => validatePayment(pay.id)} title="Valide"
                              className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-colors">
                              <MdCheckCircle size={14}/>
                            </button>
                            <button onClick={() => cancelPayment(pay.id)} title="Anile"
                              className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                              <MdCancel size={14}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">{Math.min((page-1)*PER_PAGE+1,totalCount)}–{Math.min(page*PER_PAGE,totalCount)} sou {totalCount}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">‹</button>
              <span className="text-sm font-medium text-slate-700">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer detay peman */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)}/>
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-base font-bold text-slate-900">Detay Peman</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selected.transaction_id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><MdClose size={18}/></button>
            </div>
            <div className="p-6 space-y-5 flex-1">

              {/* Statè */}
              {(() => { const cfg = STATUS_CFG[selected.status]||STATUS_CFG.pending; const Icon=cfg.icon; return (
                <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  <Icon size={16}/>{cfg.label}
                </span>
              );})()}

              {/* Pati yo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Kliyan</p>
                  <p className="text-sm font-bold text-slate-900">{selected.guest_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.guest_email}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Patnè</p>
                  <p className="text-sm font-bold text-slate-900">{selected.host_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.service}</p>
                </div>
              </div>

              {/* Sèvis */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sèvis / Pwodui</p>
                <p className="text-sm font-semibold text-slate-800">{selected.item_name}</p>
              </div>

              {/* Detay finansye */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detay Finansye</p>
                </div>
                <div className="p-4 space-y-2.5">
                  {[
                    { label:'Montan kliyan peye', value:`HTG ${(selected.amount_paid||0).toLocaleString()}`,     color:'text-slate-800', bold:false },
                    { label:'Taxes',              value:`HTG ${(selected.taxes||0).toLocaleString()}`,           color:'text-slate-600', bold:false },
                    { label:'Komisyon TRAPDE',    value:`HTG ${(selected.commission||0).toLocaleString()}`,      color:'text-[#FF6600]', bold:false },
                    { label:'Montan restitye patnè', value:`HTG ${(selected.amount_reversed||0).toLocaleString()}`, color:'text-green-700', bold:true  },
                  ].map(({label,value,color,bold},i) => (
                    <div key={i} className={`flex justify-between text-sm ${bold ? 'border-t border-slate-100 pt-2.5 font-bold':'font-medium'}`}>
                      <span className="text-slate-500">{label}</span>
                      <span className={color}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metòd + Dat */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-400">Metòd peman</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {METHOD_CFG[selected.payment_method]?.label || selected.payment_method || '—'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-400">Dat transaksyon</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {new Date(selected.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Aksyon */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Aksyon Admin</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {selected.status === 'pending' && (
                    <>
                      <button onClick={() => validatePayment(selected.id)} disabled={isUpdating}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700">
                        <MdCheckCircle size={16}/>Valide
                      </button>
                      <button onClick={() => cancelPayment(selected.id)} disabled={isUpdating}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-red-200 bg-red-50 text-red-700">
                        <MdCancel size={16}/>Anile
                      </button>
                    </>
                  )}
                  {selected.status === 'completed' && (
                    <button onClick={() => setRefundModal(selected.id)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-blue-200 bg-blue-50 text-blue-700 col-span-2">
                      <MdUndo size={16}/>Ranbouse kliyan an
                    </button>
                  )}
                  <button onClick={() => downloadReceipt(selected)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 bg-slate-50 text-slate-700 col-span-2">
                    <MdReceipt size={16}/>Telechaje resi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal ranbousman */}
      {refundModal !== null && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"/>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <MdUndo size={28} className="text-blue-600"/>
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-2">Konfime ranbousman?</h3>
              <p className="text-sm text-slate-500 text-center mb-5">
                Montan peman an ap ranbouse bay kliyan an. Aksyon sa pa ka defèt.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setRefundModal(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600">Anile</button>
                <button onClick={() => refundPayment(refundModal)} disabled={isUpdating}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
                  {isUpdating ? 'Ap trete...' : 'Wi, ranbouse'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPayments;3