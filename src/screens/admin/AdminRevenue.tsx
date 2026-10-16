/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MdAttachMoney, MdTrendingUp,MdRefresh,
  MdDownload, MdBed, MdWork, MdFlight,
  MdShoppingBag, MdCarRental, MdBarChart,
  MdPeople, MdArrowUpward, MdArrowDownward,
} from 'react-icons/md';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

const MONTHS = ['Jan','Feb','Mar','Avr','Me','Jen','Jul','Out','Sep','Okt','Nov','Des'];

const SERVICE_CFG = [
  { key:'lojman',  label:'Lojman',     icon:MdBed,         color:'#0000AA' },
  { key:'travay',  label:'Travay',     icon:MdWork,        color:'#16a34a' },
  { key:'vwayaj',  label:'Vwayaj',     icon:MdFlight,      color:'#7c3aed' },
  { key:'mache',   label:'Mache anliy',icon:MdShoppingBag, color:'#FF6600' },
  { key:'lokasyon',label:'Lokasyon',   icon:MdCarRental,   color:'#0891b2' },
];

interface RevenueData {
  today:            number;
  this_week:        number;
  this_month:       number;
  this_year:        number;
  commission_today: number;
  commission_month: number;
  commission_year:  number;
  growth_month:     number;
  growth_year:      number;
  monthly:          number[];
  monthly_commission: number[];
  by_service: Record<string,{ revenue:number; commission:number; count:number }>;
  top_partners: { name:string; revenue:number; commission:number; bookings:number }[];
}

type Period = 'day'|'week'|'month'|'year';

