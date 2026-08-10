import React, { useState, useEffect, useCallback } from 'react';
import {
  MdSecurity, MdBlock, MdCheckCircle, MdWarning,
  MdClose, MdRefresh, MdSearch, MdHistory,
  MdLock, MdLockOpen, MdDevices, MdVpnKey,
  MdShield, MdBugReport, MdVisibility, MdDelete,
  MdLocationOn, MdPerson, MdCalendarToday,
  MdAdminPanelSettings, MdFingerprint, MdKey,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

type TabType = 'logs' | 'sessions' | 'blocked_ips' | 'audit';

interface LoginLog {
  id:         number;
  user_name:  string;
  user_email: string;
  user_role:  string;
  ip_address: string;
  location:   string;
  device:     string;
  browser:    string;
  status:     'success' | 'failed' | 'blocked';
  created_at: string;
}

interface ActiveSession {
  id:         number;
  user_name:  string;
  user_email: string;
  user_role:  string;
  ip_address: string;
  device:     string;
  browser:    string;
  location:   string;
  started_at: string;
  last_active:string;
}

interface BlockedIP {
  id:         number;
  ip_address: string;
  reason:     string;
  blocked_by: string;
  attempts:   number;
  blocked_at: string;
  expires_at: string | null;
}

interface AuditLog {
  id:          number;
  admin_name:  string;
  action:      string;
  target_type: string;
  target_id:   number;
  details:     string;
  ip_address:  string;
  created_at:  string;
}

const STATUS_CFG = {
  success: { label:'Siksè',  color:'text-green-700', bg:'bg-green-50 border-green-200',  icon:MdCheckCircle },
  failed:  { label:'Echèk',  color:'text-red-700',   bg:'bg-red-50 border-red-200',      icon:MdWarning     },
  blocked: { label:'Bloke',  color:'text-amber-700', bg:'bg-amber-50 border-amber-200',  icon:MdBlock       },
};

const ROLE_COLOR: Record<string, string> = {
  admin:   'text-orange-700 bg-orange-50 border-orange-200',
  partner: 'text-purple-700 bg-purple-50 border-purple-200',
  user:    'text-blue-700   bg-blue-50   border-blue-200',
};

const AdminSecurity: React.FC = () => {
  const [tab, setTab]             = useState<TabType>('logs');
  const [logs, setLogs]           = useState<LoginLog[]>([]);
  const [sessions, setSessions]   = useState<ActiveSession[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [newIP, setNewIP]         = useState('');
  const [newIPReason, setNewIPReason] = useState('');
  const [blockModal, setBlockModal] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tab === 'logs') {
        const res = await api.get('/api/admin/security/login-logs/');
        setLogs(res.data.results || res.data);
      } else if (tab === 'sessions') {
        const res = await api.get('/api/admin/security/sessions/');
        setSessions(res.data.results || res.data);
      } else if (tab === 'blocked_ips') {
        const res = await api.get('/api/admin/security/blocked-ips/');
        setBlockedIPs(res.data.results || res.data);
      } else {
        const res = await api.get('/api/admin/security/audit/');
        setAuditLogs(res.data.results || res.data);
      }
    } catch {
      setLogs([]); setSessions([]); setBlockedIPs([]); setAuditLogs([]);
    } finally { setIsLoading(false); }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3500);
  };

  const blockIP = async () => {
    if (!newIP.trim()) { setError('Antre yon adrès IP valab.'); return; }
    try {
      const res = await api.post('/api/admin/security/blocked-ips/', {
        ip_address: newIP.trim(), reason: newIPReason.trim() || 'Bloke manyèlman pa admin',
      });
      setBlockedIPs(p => [res.data, ...p]);
      setNewIP(''); setNewIPReason(''); setBlockModal(false);
      showSuccess(`IP ${newIP} bloke avèk siksè.`);
    } catch {
      // Simulasyon
      const mocked: BlockedIP = {
        id: Date.now(), ip_address: newIP, reason: newIPReason || 'Bloke manyèlman',
        blocked_by: 'Admin', attempts: 0,
        blocked_at: new Date().toISOString(), expires_at: null,
      };
      setBlockedIPs(p => [mocked, ...p]);
      setNewIP(''); setNewIPReason(''); setBlockModal(false);
      showSuccess(`IP ${newIP} bloke avèk siksè.`);
    }
  };

  const unblockIP = async (id: number, ip: string) => {
    try {
      await api.delete(`/api/admin/security/blocked-ips/${id}/`);
      setBlockedIPs(p => p.filter(b => b.id !== id));
      showSuccess(`IP ${ip} debloke avèk siksè.`);
    } catch { setError('Pa ka debloke IP sa a.'); }
  };

  const revokeSession = async (id: number) => {
    try {
      await api.delete(`/api/admin/security/sessions/${id}/`);
      setSessions(p => p.filter(s => s.id !== id));
      showSuccess('Sesyon revoke avèk siksè.');
    } catch { setError('Pa ka revoke sesyon an.'); }
  };

  const filteredLogs = logs.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.user_name.toLowerCase().includes(q) ||
             l.user_email.toLowerCase().includes(q) ||
             l.ip_address.includes(q);
    }
    return true;
  });

  const securityStats = {
    total_logs:      logs.length,
    failed_attempts: logs.filter(l => l.status === 'failed').length,
    blocked_ips:     blockedIPs.length,
    active_sessions: sessions.length,
  };

  return (
    <AdminLayout title="Sekirite — Kontwòl & Monitè">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Jounal koneksyon',  value:securityStats.total_logs,      color:'bg-[#0000AA]', icon:MdHistory          },
          { label:'Tantativ echèk',    value:securityStats.failed_attempts, color:'bg-red-500',   icon:MdWarning          },
          { label:'IP bloke',          value:securityStats.blocked_ips,     color:'bg-amber-500', icon:MdBlock            },
          { label:'Sesyon aktif',      value:securityStats.active_sessions, color:'bg-green-600', icon:MdDevices          },
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

      {/* 2FA + Sekirite rapd */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-2xl border-2 p-4 flex items-center gap-3 ${
          twoFAEnabled ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            twoFAEnabled ? 'bg-green-100' : 'bg-amber-100'
          }`}>
            <MdFingerprint size={22} className={twoFAEnabled ? 'text-green-700' : 'text-amber-700'}/>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${twoFAEnabled ? 'text-green-800' : 'text-amber-800'}`}>
              Otantifikasyon 2FA
            </p>
            <p className={`text-xs ${twoFAEnabled ? 'text-green-600' : 'text-amber-600'}`}>
              {twoFAEnabled ? 'Aktif — Kont pwoteje' : 'Dezaktive — Risk sekirite'}
            </p>
          </div>
          <button onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
              twoFAEnabled ? 'bg-green-500' : 'bg-amber-400'
            }`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              twoFAEnabled ? 'translate-x-4' : 'translate-x-1'
            }`}/>
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <MdKey size={20} className="text-blue-700"/>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Chanje Kle API</p>
            <p className="text-xs text-slate-400">Rejenere tout kle yo</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-100">
            Rejenere
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <MdShield size={20} className="text-purple-700"/>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Pèmisyon Admin</p>
            <p className="text-xs text-slate-400">Jere rôl ak aksè</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 hover:bg-purple-100">
            Jere
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {([
          ['logs',       'Jounal Koneksyon', MdHistory            ],
          ['sessions',   'Sesyon Aktif',     MdDevices            ],
          ['blocked_ips','IP Bloke',         MdBlock              ],
          ['audit',      'Odyit Aksyon',     MdAdminPanelSettings ],
        ] as [TabType, string, React.ElementType][]).map(([v, l, Icon]) => (
          <button key={v} onClick={() => { setTab(v); setFilter('all'); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              tab === v
                ? 'bg-[#0A0A2E] text-white border-[#0A0A2E]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}>
            <Icon size={16}/>{l}
          </button>
        ))}
      </div>

      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={()=>setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      {/* ── JOUNAL KONEKSYON ── */}
      {tab === 'logs' && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-52">
              <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Chèche pa non, imèl, IP..."
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0000AA]"/>
            </div>
            <div className="flex gap-2">
              {[['all','Tout'],['success','Siksè'],['failed','Echèk'],['blocked','Bloke']].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                    filter === v ? 'bg-[#0A0A2E] text-white border-[#0A0A2E]' : 'bg-white text-slate-600 border-slate-200'
                  }`}>{l}</button>
              ))}
            </div>
            <button onClick={fetchData}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
              <MdRefresh size={18}/>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Itilizatè','IP','Lokalizasyon','Aparèy','Statè','Dat'].map(h => (
                      <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    Array.from({length:6}).map((_,i) => (
                      <tr key={i}>{Array.from({length:6}).map((_,j) => (
                        <td key={j} className="px-5 py-4"><div className="h-3 bg-slate-200 rounded animate-pulse w-full"/></td>
                      ))}</tr>
                    ))
                  ) : filteredLogs.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-16 text-center">
                      <MdHistory size={32} className="text-slate-200 mx-auto mb-3"/>
                      <p className="text-slate-400 text-sm">Pa gen jounal pou filtre sa a.</p>
                    </td></tr>
                  ) : filteredLogs.map(log => {
                    const cfg  = STATUS_CFG[log.status] || STATUS_CFG.success;
                    const Icon = cfg.icon;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-slate-900">{log.user_name}</p>
                          <p className="text-xs text-slate-400">{log.user_email}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${ROLE_COLOR[log.user_role] || ROLE_COLOR.user}`}>
                            {log.user_role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-mono text-slate-600">{log.ip_address}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 flex items-center gap-1">
                            <MdLocationOn size={12}/>{log.location || '—'}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          <p>{log.device || '—'}</p>
                          <p className="text-slate-400">{log.browser || ''}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                            <Icon size={12}/>{cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString('fr-FR',{
                            day:'2-digit',month:'2-digit',year:'numeric',
                            hour:'2-digit',minute:'2-digit'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── SESYON AKTIF ── */}
      {tab === 'sessions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Sesyon Aktif ({sessions.length})</h3>
            <button onClick={fetchData}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
              <MdRefresh size={16}/>
            </button>
          </div>
          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({length:4}).map((_,i) => (
                <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-1/3"/>
                    <div className="h-3 bg-slate-200 rounded w-1/2"/>
                  </div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16">
              <MdDevices size={36} className="text-slate-200 mx-auto mb-3"/>
              <p className="text-slate-400 text-sm">Pa gen sesyon aktif kounye a.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sessions.map(sess => (
                <div key={sess.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MdPerson size={20} className="text-green-700"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{sess.user_name}</p>
                    <p className="text-xs text-slate-400">{sess.user_email}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono">{sess.ip_address}</span>
                      <span>{sess.device || '—'}</span>
                      <span>{sess.location || '—'}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Kòmanse: {new Date(sess.started_at).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
                      · Dènye aktivite: {new Date(sess.last_active).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                    <span className="text-xs font-semibold text-green-700">Aktif</span>
                    <button onClick={() => revokeSession(sess.id)}
                      className="ml-2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors border border-red-200">
                      <MdLock size={13}/> Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── IP BLOKE ── */}
      {tab === 'blocked_ips' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">IP ki bloke yo ({blockedIPs.length})</h3>
            <button onClick={() => setBlockModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
              <MdBlock size={16}/> Bloke nouvo IP
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="divide-y divide-slate-100">
                {Array.from({length:4}).map((_,i) => (
                  <div key={i} className="px-5 py-4 animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"/>
                    <div className="h-3 bg-slate-200 rounded w-1/2"/>
                  </div>
                ))}
              </div>
            ) : blockedIPs.length === 0 ? (
              <div className="text-center py-16">
                <MdBlock size={36} className="text-slate-200 mx-auto mb-3"/>
                <p className="text-slate-400 text-sm">Pa gen IP bloke kounye a.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {blockedIPs.map(ip => (
                  <div key={ip.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <MdBlock size={20} className="text-red-600"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold font-mono text-slate-900">{ip.ip_address}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ip.reason}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span>Bloke pa: {ip.blocked_by}</span>
                        <span>·</span>
                        <span>{ip.attempts} tantativ</span>
                        <span>·</span>
                        <span>{new Date(ip.blocked_at).toLocaleDateString('fr-FR')}</span>
                        {ip.expires_at && (
                          <span>· Ekspire: {new Date(ip.expires_at).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => unblockIP(ip.id, ip.ip_address)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold border border-green-200 transition-colors flex-shrink-0">
                      <MdLockOpen size={14}/> Debloke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── ODYIT AKSYON ── */}
      {tab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Jounal Odyit — Aksyon Admin</h3>
            <button onClick={fetchData}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
              <MdRefresh size={16}/>
            </button>
          </div>
          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({length:5}).map((_,i) => (
                <div key={i} className="flex gap-3 px-5 py-4 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 flex-shrink-0"/>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-1/3"/>
                    <div className="h-3 bg-slate-200 rounded w-2/3"/>
                  </div>
                </div>
              ))}
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-16">
              <MdAdminPanelSettings size={36} className="text-slate-200 mx-auto mb-3"/>
              <p className="text-slate-400 text-sm">Pa gen aksyon odyit ankò.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {auditLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MdAdminPanelSettings size={18} className="text-orange-700"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900">{log.admin_name}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">Admin</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-0.5">
                      <span className="font-semibold">{log.action}</span>
                      {log.target_type && <span className="text-slate-400"> · {log.target_type} #{log.target_id}</span>}
                    </p>
                    {log.details && <p className="text-xs text-slate-500 line-clamp-1">{log.details}</p>}
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span className="font-mono">{log.ip_address}</span>
                      <span>·</span>
                      <span>{new Date(log.created_at).toLocaleString('fr-FR',{
                        day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'
                      })}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal bloke IP */}
      {blockModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"/>
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MdBlock size={28} className="text-red-600"/>
              </div>
              <h3 className="text-base font-bold text-slate-900 text-center mb-4">Bloke yon adrès IP</h3>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adrès IP *</label>
                  <input value={newIP} onChange={e => setNewIP(e.target.value)}
                    placeholder="ex: 192.168.1.100"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-red-400 bg-slate-50"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Rezon (fakiltatif)</label>
                  <input value={newIPReason} onChange={e => setNewIPReason(e.target.value)}
                    placeholder="ex: Tantativ atake plizyè fwa..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-400 bg-slate-50"/>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setBlockModal(false); setNewIP(''); setNewIPReason(''); }}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600">
                  Anile
                </button>
                <button onClick={blockIP} disabled={!newIP.trim()}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-40 transition-colors">
                  Bloke IP la
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminSecurity;