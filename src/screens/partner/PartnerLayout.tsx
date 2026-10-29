import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdBed, MdWork, MdFlight, MdShoppingBag,
  MdCarRental, MdLogout, MdMenu, MdClose, MdStar,
  MdNotifications, MdChevronRight, MdPerson, MdSettings,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

export type ServiceType = 'lojman' | 'travay' | 'vwayaj' | 'mache' | 'lokasyon';

interface NavService {
  id:    ServiceType;
  icon:  React.ElementType;
  label: string;
  color: string;
  path:  string;
}

interface NavItem {
  id:       string;
  icon:     React.ElementType;
  label:    string;
  path:     string;
}

interface Props {
  children:       React.ReactNode;
  title?:         string;
  activeService?: ServiceType;
}

const SERVICES: NavService[] = [
  { id: 'lojman',  icon: MdBed,         label: 'Lojman',     color: '#0000AA', path: '/partner/lojman'  },
  { id: 'travay',  icon: MdWork,        label: 'Travay',     color: '#16a34a', path: '/partner/travay'  },
  { id: 'vwayaj',  icon: MdFlight,      label: 'Vwayaj',     color: '#7c3aed', path: '/partner/vwayaj'  },
  { id: 'mache',   icon: MdShoppingBag, label: 'Mache anliy',color: '#FF6600', path: '/partner/mache'   },
  { id: 'lokasyon',icon: MdCarRental,   label: 'Lokasyon',   color: '#0891b2', path: '/partner/lokasyon'},
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: 'profile',  icon: MdPerson,   label: 'Pwofil mwen', path: '/partner/profile'  },
  { id: 'settings', icon: MdSettings, label: 'ParamÃ¨t',     path: '/partner/settings' },
];

const PartnerLayout: React.FC<Props> = ({ children, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [notifCount]                  = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getInitials = () =>
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();

  const handleLogout = async () => { await logout(); navigate('/'); };

  const isServiceActive = (svc: NavService) =>
    location.pathname.startsWith(svc.path);

  const currentService = SERVICES.find(s => location.pathname.startsWith(s.path));

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex">

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• SIDEBAR â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0A0A2E] z-40 flex flex-col transition-all duration-300 shadow-2xl ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>

        {/* Logo + Toggle */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/10 min-h-[64px]">
          {sidebarOpen && (
            <Link to="/" className="ml-1">
              <img src="/TRAPDELOGO.png" alt="TRAPDE"
                className="h-8 w-auto brightness-0 invert" />
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white flex-shrink-0 transition-colors">
            {sidebarOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
          </button>
        </div>

        {/* Profil */}
        {sidebarOpen && (
          <div className="px-4 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {getInitials()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-[#FF6600] font-semibold flex items-center gap-0.5 mt-0.5">
                  <MdStar size={11} /> PatnÃ¨ TRAPDE
                </p>
              </div>
            </div>
            {user?.business_name && (
              <p className="text-xs text-white/40 mt-1.5 truncate">{user.business_name}</p>
            )}
          </div>
        )}

        {/* Dashboard */}
        <div className="px-2 pt-3 pb-1">
          <button
            onClick={() => navigate('/partner/dashboard')}
            title={!sidebarOpen ? 'Dashboard' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/partner/dashboard'
                ? 'bg-white text-[#0A0A2E]'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MdDashboard size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>Tableau de bord</span>}
          </button>
        </div>

        {/* SÃ¨vis yo */}
        <div className="px-2 flex-1 overflow-y-auto">
          {sidebarOpen && (
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 py-2">
              SÃ¨vis ou yo
            </p>
          )}
          <div className="space-y-0.5">
            {SERVICES.map(svc => {
              const active = isServiceActive(svc);
              const Icon   = svc.icon;
              return (
                <button key={svc.id} onClick={() => navigate(svc.path)}
                  title={!sidebarOpen ? svc.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={active ? { color: svc.color } : {}}
                >
                  <Icon size={20} className="flex-shrink-0"
                    style={active ? { color: svc.color } : {}} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{svc.label}</span>
                      {active && <MdChevronRight size={16} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-2 px-2 space-y-0.5">
          {BOTTOM_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
          <button onClick={handleLogout}
            title={!sidebarOpen ? 'Dekonekte' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors">
            <MdLogout size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>Dekonekte</span>}
          </button>
        </div>
      </aside>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• MAIN â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>

        {/* Topbar */}
        <header className="sticky top-0 bg-white border-b border-slate-200 z-30 h-16 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {currentService && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: currentService.color + '15' }}>
                  <currentService.icon size={16} style={{ color: currentService.color }} />
                </div>
                <span className="text-xs text-slate-400">â€º</span>
              </div>
            )}
            <h1 className="text-base font-bold text-slate-900">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
                <MdNotifications size={20} />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF6600] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">Notifikasyon</p>
                  </div>
                  <div className="py-10 text-center">
                    <MdNotifications size={28} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Pa gen notifikasyon.</p>
                  </div>
                </div>
              )}
            </div>
            <Link to="/profile"
              className="w-9 h-9 rounded-full bg-[#0000AA] flex items-center justify-center text-white text-xs font-bold hover:bg-[#000088] transition-colors">
              {getInitials()}
            </Link>
          </div>
        </header>

        {/* Kontni */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay mobil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default PartnerLayout;
