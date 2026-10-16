/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdAdminPanelSettings, MdAdd, MdEdit, MdDelete,
  MdClose, MdWarning, MdCheckCircle, MdRefresh,
  MdSearch, MdEmail, MdPhone, MdLock,
  MdLockOpen, MdHistory,
  MdFingerprint, MdVisibility, MdSecurity,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface Admin {
  id:              number;
  email:           string;
  first_name:      string;
  last_name:       string;
  full_name:       string;
  phone:           string;
  role:            string;
  permissions:     string[];
  is_active:       boolean;
  two_fa_enabled:  boolean;
  date_joined:     string;
  last_login:      string | null;
  last_action:     string | null;
  action_count:    number;
}

interface AdminForm {
  email:       string;
  first_name:  string;
  last_name:   string;
  phone:       string;
  password:    string;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  { key: 'manage_partners',   label: 'Jere Patnè yo',         group: 'Patnè'       },
  { key: 'manage_users',      label: 'Jere Itilizatè yo',     group: 'Itilizatè'   },
  { key: 'manage_listings',   label: 'Jere Anonskman yo',     group: 'Anonskman'   },
  { key: 'validate_listings', label: 'Valide Anonskman yo',   group: 'Anonskman'   },
  { key: 'manage_bookings',   label: 'Jere Rezèvasyon yo',    group: 'Rezèvasyon'  },
  { key: 'manage_payments',   label: 'Jere Peman yo',         group: 'Finansye'    },
  { key: 'view_revenue',      label: 'Wè Revni & Komisyon',  group: 'Finansye'    },
  { key: 'send_notifications',label: 'Voye Notifikasyon',     group: 'Kominikasyon'},
  { key: 'manage_messages',   label: 'Jere Mesaj yo',         group: 'Kominikasyon'},
  { key: 'manage_reviews',    label: 'Jere Avi & Signalman',  group: 'Kontni'      },
  { key: 'view_statistics',   label: 'Wè Estatistik',         group: 'Analitik'    },
  { key: 'export_reports',    label: 'Eksporte Rapò',         group: 'Analitik'    },
  { key: 'manage_settings',   label: 'Jere Paramèt Sistèm',  group: 'Sistèm'      },
  { key: 'manage_security',   label: 'Jere Sekirite',         group: 'Sistèm'      },
  { key: 'manage_admins',     label: 'Jere Administratè yo', group: 'Sistèm'      },
];

const PERMISSION_GROUPS = [...new Set(ALL_PERMISSIONS.map(p => p.group))];

const INIT_FORM: AdminForm = {
  email: '', first_name: '', last_name: '', phone: '',
  password: '', permissions: [],
};

