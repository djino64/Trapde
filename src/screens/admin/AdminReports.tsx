/* eslint-disable react-hooks/purity */
import React, { useState } from 'react';
import {
  MdArticle, MdDownload,  MdAttachMoney,
  MdCalendarToday, MdBed, 
  MdCheckCircle, MdWarning, MdClose, MdPictureAsPdf,
  MdTableChart, MdPerson, MdBusiness,
  MdDateRange,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

type ReportType = 'partners'|'users'|'financial'|'payments'|'listings'|'bookings';
type Format     = 'pdf'|'excel'|'csv';

interface ReportConfig {
  type:    ReportType;
  label:   string;
  desc:    string;
  icon:    React.ElementType;
  color:   string;
  bg:      string;
  border:  string;
  fields:  string[];
}

const REPORT_CONFIGS: ReportConfig[] = [
  {
    type:'partners', label:'Rapò Patnè', icon:MdBusiness,
    desc:'Lis konplè patnè yo ak estatistik, revni, ak pèfòmans yo.',
    color:'#0000AA', bg:'bg-blue-50', border:'border-blue-200',
    fields:['Non','Imèl','Biznis','Sèvis','Ofri','Rezèvasyon','Revni','Komisyon','Statè','Dat enskripsyon'],
  },
  {
    type:'users', label:'Rapò Itilizatè', icon:MdPerson,
    desc:'Lis tout itilizatè yo ak istorik ak aktivite yo.',
    color:'#7c3aed', bg:'bg-violet-50', border:'border-violet-200',
    fields:['Non','Imèl','Vil','Peyi','Rezèvasyon','Depans','Avi','Statè','Dat enskripsyon'],
  },
  {
    type:'financial', label:'Rapò Finansye', icon:MdAttachMoney,
    desc:'Revni total, komisyon, ak analiz finansye pa peryòd.',
    color:'#16a34a', bg:'bg-green-50', border:'border-green-200',
    fields:['Peryòd','Revni brut','Komisyon','Revni patnè','Nòm transaksyon','Kwasans'],
  },
  {
    type:'payments', label:'Rapò Peman', icon:MdCalendarToday,
    desc:'Tout transaksyon peman avèk detay konplè yo.',
    color:'#FF6600', bg:'bg-orange-50', border:'border-orange-200',
    fields:['ID Trans.','Kliyan','Patnè','Sèvis','Montan','Komisyon','Metòd','Statè','Dat'],
  },
  {
    type:'listings', label:'Rapò Anonskman', icon:MdBed,
    desc:'Lis tout anonskman yo ak vizit, rezèvasyon, ak pèfòmans.',
    color:'#0891b2', bg:'bg-cyan-50', border:'border-cyan-200',
    fields:['Tit','Sèvis','Patnè','Vil','Pri','Vizit','Rezèvasyon','Nòt','Statè','Dat'],
  },
  {
    type:'bookings', label:'Rapò Rezèvasyon', icon:MdCalendarToday,
    desc:'Tout rezèvasyon yo ak enfòmasyon finansye konplè.',
    color:'#dc2626', bg:'bg-red-50', border:'border-red-200',
    fields:['ID','Kliyan','Lojman','Patnè','Check-in','Check-out','Nwit','Montan','Komisyon','Statè'],
  },
];

interface ExportJob {
  id:        string;
  type:      ReportType;
  format:    Format;
  status:    'pending'|'processing'|'done'|'error';
  progress:  number;
  filename:  string;
  created_at:string;
}

const AdminReports: React.FC = () => {
  const [selectedType, setSelectedType]   = useState<ReportType | null>(null);
  const [format, setFormat]               = useState<Format>('csv');
  const [dateFrom, setDateFrom]           = useState('');
  const [dateTo, setDateTo]               = useState('');
  const [jobs, setJobs]                   = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting]     = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [success, setSuccess]             = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(null), 4000);
  };

  const generateReport = async () => {
    if (!selectedType) { setError('Chwazi yon tip rapò.'); return; }
    setIsExporting(true);
    setError(null);

    const jobId  = `job-${Date.now()}`;
    const config = REPORT_CONFIGS.find(r => r.type === selectedType)!;
    const newJob: ExportJob = {
      id: jobId, type: selectedType, format,
      status: 'processing', progress: 0,
      filename: `trapde-${selectedType}-${Date.now()}.${format}`,
      created_at: new Date().toISOString(),
    };
    setJobs(p => [newJob, ...p]);

    // Simile pwogresyon
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 20 + 10);
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setJobs(p => p.map(j => j.id === jobId ? { ...j, status: 'done', progress: 100 } : j));
        setIsExporting(false);
        showSuccess(`Rapò ${config.label} jenere avèk siksè!`);
        // Telechaje otomatikman
        setTimeout(() => downloadReport(jobId, selectedType, format), 500);
      }
      setJobs(p => p.map(j => j.id === jobId ? { ...j, progress: Math.min(prog, 99) } : j));
    }, 300);

    try {
      const res = await api.post('/admin/reports/generate/', {
        type: selectedType, format,
        date_from: dateFrom || undefined,
        date_to:   dateTo   || undefined,
      });
      clearInterval(interval);
      setJobs(p => p.map(j => j.id === jobId ? { ...j, status: 'done', progress: 100 } : j));
      setIsExporting(false);
      showSuccess(`Rapò ${config.label} jenere avèk siksè!`);
      if (res.data.download_url) window.open(res.data.download_url, '_blank');
    } catch {
      // Moke — jenere done CSV lokal
    }
  };

  const downloadReport = (_jobId: string, type: ReportType, fmt: Format) => {
    const config  = REPORT_CONFIGS.find(r => r.type === type)!;
    const headers = config.fields;
    const rows: string[][] = [];

    if (fmt === 'csv') {
      const content = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
      const blob    = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' });
      const url     = URL.createObjectURL(blob);
      const a       = document.createElement('a');
      a.href = url;
      a.download = `trapde-${type}-${Date.now()}.csv`;
      a.click();
    } else if (fmt === 'excel') {
      const content = headers.join('\t') + '\n';
      const blob    = new Blob([content], { type: 'application/vnd.ms-excel' });
      const url     = URL.createObjectURL(blob);
      const a       = document.createElement('a');
      a.href = url;
      a.download = `trapde-${type}-${Date.now()}.xls`;
      a.click();
    } else {
      showSuccess('Rapò PDF — ap disponib byento.');
    }
  };

  const removeJob = (id: string) => setJobs(p => p.filter(j => j.id !== id));

  return (
    <AdminLayout title="Rapò & Eksportasyon">

      {error   && <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600 shadow-sm"><MdWarning size={16}/>{error}<button onClick={()=>setError(null)} className="ml-auto"><MdClose size={15}/></button></div>}
      {success && <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700 shadow-sm"><MdCheckCircle size={16}/>{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Konfigirasyon rapò ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Chwazi tip rapò */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">1. Chwazi tip rapò</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_CONFIGS.map(cfg => {
                const Icon    = cfg.icon;
                const isSelec = selectedType === cfg.type;
                return (
                  <label key={cfg.type}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelec
                        ? `${cfg.border} ${cfg.bg}`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                    <input type="radio" name="report_type" value={cfg.type}
                      checked={isSelec} onChange={() => setSelectedType(cfg.type)} className="hidden"/>
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 border ${cfg.border}`}>
                      <Icon size={20} style={{ color: cfg.color }}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${isSelec ? '' : 'text-slate-800'}`}
                        style={isSelec ? { color: cfg.color } : {}}>
                        {cfg.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight">{cfg.desc}</p>
                    </div>
                    {isSelec && (
                      <MdCheckCircle size={18} style={{ color: cfg.color }} className="flex-shrink-0 mt-0.5"/>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Peryòd */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">2. Peryòd (fakiltatif)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <MdDateRange size={13} className="inline mr-1"/>Dat kòmansman
                </label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  <MdDateRange size={13} className="inline mr-1"/>Dat fen
                </label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-[#0000AA] focus:bg-white"
                  min={dateFrom}/>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {[
                ['jodi a','today'],
                ['Semèn sa','week'],
                ['Mwa sa','month'],
                ['Ane sa','year'],
              ].map(([l, v]) => (
                <button key={v} onClick={() => {
                  const now   = new Date();
                  const today = now.toISOString().split('T')[0];
                  if (v === 'today') { setDateFrom(today); setDateTo(today); }
                  else if (v === 'week') {
                    const d = new Date(now); d.setDate(d.getDate() - 7);
                    setDateFrom(d.toISOString().split('T')[0]); setDateTo(today);
                  } else if (v === 'month') {
                    setDateFrom(today.substring(0, 7) + '-01'); setDateTo(today);
                  } else {
                    setDateFrom(today.substring(0, 4) + '-01-01'); setDateTo(today);
                  }
                }}
                  className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Fòma */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">3. Chwazi fòma</h3>
            <div className="grid grid-cols-3 gap-3">
              {([
                ['csv',   'CSV',   MdTableChart,     '#16a34a', 'Pou Excel, Google Sheets'],
                ['excel', 'Excel', MdTableChart,     '#0000AA', 'Fichye .xls natif'],
                ['pdf',   'PDF',   MdPictureAsPdf,   '#dc2626', 'Pou enprime ak pataje'],
              ] as [Format, string, React.ElementType, string, string][]).map(([v, l, Icon, color, desc]) => (
                <label key={v}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    format === v
                      ? 'border-slate-700 bg-slate-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                  <input type="radio" name="format" value={v} checked={format === v}
                    onChange={() => setFormat(v)} className="hidden"/>
                  <Icon size={24} style={{ color: format === v ? color : '#94a3b8' }}/>
                  <span className={`text-sm font-bold ${format === v ? 'text-slate-900' : 'text-slate-600'}`}>{l}</span>
                  <span className="text-[10px] text-slate-400 text-center leading-tight">{desc}</span>
                  {format === v && <MdCheckCircle size={14} className="text-green-600"/>}
                </label>
              ))}
            </div>
          </div>

          {/* Bouton jenere */}
          <button onClick={generateReport} disabled={isExporting || !selectedType}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#0A0A2E] to-[#0000AA] hover:opacity-90 transition-opacity disabled:opacity-40 shadow-lg">
            {isExporting
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>Ap jenere rapò...</>
              : <><MdDownload size={22}/>Jenere & Telechaje Rapò</>
            }
          </button>
        </div>

        {/* ── Pano dwat ── */}
        <div className="space-y-5">

          {/* Aperçu champ */}
          {selectedType && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kolòn nan rapò a</h3>
              </div>
              <div className="p-4">
                <div className="space-y-1.5">
                  {REPORT_CONFIGS.find(r => r.type === selectedType)?.fields.map((field, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <MdCheckCircle size={13} className="text-green-500 flex-shrink-0"/>
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fòma info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-2">📋 Fòma disponib</p>
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <MdTableChart size={14} className="text-green-600 flex-shrink-0 mt-0.5"/>
                <div><span className="font-bold">CSV</span> — Pou Excel ak Google Sheets. Sipòte UTF-8 pou karaktè kreyòl.</div>
              </div>
              <div className="flex items-start gap-2">
                <MdTableChart size={14} className="text-blue-600 flex-shrink-0 mt-0.5"/>
                <div><span className="font-bold">Excel</span> — Fòma natif Microsoft Excel (.xls).</div>
              </div>
              <div className="flex items-start gap-2">
                <MdPictureAsPdf size={14} className="text-red-600 flex-shrink-0 mt-0.5"/>
                <div><span className="font-bold">PDF</span> — Pou enprime ak pataje ofisyèlman.</div>
              </div>
            </div>
          </div>

          {/* Travay récèn */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-4 py-3.5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rapò récèn</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {jobs.map(job => {
                  const cfg    = REPORT_CONFIGS.find(r => r.type === job.type)!;
                  const Icon   = cfg?.icon || MdArticle;
                  return (
                    <div key={job.id} className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: (cfg?.color || '#0000AA') + '15' }}>
                          <Icon size={16} style={{ color: cfg?.color || '#0000AA' }}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{cfg?.label}</p>
                          <p className="text-[10px] text-slate-400">{job.format.toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {job.status === 'processing' && (
                            <div className="w-4 h-4 border-2 border-[#0000AA] border-t-transparent rounded-full animate-spin"/>
                          )}
                          {job.status === 'done' && (
                            <button onClick={() => downloadReport(job.id, job.type, job.format)}
                              className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600">
                              <MdDownload size={14}/>
                            </button>
                          )}
                          {job.status === 'error' && <MdWarning size={16} className="text-red-500"/>}
                          <button onClick={() => removeJob(job.id)}
                            className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                            <MdClose size={13}/>
                          </button>
                        </div>
                      </div>
                      {job.status === 'processing' && (
                        <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0000AA] rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}/>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;