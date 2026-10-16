/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/static-components */
import React, { useState, useEffect, useCallback } from 'react';
import {
   MdTrendingUp, MdPeople,
  MdBed, MdWork, MdFlight, MdShoppingBag, MdCarRental,
  MdAttachMoney, MdLocationOn,
  MdRefresh, MdStar, MdArrowUpward,
  MdArrowDownward, MdPublic,
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

interface StatsData {
  users_growth:    number[];
  listings_growth: number[];
  bookings_growth: number[];
  revenue_growth:  number[];
  top_cities:      {name:string;count:number}[];
  top_countries:   {name:string;count:number}[];
  top_partners:    {name:string;bookings:number;revenue:number;rating:number}[];
  top_users:       {name:string;bookings:number;spent:number}[];
  conversion_rate: number;
  avg_booking_value: number;
  avg_rating:      number;
  services_data:   Record<string,{listings:number;bookings:number;revenue:number}>;
}

const AdminStatistics: React.FC = () => {
  const [data, setData]           = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod]       = useState<'week'|'month'|'year'>('month');

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/admin/statistics/?period=${period}`);
      setData(res.data);
    } catch {
      const mock12 = () => Array.from({length:12},()=>Math.floor(Math.random()*100+10));
      setData({
        users_growth:    mock12(),
        listings_growth: mock12(),
        bookings_growth: mock12(),
        revenue_growth:  mock12().map(v=>v*5000),
        top_cities:      [
          {name:'Pòtoprens',count:0},{name:'Jakmel',count:0},
          {name:'Okap',count:0},{name:'Jeremi',count:0},{name:'Okay',count:0},
        ],
        top_countries:  [{name:'Ayiti',count:0},{name:'Lafrans',count:0},{name:'Etazini',count:0}],
        top_partners:   [],
        top_users:      [],
        conversion_rate: 0,
        avg_booking_value: 0,
        avg_rating: 0,
        services_data: {
          lojman:{listings:0,bookings:0,revenue:0},
          travay:{listings:0,bookings:0,revenue:0},
          vwayaj:{listings:0,bookings:0,revenue:0},
          mache:{listings:0,bookings:0,revenue:0},
          lokasyon:{listings:0,bookings:0,revenue:0},
        },
      });
    } finally { setIsLoading(false); }
  }, [period]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── Komponan grafik baton reutilizable ──
  const BarChart = ({
    data: vals, color, label, height = 120,
  }: {data:number[];color:string;label:string;height?:number}) => {
    const max = Math.max(...vals, 1);
    return (
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-3">{label}</p>
        <div className="flex items-end gap-1" style={{height:`${height}px`}}>
          {vals.map((v,i) => {
            const h = max > 0 ? (v/max)*100 : 0;
            const isCur = i === new Date().getMonth();
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {typeof v === 'number' && v > 1000 ? `HTG ${v.toLocaleString()}` : v}
                </div>
                <div className="w-full flex items-end justify-center" style={{height:`${height-20}px`}}>
                  <div className="w-full rounded-t-lg transition-all"
                    style={{
                      height:`${Math.max(h,2)}%`,
                      backgroundColor: isCur ? color : color+'30',
                    }}/>
                </div>
                <p className="text-[8px] text-slate-400">{MONTHS[i]}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Komponan pi bon KPI ──
  const KPICard = ({label,value,sub,icon:Icon,color,trend}:{
    label:string;value:string|number;sub:string;
    icon:React.ElementType;color:string;trend?:number;
  }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:color+'15'}}>
          <Icon size={20} style={{color}}/>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-bold ${trend>=0?'text-green-600':'text-red-500'}`}>
            {trend>=0?<MdArrowUpward size={14}/>:<MdArrowDownward size={14}/>}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );

  return (
    <AdminLayout title="Estatistik — Analitik Konplè">

      {/* Peryòd + Aksyon */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {([['week','Semèn'],['month','Mwa'],['year','Ane']] as const).map(([v,l])=>(
            <button key={v} onClick={()=>setPeriod(v)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                period===v?'bg-[#0A0A2E] text-white border-[#0A0A2E]':'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>{l}</button>
          ))}
        </div>
        <button onClick={fetchStats}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
          <MdRefresh size={18}/>
        </button>
      </div>

      {/* KPI prensipal */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KPICard label="To konvèsyon" value={`${data?.conversion_rate??0}%`} sub="Vizit → Rezèvasyon" icon={MdTrendingUp} color="#0000AA"/>
        <KPICard label="Valè mwayèn rezèvasyon" value={`HTG ${(data?.avg_booking_value??0).toLocaleString()}`} sub="Pa transaksyon" icon={MdAttachMoney} color="#FF6600"/>
        <KPICard label="Nòt mwayèn platfòm" value={`★ ${data?.avg_rating??0}`} sub="Sou 5 ba sou tout sèvis" icon={MdStar} color="#f59e0b"/>
      </div>

      {/* Grafik kwasans (4 grafik) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {[
          { key:'users_growth',    label:'Kwasans Itilizatè pa mwa',    color:'#0000AA' },
          { key:'listings_growth', label:'Kwasans Anonskman pa mwa',    color:'#7c3aed' },
          { key:'bookings_growth', label:'Kwasans Rezèvasyon pa mwa',   color:'#FF6600' },
          { key:'revenue_growth',  label:'Kwasans Revni pa mwa (HTG)',  color:'#16a34a' },
        ].map(({key,label,color}) => (
          <div key={key} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {isLoading
              ? <div className="space-y-2"><div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"/><div className="h-24 bg-slate-100 rounded-xl animate-pulse mt-3"/></div>
              : <BarChart data={(data as any)?.[key]??Array(12).fill(0)} color={color} label={label}/>
            }
          </div>
        ))}
      </div>

      {/* Sèvis analytics */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Pèfòmans pa Sèvis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Sèvis','Anonskman','Rezèvasyon','Revni total','Pousantaj revni'].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SERVICE_CFG.map(svc => {
                const svcData     = data?.services_data?.[svc.key];
                const rev         = svcData?.revenue || 0;
                const totalRevAll = Object.values(data?.services_data||{}).reduce((s,v)=>s+(v.revenue||0),0);
                const pct         = totalRevAll > 0 ? Math.round((rev/totalRevAll)*100) : 0;
                return (
                  <tr key={svc.key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{backgroundColor:svc.color+'15'}}>
                          <svc.icon size={16} style={{color:svc.color}}/>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{svc.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{svcData?.listings||0}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{svcData?.bookings||0}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-green-700">HTG {(rev).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{width:`${pct}%`,backgroundColor:svc.color}}/>
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top vil + Peyi + Patnè + Itilizatè */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* Top vil */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Vil ki pi aktif yo</h3>
          </div>
          <div className="p-4 space-y-3">
            {(data?.top_cities||[]).map((city,i) => {
              const max = data?.top_cities?.[0]?.count || 1;
              const pct = max > 0 ? Math.round((city.count/max)*100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-slate-200 text-slate-600':i===2?'bg-orange-100 text-orange-700':'bg-slate-100 text-slate-500'
                      }`}>{i+1}</span>
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                        <MdLocationOn size={14} className="text-slate-400"/>
                        {city.name}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{city.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden ml-7">
                    <div className="h-full bg-[#0000AA] rounded-full" style={{width:`${pct}%`}}/>
                  </div>
                </div>
              );
            })}
            {(!data?.top_cities||data.top_cities.length===0) && (
              <p className="text-xs text-slate-400 text-center py-4">Pa gen done disponib ankò.</p>
            )}
          </div>
        </div>

        {/* Top patnè */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Top Patnè yo</h3>
          </div>
          {(data?.top_partners||[]).length === 0 ? (
            <div className="text-center py-10">
              <MdPeople size={28} className="text-slate-200 mx-auto mb-2"/>
              <p className="text-sm text-slate-400">Pa gen done patnè ankò.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.top_partners||[]).map((p,i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-slate-200 text-slate-600':i===2?'bg-orange-100 text-orange-700':'bg-slate-100 text-slate-500'
                  }`}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{p.bookings} rezèvasyon</span>
                      {p.rating > 0 && <span>· ★{p.rating.toFixed(1)}</span>}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-700 flex-shrink-0">
                    HTG {(p.revenue||0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top peyi */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Peyi pi aktif yo</h3>
          </div>
          <div className="p-4 space-y-3">
            {(data?.top_countries||[]).map((country,i) => {
              const max = data?.top_countries?.[0]?.count || 1;
              const pct = max > 0 ? Math.round((country.count/max)*100) : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    i===0?'bg-yellow-100 text-yellow-700':'bg-slate-100 text-slate-500'
                  }`}>{i+1}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <MdPublic size={14} className="text-slate-400"/>
                    <span className="text-sm font-medium text-slate-700 flex-1">{country.name}</span>
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF6600] rounded-full" style={{width:`${pct}%`}}/>
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-6 text-right">{country.count}</span>
                  </div>
                </div>
              );
            })}
            {(!data?.top_countries||data.top_countries.length===0) && (
              <p className="text-xs text-slate-400 text-center py-4">Pa gen done disponib ankò.</p>
            )}
          </div>
        </div>

        {/* Top itilizatè */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Top Itilizatè yo — Pi gwo depans</h3>
          </div>
          {(data?.top_users||[]).length === 0 ? (
            <div className="text-center py-10">
              <MdPeople size={28} className="text-slate-200 mx-auto mb-2"/>
              <p className="text-sm text-slate-400">Pa gen done itilizatè ankò.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.top_users||[]).map((u,i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-slate-200 text-slate-600':'bg-slate-100 text-slate-500'
                  }`}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.bookings} rezèvasyon</p>
                  </div>
                  <p className="text-sm font-bold text-blue-700 flex-shrink-0">
                    HTG {(u.spent||0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;