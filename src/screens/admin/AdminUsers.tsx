import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSearch, MdPerson, MdEmail, MdPhone, MdLocationOn,
  MdCalendarToday, MdVisibility, MdBlock, MdDelete,
  MdCheckCircle, MdClose, MdWarning, MdRefresh,
  MdDownload, MdLock, MdLockOpen, MdVerified, MdPending,
  MdNotifications, MdMessage, MdHistory, MdStar,
  MdPayment,
  MdAttachMoney,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface User {
  id:             number;
  email:          string;
  first_name:     string;
  last_name:      string;
  full_name:      string;
  phone:          string;
  role:           string;
  city:           string;
  country:        string;
  is_active:      boolean;
  email_verified: boolean;
  date_joined:    string;
  last_login:     string | null;
  avatar_url:     string | null;
  total_bookings: number;
  total_spent:    number;
  total_reviews:  number;
  total_reports:  number;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers]             = useState<User[]>([]);
  const [filtered, setFiltered]       = useState<User[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy]           = useState('date_joined_desc');
  const [selected, setSelected]       = useState<User | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isUpdating, setIsUpdating]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState<string | null>(null);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const PER_PAGE = 20;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [k, d] = sortBy.split('_desc').length > 1
        ? [sortBy.replace('_desc',''), 'desc']
        : [sortBy.replace('_asc',''), 'asc'];
      const params = new URLSearchParams({
        role: 'user', page: String(page), page_size: String(PER_PAGE),
        ordering: `${d === 'desc' ? '-' : ''}${k}`,
      });
      if (statusFilter !== 'all') params.append('is_active', String(statusFilter === 'active'));
      if (search.trim()) params.append('search', search);
      const res  = await api.get(`/admin/users/?${params}`);
      const data = res.data;
      setUsers(data.results || data);
      setFiltered(data.results || data);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || (data.results || data).length);
    } catch {
      setError('Erè pandan chajman itilizatè yo.');
      setUsers([]); setFiltered([]);
    } finally { setIsLoading(false); }
  }, [page, search, statusFilter, sortBy]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3000);
  };

  const toggleActive = async (id: number, current: boolean) => {
    setIsUpdating(true);
    try {
      await api.patch(`/admin/users/${id}/`, { is_active: !current });
      setUsers(p => p.map(u => u.id === id ? { ...u, is_active: !current } : u));
      setFiltered(p => p.map(u => u.id === id ? { ...u, is_active: !current } : u));
      if (selected?.id === id) setSelected(u => u ? { ...u, is_active: !current } : null);
      showSuccess(!current ? 'Kont aktive avèk siksè.' : 'Kont bloke avèk siksè.');
    } catch { setError('Pa ka chanje statè kont lan.'); }
    finally { setIsUpdating(false); }
  };

  const resetPassword = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/reset-password/`);
      showSuccess('Imèl reyinisyalizasyon modpas voye avèk siksè.');
    } catch { setError('Pa ka voye imèl reyinisyalizasyon.'); }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/admin/users/${id}/`);
      setUsers(p => p.filter(u => u.id !== id));
      setFiltered(p => p.filter(u => u.id !== id));
      setDeleteModal(null);
      if (selected?.id === id) setSelected(null);
      showSuccess('Itilizatè efase avèk siksè.');
    } catch { setError('Pa ka efase itilizatè a.'); }
  };

  const exportCSV = () => {
    const headers = ['ID','Non','Imèl','Telefòn','Vil','Peyi','Aktif','Dat Rejis.'];
    const rows = filtered.map(u => [
      u.id, u.full_name, u.email, u.phone || '',
      u.city || '', u.country || '',
      u.is_active ? 'Wi' : 'Non',
      new Date(u.date_joined).toLocaleDateString('fr-FR'),
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `trapde-users-${Date.now()}.csv`; a.click();
  };

  const stats = {
    total:    users.length,
    active:   users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    verified: users.filter(u => u.email_verified).length,
  };

  return (
    <AdminLayout title="Jestyon Itilizatè yo">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Itilizatè', value: stats.total,    color: 'bg-[#0000AA]', icon: MdPerson       },
          { label: 'Aktif',           value: stats.active,   color: 'bg-green-600', icon: MdCheckCircle  },
          { label: 'Bloke',           value: stats.inactive, color: 'bg-red-500',   icon: MdBlock        },
          { label: 'Imèl verifye',    value: stats.verified, color: 'bg-purple-600',icon: MdVerified     },
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
              placeholder="Chèche pa non, imèl, vil..."
              className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white transition-colors" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            <option value="all">Tout statè</option>
            <option value="active">Aktif sèlman</option>
            <option value="inactive">Bloke sèlman</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] cursor-pointer">
            <option value="date_joined_desc">Dat rejis. (pi resan)</option>
            <option value="date_joined_asc">Dat rejis. (pi ansyen)</option>
            <option value="full_name_asc">Non (A-Z)</option>
          </select>
          <button onClick={fetchUsers}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <MdRefresh size={18} />
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
            <MdDownload size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Notifikasyon */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
          <MdWarning size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><MdClose size={15} /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
          <MdCheckCircle size={16} /> {success}
        </div>
      )}

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Itilizatè yo ({totalCount})</h3>
          <p className="text-xs text-slate-400">Paj {page}/{totalPages}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['#','Itilizatè','Kontakt','Lokalizasyon','Aktivite','Estatistik','Statè','Dat Rejis.','Aksyon'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 bg-slate-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-16 text-center">
                  <MdPerson size={36} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Pa gen itilizatè pou filtre sa a.</p>
                </td></tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">#{user.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.full_name?.[0] ?? '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
                          {user.email_verified
                            ? <span className="text-[10px] text-green-600 flex items-center gap-0.5"><MdVerified size={11} /> Imèl verifye</span>
                            : <span className="text-[10px] text-amber-600 flex items-center gap-0.5"><MdPending size={11} /> Pa verifye</span>
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-600 flex items-center gap-1"><MdEmail size={12} /> {user.email}</p>
                      {user.phone && <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MdPhone size={12} /> {user.phone}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <MdLocationOn size={12} /> {user.city || '—'}, {user.country || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-400">
                        Dènye: {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>{user.total_bookings ?? 0} rezèvasyon</p>
                        <p className="font-semibold text-green-700">HTG {(user.total_spent ?? 0).toLocaleString()}</p>
                        <p>{user.total_reviews ?? 0} avi</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        user.is_active
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {user.is_active ? <MdCheckCircle size={12} /> : <MdBlock size={12} />}
                        {user.is_active ? 'Aktif' : 'Bloke'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(user.date_joined).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelected(user)} title="Wè profil"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors">
                          <MdVisibility size={14} />
                        </button>
                        <button onClick={() => toggleActive(user.id, user.is_active)}
                          title={user.is_active ? 'Bloke' : 'Aktive'}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            user.is_active
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                              : 'bg-green-50 hover:bg-green-100 text-green-600'
                          }`}>
                          {user.is_active ? <MdLock size={14} /> : <MdLockOpen size={14} />}
                        </button>
                        <button onClick={() => setDeleteModal(user.id)} title="Efase"
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
              {Math.min((page-1)*PER_PAGE+1, totalCount)}–{Math.min(page*PER_PAGE, totalCount)} sou {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">
                ‹
              </button>
              <span className="text-sm font-medium text-slate-700">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40">
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer detay itilizatè */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Profil Itilizatè</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6 flex-1">

              {/* Bannè */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                  {selected.full_name?.[0] ?? '?'}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{selected.full_name}</p>
                  <p className="text-sm text-white/60">{selected.email}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selected.is_active ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'
                    }`}>{selected.is_active ? '● Aktif' : '● Bloke'}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Enfòmasyon</p>
                <div className="space-y-2.5">
                  {[
                    { icon: MdEmail,        value: selected.email },
                    { icon: MdPhone,        value: selected.phone || 'Pa gen telefòn' },
                    { icon: MdLocationOn,   value: `${selected.city || '—'}, ${selected.country || '—'}` },
                    { icon: MdCalendarToday,value: `Rejistre: ${new Date(selected.date_joined).toLocaleDateString('fr-FR')}` },
                    { icon: MdHistory,      value: `Dènye koneksyon: ${selected.last_login ? new Date(selected.last_login).toLocaleDateString('fr-FR') : 'Jamais'}` },
                  ].map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Icon size={16} className="text-slate-400 flex-shrink-0" />{value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatistik */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Aktivite</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MdPayment,    label: 'Rezèvasyon',  value: selected.total_bookings ?? 0,                                color: 'text-blue-600'  },
                    { icon: MdAttachMoney,label: 'Depans total', value: `HTG ${(selected.total_spent ?? 0).toLocaleString()}`,       color: 'text-green-600' },
                    { icon: MdStar,       label: 'Avi bay',     value: selected.total_reviews ?? 0,                                 color: 'text-amber-500' },
                    { icon: MdWarning,    label: 'Signalman',   value: selected.total_reports ?? 0,                                 color: 'text-red-500'   },
                  ].map(({ icon: Icon, label, value, color }, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} className={color} />
                        <p className="text-xs text-slate-500">{label}</p>
                      </div>
                      <p className="text-base font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aksyon */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Aksyon Admin</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => toggleActive(selected.id, selected.is_active)} disabled={isUpdating}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-colors ${
                      selected.is_active
                        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>
                    {selected.is_active ? <><MdLock size={16} /> Bloke</> : <><MdLockOpen size={16} /> Aktive</>}
                  </button>
                  <button onClick={() => resetPassword(selected.id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                    <MdLock size={16} /> Reset mdp
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100">
                    <MdMessage size={16} /> Mesaj
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100">
                    <MdNotifications size={16} /> Notifye
                  </button>
                  <button onClick={() => setDeleteModal(selected.id)}
                    className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                    <MdDelete size={16} /> Efase kont itilizatè a
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
              <h3 className="text-base font-bold text-slate-900 text-center mb-2">Efase itilizatè a?</h3>
              <p className="text-sm text-slate-500 text-center mb-5">Tout done, rezèvasyon, ak istorik ap efase pou toujou.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600">Anile</button>
                <button onClick={() => deleteUser(deleteModal)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Wi, efase l</button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;