const AdminRevenue: React.FC = () => {
  const [data, setData]           = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod]       = useState<Period>('month');
  const [chartType, setChartType] = useState<'bar'|'line'>('bar');
  const [, setError]         = useState<string | null>(null);

  const fetchRevenue = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/revenue/');
      setData(res.data);
    } catch {
      // Done moke pou devlopman
      const monthly = Array.from({length:12},(_)=>Math.floor(Math.random()*500000+100000));
      setData({
        today:0, this_week:0, this_month:0, this_year:0,
        commission_today:0, commission_month:0, commission_year:0,
        growth_month:0, growth_year:0,
        monthly, monthly_commission: monthly.map(v=>Math.floor(v*0.1)),
        by_service:{
          lojman:  {revenue:0,commission:0,count:0},
          travay:  {revenue:0,commission:0,count:0},
          vwayaj:  {revenue:0,commission:0,count:0},
          mache:   {revenue:0,commission:0,count:0},
          lokasyon:{revenue:0,commission:0,count:0},
        },
        top_partners:[],
      });
    } finally { setIsLoading(false); }
  }, []);

  useEffect(()=>{ fetchRevenue(); },[fetchRevenue]);

  const currentRevenue = () => {
    if (!data) return 0;
    switch(period){
      case 'day':   return data.today;
      case 'week':  return data.this_week;
      case 'month': return data.this_month;
      case 'year':  return data.this_year;
    }
  };

  const currentCommission = () => {
    if (!data) return 0;
    switch(period){
      case 'day':   return data.commission_today;
      case 'week':  return Math.floor((data.commission_month||0)/4);
      case 'month': return data.commission_month;
      case 'year':  return data.commission_year;
    }
  };

  const monthly      = data?.monthly ?? Array(12).fill(0);
  const monthlyComm  = data?.monthly_commission ?? Array(12).fill(0);
  const maxVal       = Math.max(...monthly, 1);
  const curMonth     = new Date().getMonth();

  const exportCSV = () => {
    const headers = ['Mwa','Revni Brut','Komisyon TRAPDE','Revni Patnè'];
    const rows    = MONTHS.map((m,i) => [
      m, monthly[i]||0, monthlyComm[i]||0, (monthly[i]||0)-(monthlyComm[i]||0)
    ]);
    const csv  = [headers,...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download=`trapde-revenue-${Date.now()}.csv`; a.click();
  };

  return (
    <AdminLayout title="Revni & Komisyon — Analitik Finansye">

      {/* Peryòd seleksyon */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {([['day','Jodi a'],['week','Semèn sa'],['month','Mwa sa'],['year','Ane sa']] as [Period,string][]).map(([v,l])=>(
            <button key={v} onClick={()=>setPeriod(v)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                period===v ? 'bg-[#0A0A2E] text-white border-[#0A0A2E]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>{l}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRevenue}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <MdRefresh size={18}/>
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
            <MdDownload size={16}/> Eksporte CSV
          </button>
        </div>
      </div>

      {/* Kart prensipal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label:`Revni ${period==='day'?'jodi a':period==='week'?'semèn sa':period==='month'?'mwa sa':'ane sa'}`,
            value:`HTG ${currentRevenue().toLocaleString()}`,
            sub:'Revni brut total', icon:MdAttachMoney,
            color:'from-[#0000AA] to-blue-600',
            trend: period==='month'?data?.growth_month:data?.growth_year,
          },
          {
            label:'Komisyon TRAPDE',
            value:`HTG ${currentCommission().toLocaleString()}`,
            sub:'10% sou chak transaksyon', icon:MdBarChart,
            color:'from-[#FF6600] to-orange-600', trend:null,
          },
          {
            label:'Revni patnè yo',
            value:`HTG ${(currentRevenue()-currentCommission()).toLocaleString()}`,
            sub:'90% aprè komisyon', icon:MdPeople,
            color:'from-green-500 to-green-700', trend:null,
          },
          {
            label:'Kwasans',
            value:`${(period==='month'?data?.growth_month:data?.growth_year)??0}%`,
            sub:'vs peryòd pase', icon:MdTrendingUp,
            color:'from-purple-500 to-purple-700',
            trend: period==='month'?data?.growth_month:data?.growth_year,
          },
        ].map((card,i)=>(
          <div key={i} className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br ${card.color}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <card.icon size={20} className="text-white"/>
              </div>
              {card.trend !== null && card.trend !== undefined && (
                <div className={`flex items-center gap-0.5 text-xs font-bold ${card.trend>=0?'text-green-200':'text-red-200'}`}>
                  {card.trend>=0?<MdArrowUpward size={14}/>:<MdArrowDownward size={14}/>}
                  {Math.abs(card.trend)}%
                </div>
              )}
            </div>
            {isLoading
              ? <div className="h-7 w-24 bg-white/30 rounded-lg animate-pulse mb-1"/>
              : <p className="text-xl font-bold">{card.value}</p>
            }
            <p className="text-xs font-semibold text-white/80 mt-0.5">{card.label}</p>
            <p className="text-xs text-white/50 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Grafik revni pa mwa + Pa sèvis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        {/* Grafik baton pa mwa */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Revni pa Mwa — {new Date().getFullYear()}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Revni brut vs Komisyon TRAPDE</p>
            </div>
            <div className="flex gap-1.5">
              {(['bar','line'] as const).map(t=>(
                <button key={t} onClick={()=>setChartType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    chartType===t?'bg-[#0A0A2E] text-white border-[#0A0A2E]':'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>{t==='bar'?'Baton':'Liy'}</button>
              ))}
            </div>
          </div>
          <div className="p-5">
            {/* Lejann */}
            <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#0000AA]"/>Revni brut</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF6600]"/>Komisyon TRAPDE</span>
            </div>

            {/* Grafik baton */}
            <div className="flex items-end gap-1 h-40">
              {monthly.map((val,i)=>{
                const h     = maxVal>0?(val/maxVal)*100:3;
                const hComm = maxVal>0?((monthlyComm[i]||0)/maxVal)*100:1;
                const isCur = i===curMonth;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 text-center">
                      <p>HTG {(val||0).toLocaleString()}</p>
                      <p className="text-orange-300">HTG {(monthlyComm[i]||0).toLocaleString()}</p>
                    </div>
                    <div className="w-full flex items-end justify-center gap-0.5" style={{height:'140px'}}>
                      <div className={`flex-1 rounded-t transition-all ${isCur?'bg-[#0000AA]':'bg-[#0000AA]/25 group-hover:bg-[#0000AA]/50'}`}
                        style={{height:`${Math.max(h,2)}%`}}/>
                      <div className={`flex-1 rounded-t transition-all ${isCur?'bg-[#FF6600]':'bg-[#FF6600]/30 group-hover:bg-[#FF6600]/60'}`}
                        style={{height:`${Math.max(hComm,1)}%`}}/>
                    </div>
                    <p className={`text-[9px] ${isCur?'text-[#0000AA] font-bold':'text-slate-400'}`}>{MONTHS[i]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revni pa sèvis */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Revni pa Sèvis</h3>
          </div>
          <div className="p-4 space-y-3">
            {SERVICE_CFG.map(svc=>{
              const svcData = data?.by_service?.[svc.key];
              const rev     = svcData?.revenue || 0;
              const total   = Object.values(data?.by_service||{}).reduce((s,v)=>s+(v.revenue||0),0);
              const pct     = total>0?Math.round((rev/total)*100):0;
              return (
                <div key={svc.key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{backgroundColor:svc.color+'15'}}>
                        <svc.icon size={14} style={{color:svc.color}}/>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{svc.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">HTG {rev.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{pct}%</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`,backgroundColor:svc.color}}/>
                  </div>
                </div>
              );
            })}
            {data && Object.values(data.by_service||{}).every(v=>v.revenue===0) && (
              <p className="text-xs text-slate-400 text-center py-4">Pa gen done disponib ankò.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top patnè + Rezime finansye */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Top patnè */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Top Patnè — Revni pi wo</h3>
          </div>
          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} className="flex gap-3 px-5 py-4 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-200"/>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-200 rounded w-1/3"/>
                    <div className="h-2.5 bg-slate-200 rounded w-1/2"/>
                  </div>
                </div>
              ))}
            </div>
          ) : (data?.top_partners||[]).length===0 ? (
            <div className="text-center py-12">
              <MdPeople size={28} className="text-slate-200 mx-auto mb-2"/>
              <p className="text-sm text-slate-400">Pa gen done patnè ankò.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.top_partners||[]).map((p,i)=>(
                <div key={i} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-slate-200 text-slate-600':i===2?'bg-orange-100 text-orange-700':'bg-slate-100 text-slate-500'
                  }`}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.bookings} rezèvasyon</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-green-700">HTG {(p.revenue||0).toLocaleString()}</p>
                    <p className="text-xs text-[#FF6600]">Kom: HTG {(p.commission||0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rezime konplè */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Rezime Finansye Konplè</h3>
          </div>
          <div className="p-5 space-y-3">
            {[
              {label:'Revni jodi a',          value:`HTG ${(data?.today||0).toLocaleString()}`,             color:'text-slate-900'},
              {label:'Revni semèn sa',         value:`HTG ${(data?.this_week||0).toLocaleString()}`,         color:'text-slate-900'},
              {label:'Revni mwa sa',           value:`HTG ${(data?.this_month||0).toLocaleString()}`,        color:'text-slate-900'},
              {label:'Revni ane sa',           value:`HTG ${(data?.this_year||0).toLocaleString()}`,         color:'text-slate-900'},
              {label:'Komisyon mwa sa (10%)',  value:`HTG ${(data?.commission_month||0).toLocaleString()}`,  color:'text-[#FF6600]'},
              {label:'Komisyon ane sa (10%)',  value:`HTG ${(data?.commission_year||0).toLocaleString()}`,   color:'text-[#FF6600]'},
              {label:'Kwasans mwa sa',         value:`${data?.growth_month??0}%`,                           color: (data?.growth_month??0)>=0?'text-green-700':'text-red-600'},
              {label:'Kwasans ane sa',         value:`${data?.growth_year??0}%`,                            color: (data?.growth_year??0)>=0?'text-green-700':'text-red-600'},
            ].map(({label,value,color},i)=>(
              <div key={i} className={`flex justify-between items-center py-2 text-sm ${i===3||i===5?'border-b border-slate-100':''}`}>
                <span className="text-slate-500">{label}</span>
                <span className={`font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRevenue;