const AdminAdmins: React.FC = () => {
  const [admins, setAdmins]         = useState<Admin[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Admin | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [editAdmin, setEditAdmin]   = useState<Admin | null>(null);
  const [form, setForm]             = useState<AdminForm>(INIT_FORM);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const res  = await api.get('/admin/admins/');
      setAdmins(res.data.results || res.data);
    } catch { setAdmins([]); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3500);
  };

  const setF = (k: keyof AdminForm, v: any) =>
    setForm(p => ({ ...p, [k]: v }));

  const togglePerm = (perm: string) =>
    setF('permissions',
      form.permissions.includes(perm)
        ? form.permissions.filter(p => p !== perm)
        : [...form.permissions, perm]
    );

  const selectAllGroup = (group: string) => {
    const groupPerms = ALL_PERMISSIONS.filter(p => p.group === group).map(p => p.key);
    const allSelected = groupPerms.every(p => form.permissions.includes(p));
    if (allSelected) {
      setF('permissions', form.permissions.filter(p => !groupPerms.includes(p)));
    } else {
      setF('permissions', [...new Set([...form.permissions, ...groupPerms])]);
    }
  };

  const selectAll = () => {
    if (form.permissions.length === ALL_PERMISSIONS.length) {
      setF('permissions', []);
    } else {
      setF('permissions', ALL_PERMISSIONS.map(p => p.key));
    }
  };

  const openCreate = () => {
    setEditAdmin(null);
    setForm(INIT_FORM);
    setShowForm(true);
    setError(null);
  };

  const openEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setForm({
      email:       admin.email,
      first_name:  admin.first_name,
      last_name:   admin.last_name,
      phone:       admin.phone || '',
      password:    '',
      permissions: [...(admin.permissions || [])],
    });
    setShowForm(true);
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!form.email.trim())      return 'Imèl obligatwa.';
    if (!form.first_name.trim()) return 'Non obligatwa.';
    if (!form.last_name.trim())  return 'Siyati obligatwa.';
    if (!editAdmin && !form.password.trim()) return 'Modpas obligatwa pou nouvo admin.';
    if (!editAdmin && form.password.length < 8) return 'Modpas dwe gen omwen 8 karaktè.';
    return null;
  };

  const submitForm = async () => {
    const err = validateForm();
    if (err) { setError(err); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      if (editAdmin) {
        const payload: any = {
          first_name:  form.first_name,
          last_name:   form.last_name,
          phone:       form.phone,
          permissions: form.permissions,
        };
        if (form.password.trim()) payload.password = form.password;
        const res = await api.patch(`/admin/admins/${editAdmin.id}/`, payload);
        setAdmins(p => p.map(a => a.id === editAdmin.id ? res.data : a));
        showSuccess('Admin mete ajou avèk siksè.');
      } else {
        const res = await api.post('/admin/admins/', {
          ...form, role: 'admin',
        });
        setAdmins(p => [res.data, ...p]);
        showSuccess('Nouvo admin kreye avèk siksè.');
      }
      setShowForm(false);
      setForm(INIT_FORM);
    } catch (e: any) {
      const d = e?.response?.data;
      setError(d?.email?.[0] || d?.message || 'Erè pandan sove admin an.');
    } finally { setIsSubmitting(false); }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try {
      await api.patch(`/admin/admins/${id}/`, { is_active: !current });
      setAdmins(p => p.map(a => a.id === id ? { ...a, is_active: !current } : a));
      showSuccess(!current ? 'Admin aktive.' : 'Admin dezaktive.');
    } catch { setError('Pa ka chanje statè admin an.'); }
  };

  const deleteAdmin = async (id: number) => {
    try {
      await api.delete(`/admin/admins/${id}/`);
      setAdmins(p => p.filter(a => a.id !== id));
      setDeleteModal(null);
      if (selected?.id === id) setSelected(null);
      showSuccess('Admin efase avèk siksè.');
    } catch { setError('Pa ka efase admin an.'); }
  };

  const filteredAdmins = admins.filter(a => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.full_name.toLowerCase().includes(q) ||
           a.email.toLowerCase().includes(q);
  });

  const inp = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white transition-colors';
  const lbl = 'block text-xs font-semibold text-slate-600 mb-1.5';

  return (
    <AdminLayout title="Jestyon Administratè yo">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Admin',  value:admins.length,                               color:'bg-[#0000AA]', icon:MdAdminPanelSettings },
          { label:'Aktif',        value:admins.filter(a=>a.is_active).length,        color:'bg-green-600', icon:MdCheckCircle        },
          { label:'Inaktif',      value:admins.filter(a=>!a.is_active).length,       color:'bg-red-500',   icon:MdLock               },
          { label:'2FA Aktive',   value:admins.filter(a=>a.two_fa_enabled).length,   color:'bg-purple-600',icon:MdFingerprint        },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={18} className="text-white"/>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtre + Bouton kreye */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Chèche admin pa non oswa imèl..."
            className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0000AA]"/>
        </div>
        <button onClick={fetchAdmins}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <MdRefresh size={18}/>
        </button>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6600] text-white text-sm font-bold hover:bg-[#e55a00] transition-colors shadow-sm">
          <MdAdd size={18}/> Ajoute admin
        </button>
      </div>

      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={()=>setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      {/* Lis admin */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Administratè yo ({filteredAdmins.length})</h3>
        </div>

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({length:4}).map((_,i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"/>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded w-1/3"/>
                  <div className="h-3 bg-slate-200 rounded w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-16">
            <MdAdminPanelSettings size={36} className="text-slate-200 mx-auto mb-3"/>
            <p className="text-slate-400 text-sm">Pa gen admin pou filtre sa a.</p>
            <button onClick={openCreate}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0000AA] text-white text-sm font-bold mx-auto hover:bg-[#000088]">
              <MdAdd size={16}/> Kreye premye admin an
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAdmins.map(admin => (
              <div key={admin.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF6600] to-[#cc4400] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                  {admin.full_name?.[0] ?? '?'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-slate-900">{admin.full_name}</p>
                    {admin.two_fa_enabled && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-0.5">
                        <MdFingerprint size={10}/> 2FA
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                      admin.is_active
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {admin.is_active ? 'Aktif' : 'Inaktif'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MdEmail size={12}/>{admin.email}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(admin.permissions || []).slice(0, 3).map(perm => {
                      const p = ALL_PERMISSIONS.find(x => x.key === perm);
                      return p ? (
                        <span key={perm} className="text-[10px] px-1.5 py-0.5 rounded bg-[#0000AA]/10 text-[#0000AA] font-medium">
                          {p.label}
                        </span>
                      ) : null;
                    })}
                    {(admin.permissions || []).length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                        +{admin.permissions.length - 3} lòt
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right hidden sm:block flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-700">{admin.action_count || 0} aksyon</p>
                  <p className="text-xs text-slate-400">
                    {admin.last_login
                      ? `Dènye: ${new Date(admin.last_login).toLocaleDateString('fr-FR')}`
                      : 'Jamais konekte'
                    }
                  </p>
                </div>

                {/* Aksyon */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setSelected(admin)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors" title="Wè detay">
                    <MdVisibility size={15}/>
                  </button>
                  <button onClick={() => openEdit(admin)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center text-slate-500 transition-colors" title="Modifye">
                    <MdEdit size={15}/>
                  </button>
                  <button onClick={() => toggleActive(admin.id, admin.is_active)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      admin.is_active
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                        : 'bg-green-50 hover:bg-green-100 text-green-600'
                    }`} title={admin.is_active ? 'Dezaktive' : 'Aktive'}>
                    {admin.is_active ? <MdLock size={15}/> : <MdLockOpen size={15}/>}
                  </button>
                  <button onClick={() => setDeleteModal(admin.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors" title="Efase">
                    <MdDelete size={15}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ DRAWER — Detay admin ═══ */}
      {selected && !showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelected(null)}/>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-slate-900">Fich Administratè</h2>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <MdClose size={18}/>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Bannè */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#FF6600] to-[#cc4400] rounded-2xl p-5">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                  {selected.full_name?.[0] ?? '?'}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{selected.full_name}</p>
                  <p className="text-sm text-white/70">{selected.email}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${selected.is_active?'bg-green-400/20 text-green-200':'bg-red-400/20 text-red-200'}`}>
                      {selected.is_active ? '● Aktif' : '● Inaktif'}
                    </span>
                    {selected.two_fa_enabled && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white">
                        ✓ 2FA
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Enfòmasyon</p>
                <div className="space-y-2">
                  {[
                    {icon:MdEmail,    val: selected.email},
                    {icon:MdPhone,    val: selected.phone || 'Pa gen telefòn'},
                    {icon:MdHistory,  val: `Rejistre: ${new Date(selected.date_joined).toLocaleDateString('fr-FR')}`},
                    {icon:MdHistory,  val: `Dènye koneksyon: ${selected.last_login ? new Date(selected.last_login).toLocaleDateString('fr-FR') : 'Jamais'}`},
                    {icon:MdSecurity, val: `${selected.action_count || 0} aksyon total`},
                  ].map(({icon:Icon,val},i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Icon size={15} className="text-slate-400 flex-shrink-0"/>{val}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pèmisyon */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Pèmisyon ({(selected.permissions||[]).length}/{ALL_PERMISSIONS.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_PERMISSIONS.map(perm => {
                    const hasPerm = (selected.permissions||[]).includes(perm.key);
                    return (
                      <span key={perm.key} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        hasPerm
                          ? 'bg-[#0000AA]/10 text-[#0000AA] border-[#0000AA]/20'
                          : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                      }`}>
                        {perm.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Aksyon */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => { setSelected(null); openEdit(selected); }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 border-[#0000AA] text-[#0000AA] hover:bg-[#0000AA]/5">
                  <MdEdit size={16}/> Modifye
                </button>
                <button onClick={() => toggleActive(selected.id, selected.is_active)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-colors ${
                    selected.is_active
                      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  }`}>
                  {selected.is_active ? <><MdLock size={16}/>Dezaktive</> : <><MdLockOpen size={16}/>Aktive</>}
                </button>
                <button onClick={() => { setSelected(null); setDeleteModal(selected.id); }}
                  className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600">
                  <MdDelete size={16}/> Efase admin an
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══ MODAL — Kreye / Modifye Admin ═══ */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => !isSubmitting && setShowForm(false)}/>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">
                  {editAdmin ? 'Modifye Admin' : 'Kreye Nouvo Admin'}
                </h2>
                <button onClick={() => !isSubmitting && setShowForm(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <MdClose size={18}/>
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
                    <MdWarning size={15}/>{error}
                    <button onClick={()=>setError(null)} className="ml-auto"><MdClose size={13}/></button>
                  </div>
                )}

                {/* Enfòmasyon debaz */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enfòmasyon Debaz</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Non *</label>
                      <input value={form.first_name} onChange={e => setF('first_name', e.target.value)} className={inp} placeholder="Jan"/>
                    </div>
                    <div>
                      <label className={lbl}>Siyati *</label>
                      <input value={form.last_name} onChange={e => setF('last_name', e.target.value)} className={inp} placeholder="Diskou"/>
                    </div>
                    <div>
                      <label className={lbl}>Imèl *</label>
                      <input type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                        className={inp} placeholder="admin@trapde.com" disabled={!!editAdmin}/>
                    </div>
                    <div>
                      <label className={lbl}>Telefòn</label>
                      <input type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} className={inp} placeholder="+509 ..."/>
                    </div>
                    <div className="col-span-2">
                      <label className={lbl}>{editAdmin ? 'Nouvo Modpas (kite vid si pa chanje)' : 'Modpas *'}</label>
                      <input type="password" value={form.password} onChange={e => setF('password', e.target.value)}
                        className={inp} placeholder={editAdmin ? '••••••••' : 'Min. 8 karaktè'}/>
                    </div>
                  </div>
                </div>

                {/* Pèmisyon */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pèmisyon ({form.permissions.length}/{ALL_PERMISSIONS.length})</p>
                    <button onClick={selectAll}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        form.permissions.length === ALL_PERMISSIONS.length
                          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border-[#0000AA] bg-[#0000AA]/5 text-[#0000AA] hover:bg-[#0000AA]/10'
                      }`}>
                      {form.permissions.length === ALL_PERMISSIONS.length ? 'Dezèleksyone tout' : 'Seleksyone tout'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {PERMISSION_GROUPS.map(group => {
                      const groupPerms = ALL_PERMISSIONS.filter(p => p.group === group);
                      const allSelected = groupPerms.every(p => form.permissions.includes(p.key));
                      return (
                        <div key={group} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200">
                            <p className="text-xs font-bold text-slate-700">{group}</p>
                            <button onClick={() => selectAllGroup(group)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                                allSelected
                                  ? 'bg-[#0000AA]/10 text-[#0000AA]'
                                  : 'bg-white text-slate-500 border border-slate-200 hover:border-[#0000AA]'
                              }`}>
                              {allSelected ? '✓ Tout' : 'Tout'}
                            </button>
                          </div>
                          <div className="p-3 grid grid-cols-2 gap-2">
                            {groupPerms.map(perm => {
                              const sel = form.permissions.includes(perm.key);
                              return (
                                <label key={perm.key}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs font-medium transition-all border ${
                                    sel
                                      ? 'border-[#0000AA] bg-[#0000AA]/5 text-[#0000AA]'
                                      : 'border-transparent bg-white text-slate-600 hover:border-slate-300'
                                  }`}>
                                  <input type="checkbox" checked={sel} onChange={() => togglePerm(perm.key)} className="hidden"/>
                                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${sel?'bg-[#0000AA] border-[#0000AA]':'border-slate-300'}`}>
                                    {sel && <MdCheckCircle size={12} className="text-white"/>}
                                  </div>
                                  {perm.label}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer modal */}
              <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button onClick={() => setShowForm(false)} disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white disabled:opacity-50">
                  Anile
                </button>
                <button onClick={submitForm} disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#0A0A2E] to-[#0000AA] hover:opacity-90 disabled:opacity-50 transition-opacity">
                  {isSubmitting
                    ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Ap sove...</span>
                    : editAdmin ? 'Mete ajou admin an' : 'Kreye admin an'
                  }
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal efase */}
      {deleteModal !== null && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"/>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MdDelete size={28} className="text-red-500"/>
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-2">Efase admin an?</h3>
              <p className="text-sm text-slate-500 text-center mb-5">
                Aksyon sa irevèsib. Admin sa p'ap ka konekte ankò sou platfòm nan.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600">Anile</button>
                <button onClick={() => deleteAdmin(deleteModal)}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Wi, efase l</button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminAdmins;