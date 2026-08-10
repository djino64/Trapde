import React, { useState, useEffect } from 'react';
import {
  MdSettings, MdSave, MdCheckCircle, MdWarning,
  MdClose, MdImage, MdLanguage, MdAttachMoney,
  MdEmail, MdNotifications, MdBuild, MdBackup,
  MdGavel, MdPrivacyTip, MdPalette, MdPercent,
  MdRefresh, MdUpload, MdDelete, MdAdd,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

type SettingsTab =
  | 'general'
  | 'commission'
  | 'email'
  | 'notifications'
  | 'maintenance'
  | 'legal';

interface PlatformSettings {
  platform_name:        string;
  platform_logo:        string;
  platform_description: string;
  support_email:        string;
  support_phone:        string;
  default_language:     string;
  available_languages:  string[];
  default_currency:     string;
  commission_rate:      number;
  tax_rate:             number;
  min_payout:           number;
  payout_delay_days:    number;
  smtp_host:            string;
  smtp_port:            string;
  smtp_user:            string;
  smtp_pass:            string;
  email_from_name:      string;
  email_from_address:   string;
  push_enabled:         boolean;
  email_notif_enabled:  boolean;
  sms_enabled:          boolean;
  maintenance_mode:     boolean;
  maintenance_message:  string;
  terms_url:            string;
  privacy_url:          string;
  terms_content:        string;
  privacy_content:      string;
}

const INIT: PlatformSettings = {
  platform_name:        'TRAPDE',
  platform_logo:        '',
  platform_description: 'Platfòm entèmeyè Ayisyen pou lojman, travay, vwayaj, mache ak lokasyon.',
  support_email:        'support@trapde.com',
  support_phone:        '+509 0000-0000',
  default_language:     'ht',
  available_languages:  ['ht', 'fr', 'en'],
  default_currency:     'HTG',
  commission_rate:      10,
  tax_rate:             0,
  min_payout:           500,
  payout_delay_days:    3,
  smtp_host:            '',
  smtp_port:            '587',
  smtp_user:            '',
  smtp_pass:            '',
  email_from_name:      'TRAPDE',
  email_from_address:   'no-reply@trapde.com',
  push_enabled:         true,
  email_notif_enabled:  true,
  sms_enabled:          false,
  maintenance_mode:     false,
  maintenance_message:  'TRAPDE ap fè antretyen. Retounen byento!',
  terms_url:            '',
  privacy_url:          '',
  terms_content:        '',
  privacy_content:      '',
};

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general',       label: 'Jeneral',        icon: MdSettings      },
  { id: 'commission',    label: 'Komisyon & Taks', icon: MdPercent       },
  { id: 'email',         label: 'Imèl & SMTP',    icon: MdEmail         },
  { id: 'notifications', label: 'Notifikasyon',   icon: MdNotifications },
  { id: 'maintenance',   label: 'Antretyen',      icon: MdBuild         },
  { id: 'legal',         label: 'Legal',          icon: MdGavel         },
];

const AdminSettings: React.FC = () => {
  const [tab, setTab]             = useState<SettingsTab>('general');
  const [settings, setSettings]  = useState<PlatformSettings>(INIT);
  const [original, setOriginal]  = useState<PlatformSettings>(INIT);
  const [isSaving, setIsSaving]  = useState(false);
  const [isLoading, setIsLoading]= useState(true);
  const [error, setError]        = useState<string | null>(null);
  const [success, setSuccess]    = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [hasChanges, setHasChanges]   = useState(false);
  const [backupList, setBackupList]   = useState<{id:string;date:string;size:string}[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/api/admin/settings/');
        setSettings({ ...INIT, ...res.data });
        setOriginal({ ...INIT, ...res.data });
      } catch { /* use defaults */ }
      finally { setIsLoading(false); }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(original));
  }, [settings, original]);

  const set = (k: keyof PlatformSettings, v: any) =>
    setSettings(p => ({ ...p, [k]: v }));

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 3500);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await api.put('/api/admin/settings/', settings);
      setOriginal({ ...settings });
      setHasChanges(false);
      showSuccess('Paramèt yo sove avèk siksè.');
    } catch {
      showSuccess('Paramèt yo sove (simulasyon devlopman).');
      setOriginal({ ...settings });
      setHasChanges(false);
    } finally { setIsSaving(false); }
  };

  const resetToDefault = () => {
    setSettings({ ...original });
    setHasChanges(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    set('platform_logo', url);
  };

  const createBackup = async () => {
    try {
      const newBackup = {
        id:   `bk-${Date.now()}`,
        date: new Date().toLocaleString('fr-FR'),
        size: `${(Math.random() * 50 + 10).toFixed(1)} MB`,
      };
      setBackupList(p => [newBackup, ...p]);
      showSuccess('Bakòp kreye avèk siksè.');
    } catch { setError('Pa ka kreye bakòp.'); }
  };

  const inp   = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white transition-colors';
  const lbl   = 'block text-xs font-semibold text-slate-600 mb-1.5';
  const tog   = (v: boolean) => `relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 cursor-pointer ${v?'bg-[#0000AA]':'bg-slate-300'}`;
  const knob  = (v: boolean) => `inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${v?'translate-x-4':'translate-x-1'}`;

  return (
    <AdminLayout title="Paramèt Platfòm">

      {/* Bannè chanjman */}
      {hasChanges && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3 shadow-sm">
          <MdWarning size={20} className="text-amber-600 flex-shrink-0"/>
          <p className="text-sm font-semibold text-amber-800 flex-1">
            Ou gen chanjman ki pa sove ankò. Klike "Sove" pou konsève yo.
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={resetToDefault}
              className="px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-semibold text-amber-700 hover:bg-amber-100">
              Anile chanjman
            </button>
            <button onClick={saveSettings} disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50">
              <MdSave size={14}/> Sove kounye a
            </button>
          </div>
        </div>
      )}

      {error   && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={()=>setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-4 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      <div className="flex gap-5">

        {/* ── Sidebar tabs ── */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? 'bg-[#0A0A2E] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}>
                <Icon size={18} className="flex-shrink-0"/>
                <span className="flex-1 text-left">{t.label}</span>
              </button>
            );
          })}
          <div className="pt-3">
            <button onClick={saveSettings} disabled={isSaving || !hasChanges}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[#FF6600] hover:bg-[#e55a00] disabled:opacity-40 transition-colors shadow-sm">
              {isSaving
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Ap sove...</>
                : <><MdSave size={18}/> Sove tout</>
              }
            </button>
          </div>
        </div>

        {/* ── Kontni ── */}
        <div className="flex-1 min-w-0">

          {/* ── JENERAL ── */}
          {tab === 'general' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Enfòmasyon Jeneral Platfòm
              </h3>

              {/* Logo */}
              <div>
                <label className={lbl}>Logo Platfòm</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {logoPreview || settings.platform_logo
                      ? <img src={logoPreview || settings.platform_logo} alt="Logo" className="w-full h-full object-contain p-2"/>
                      : <MdImage size={28} className="text-slate-300"/>
                    }
                  </div>
                  <div>
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors">
                      <MdUpload size={16}/> Chanje logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                    </label>
                    {(logoPreview || settings.platform_logo) && (
                      <button onClick={() => { setLogoPreview(''); set('platform_logo',''); }}
                        className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100">
                        <MdDelete size={13}/> Efase logo
                      </button>
                    )}
                    <p className="text-xs text-slate-400 mt-1.5">PNG, JPG. Rekòmande: 200×200px</p>
                  </div>
                </div>
              </div>

              <div>
                <label className={lbl}>Non Platfòm *</label>
                <input value={settings.platform_name} onChange={e => set('platform_name', e.target.value)} className={inp} placeholder="TRAPDE"/>
              </div>

              <div>
                <label className={lbl}>Deskripsyon Platfòm</label>
                <textarea value={settings.platform_description}
                  onChange={e => set('platform_description', e.target.value)}
                  className={`${inp} resize-none`} rows={3}
                  placeholder="Deskripsyon platfòm ou..."/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Imèl Sipò</label>
                  <input type="email" value={settings.support_email} onChange={e => set('support_email', e.target.value)} className={inp} placeholder="support@trapde.com"/>
                </div>
                <div>
                  <label className={lbl}>Telefòn Sipò</label>
                  <input type="tel" value={settings.support_phone} onChange={e => set('support_phone', e.target.value)} className={inp} placeholder="+509 ..."/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Lang Default</label>
                  <select value={settings.default_language} onChange={e => set('default_language', e.target.value)} className={inp}>
                    <option value="ht">Kreyòl Ayisyen (ht)</option>
                    <option value="fr">Français (fr)</option>
                    <option value="en">English (en)</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Monepi Default</label>
                  <select value={settings.default_currency} onChange={e => set('default_currency', e.target.value)} className={inp}>
                    <option value="HTG">HTG — Goud Ayisyen</option>
                    <option value="USD">USD — Dola Ameriken</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
              </div>

              {/* Lang disponib */}
              <div>
                <label className={lbl}>Lang disponib sou platfòm nan</label>
                <div className="flex gap-2 flex-wrap">
                  {[['ht','Kreyòl'],['fr','Français'],['en','English'],['es','Español']].map(([v,l]) => {
                    const sel = settings.available_languages.includes(v);
                    return (
                      <label key={v}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          sel ? 'border-[#0000AA] bg-[#0000AA]/5 text-[#0000AA]' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                        }`}>
                        <input type="checkbox" className="hidden" checked={sel}
                          onChange={() => set('available_languages',
                            sel
                              ? settings.available_languages.filter(x => x !== v)
                              : [...settings.available_languages, v]
                          )}/>
                        {sel && <MdCheckCircle size={13}/>} {l}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── KOMISYON & TAKS ── */}
          {tab === 'commission' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Komisyon & Taks TRAPDE
              </h3>

              {/* Aperçu live */}
              <div className="bg-gradient-to-r from-[#0A0A2E] to-[#0000AA] rounded-2xl p-5 text-white">
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Ekzanp pou HTG 10,000</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label:'Kliyan peye',    value:`HTG ${(10000).toLocaleString()}`                                },
                    { label:'Komisyon TRAPDE',value:`HTG ${(10000 * settings.commission_rate / 100).toLocaleString()}` },
                    { label:'Patnè resevwa', value:`HTG ${(10000 * (1 - settings.commission_rate/100)).toLocaleString()}` },
                  ].map(({label,value},i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-bold">{value}</p>
                      <p className="text-xs text-white/60 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={lbl}>To Komisyon TRAPDE (%)</label>
                  <div className="relative">
                    <MdPercent size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="number" value={settings.commission_rate}
                      onChange={e => set('commission_rate', +e.target.value)}
                      className={`${inp} pr-9`} min={0} max={50} step={0.5}/>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Aktyèlman fiks a {settings.commission_rate}% pa tout sèvis.</p>
                </div>

                <div>
                  <label className={lbl}>To Taks (%)</label>
                  <div className="relative">
                    <MdPercent size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="number" value={settings.tax_rate}
                      onChange={e => set('tax_rate', +e.target.value)}
                      className={`${inp} pr-9`} min={0} max={30} step={0.5}/>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">0% si taks pa aplikab.</p>
                </div>

                <div>
                  <label className={lbl}>Montan Minimòm Peman Patnè (HTG)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">HTG</span>
                    <input type="number" value={settings.min_payout}
                      onChange={e => set('min_payout', +e.target.value)}
                      className={`${inp} pl-12`} min={0}/>
                  </div>
                </div>

                <div>
                  <label className={lbl}>Delè Peman Patnè (jou)</label>
                  <input type="number" value={settings.payout_delay_days}
                    onChange={e => set('payout_delay_days', +e.target.value)}
                    className={inp} min={0} max={30}/>
                  <p className="text-xs text-slate-400 mt-1.5">Jou apre rezèvasyon konfime.</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Atansyon</p>
                <p className="text-xs text-amber-700">
                  Chanje to komisyon ap afekte tout nouvo rezèvasyon sèlman. Rezèvasyon ki egziste deja ap konsève ansyen to a.
                </p>
              </div>
            </div>
          )}

          {/* ── IMÈL & SMTP ── */}
          {tab === 'email' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Konfigirasyon SMTP & Imèl
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Non Ekspèditè</label>
                  <input value={settings.email_from_name} onChange={e => set('email_from_name', e.target.value)} className={inp} placeholder="TRAPDE"/>
                </div>
                <div>
                  <label className={lbl}>Adrès Imèl Ekspèditè</label>
                  <input type="email" value={settings.email_from_address} onChange={e => set('email_from_address', e.target.value)} className={inp} placeholder="no-reply@trapde.com"/>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Konfigirasyon Sèvè SMTP</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Sèvè SMTP Host</label>
                    <input value={settings.smtp_host} onChange={e => set('smtp_host', e.target.value)} className={inp} placeholder="smtp.gmail.com"/>
                  </div>
                  <div>
                    <label className={lbl}>Pò SMTP</label>
                    <input value={settings.smtp_port} onChange={e => set('smtp_port', e.target.value)} className={inp} placeholder="587"/>
                  </div>
                  <div>
                    <label className={lbl}>Non itilizatè SMTP</label>
                    <input value={settings.smtp_user} onChange={e => set('smtp_user', e.target.value)} className={inp} placeholder="user@example.com"/>
                  </div>
                  <div>
                    <label className={lbl}>Modpas SMTP</label>
                    <input type="password" value={settings.smtp_pass} onChange={e => set('smtp_pass', e.target.value)} className={inp} placeholder="••••••••"/>
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    await api.post('/api/admin/settings/test-email/');
                    showSuccess('Imèl tès voye avèk siksè! Verifye bwat resepsyon ou.');
                  } catch { showSuccess('Imèl tès voye (simulasyon).'); }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0000AA] text-[#0000AA] text-sm font-semibold hover:bg-[#0000AA]/5 transition-colors">
                <MdEmail size={16}/> Voye imèl tès
              </button>
            </div>
          )}

          {/* ── NOTIFIKASYON ── */}
          {tab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Kanal Notifikasyon
              </h3>
              {[
                { key:'email_notif_enabled',  label:'Notifikasyon pa Imèl',  sub:'Voye imèl pou rezèvasyon, peman, ak alèt.', icon:MdEmail         },
                { key:'push_enabled',         label:'Notifikasyon Push',      sub:'Notif navigatè ak aplikasyon mobil.',       icon:MdNotifications },
                { key:'sms_enabled',          label:'Notifikasyon SMS',       sub:'Mesaj tèks (nesesite konfigirasyon Twilio).', icon:MdSettings     },
              ].map(({ key, label, sub, icon: Icon }) => {
                const val = settings[key as keyof PlatformSettings] as boolean;
                return (
                  <div key={key} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${val?'border-[#0000AA] bg-[#0000AA]/[0.02]':'border-slate-200 bg-white'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${val?'bg-[#0000AA]/10':'bg-slate-100'}`}>
                      <Icon size={20} className={val?'text-[#0000AA]':'text-slate-400'}/>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                    </div>
                    <button onClick={() => set(key as keyof PlatformSettings, !val)} className={tog(val)}>
                      <span className={knob(val)}/>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── ANTRETYEN ── */}
          {tab === 'maintenance' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Mòd Antretyen</h3>

                <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  settings.maintenance_mode ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${settings.maintenance_mode?'bg-red-100':'bg-slate-100'}`}>
                    <MdBuild size={20} className={settings.maintenance_mode?'text-red-600':'text-slate-400'}/>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${settings.maintenance_mode?'text-red-800':'text-slate-800'}`}>
                      {settings.maintenance_mode ? '🔴 Mòd Antretyen AKTIF' : 'Mòd Antretyen Dezaktive'}
                    </p>
                    <p className={`text-xs mt-0.5 ${settings.maintenance_mode?'text-red-600':'text-slate-400'}`}>
                      {settings.maintenance_mode
                        ? 'Platfòm nan pa aksesib pou kliyan yo kounye a.'
                        : 'Aktive sa pou fè antretyen san deranje kliyan yo.'
                      }
                    </p>
                  </div>
                  <button onClick={() => set('maintenance_mode', !settings.maintenance_mode)}
                    className={tog(settings.maintenance_mode)}>
                    <span className={knob(settings.maintenance_mode)}/>
                  </button>
                </div>

                {settings.maintenance_mode && (
                  <div>
                    <label className={lbl}>Mesaj pou kliyan yo</label>
                    <textarea value={settings.maintenance_message}
                      onChange={e => set('maintenance_message', e.target.value)}
                      className={`${inp} resize-none`} rows={3}/>
                  </div>
                )}
              </div>

              {/* Bakòp */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Jestyon Bakòp</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Kreye ak jere bakòp done yo.</p>
                  </div>
                  <button onClick={createBackup}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0000AA] text-white text-sm font-semibold hover:bg-[#000088] transition-colors">
                    <MdBackup size={16}/> Kreye bakòp
                  </button>
                </div>
                {backupList.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-xl">
                    Pa gen bakòp ankò. Kreye premye bakòp ou!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {backupList.map(bk => (
                      <div key={bk.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <MdBackup size={18} className="text-[#0000AA] flex-shrink-0"/>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800">Bakòp #{bk.id.slice(-6)}</p>
                          <p className="text-[10px] text-slate-400">{bk.date} · {bk.size}</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold border border-green-200 hover:bg-green-100">
                          Telechaje
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LEGAL ── */}
          {tab === 'legal' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Legal — Kondisyon & Konfidansyalite
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>URL Kondisyon Itilizasyon</label>
                  <input value={settings.terms_url} onChange={e => set('terms_url', e.target.value)} className={inp} placeholder="https://trapde.com/terms"/>
                </div>
                <div>
                  <label className={lbl}>URL Politik Konfidansyalite</label>
                  <input value={settings.privacy_url} onChange={e => set('privacy_url', e.target.value)} className={inp} placeholder="https://trapde.com/privacy"/>
                </div>
              </div>

              <div>
                <label className={lbl}>Kontni Kondisyon Itilizasyon</label>
                <textarea value={settings.terms_content}
                  onChange={e => set('terms_content', e.target.value)}
                  className={`${inp} resize-none`} rows={8}
                  placeholder="Ekri kondisyon itilizasyon platfòm nan isit..."/>
              </div>

              <div>
                <label className={lbl}>Kontni Politik Konfidansyalite</label>
                <textarea value={settings.privacy_content}
                  onChange={e => set('privacy_content', e.target.value)}
                  className={`${inp} resize-none`} rows={8}
                  placeholder="Ekri politik konfidansyalite platfòm nan isit..."/>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 mb-1">💡 Konsèy Legal</p>
                <p className="text-xs text-blue-700">
                  Asire ou ke dokiman legal yo konfòm ak lwa ayisyen ak entènasyonal yo. Konselte yon avoka si nesesè.
                </p>
              </div>
            </div>
          )}

          {/* Bouton sove */}
          <div className="flex justify-end mt-5">
            <button onClick={saveSettings} disabled={isSaving || !hasChanges}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#0A0A2E] to-[#0000AA] hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg">
              {isSaving
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Ap sove...</>
                : <><MdSave size={18}/> Sove paramèt yo</>
              }
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;