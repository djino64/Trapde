import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdPeople, MdPerson, MdCampaign, MdFactCheck,
  MdCalendarToday, MdPayment, MdAttachMoney, MdMessage,
  MdNotifications, MdStar, MdBarChart, MdBuild, MdAdminPanelSettings,
  MdSecurity, MdArticle, MdSettings, MdLogout, MdMenu, MdClose,
  MdKeyboardArrowDown, MdKeyboardArrowUp, MdChevronRight,
  MdSearch, MdDarkMode, MdLightMode,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  id:       string;
  icon:     React.ElementType;
  label:    string;
  path?:    string;
  badge?:   number;
  children?: { label: string; path: string; icon: React.ElementType }[];
}

interface Props {
  children: React.ReactNode;
  title?:   string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',    icon: MdDashboard,          label: 'Dashboard',                path: '/admin/dashboard'           },
  { id: 'partners',     icon: MdPeople,             label: 'Jestyon Patnè yo',
    children: [
      { label: 'Tout patnè yo',     path: '/admin/partners',          icon: MdPeople         },
      { label: 'Patnè annatant',    path: '/admin/partners/pending',  icon: MdFactCheck      },
      { label: 'Patnè bloke',       path: '/admin/partners/blocked',  icon: MdSecurity       },
    ]
  },
  { id: 'users',        icon: MdPerson,             label: 'Jestyon Itilizatè yo',
    children: [
      { label: 'Tout itilizatè',    path: '/admin/users',             icon: MdPerson         },
      { label: 'Itilizatè bloke',   path: '/admin/users/blocked',     icon: MdSecurity       },
    ]
  },
  { id: 'listings',     icon: MdCampaign,           label: 'Jestyon Anonskman yo',     path: '/admin/listings'            },
  { id: 'validation',   icon: MdFactCheck,          label: 'Validasyon Anonskman',      path: '/admin/validation'          },
  { id: 'bookings',     icon: MdCalendarToday,      label: 'Rezèvasyon yo',             path: '/admin/bookings'            },
  { id: 'payments',     icon: MdPayment,            label: 'Peman yo',                  path: '/admin/payments'            },
  { id: 'revenue',      icon: MdAttachMoney,        label: 'Revni & Komisyon',          path: '/admin/revenue'             },
  { id: 'messages',     icon: MdMessage,            label: 'Mesaj yo',                  path: '/admin/messages',  badge: 0 },
  { id: 'notifs',       icon: MdNotifications,      label: 'Notifikasyon yo',           path: '/admin/notifications'       },
  { id: 'reviews',      icon: MdStar,               label: 'Avi & Signalman',           path: '/admin/reviews'             },
  { id: 'stats',        icon: MdBarChart,           label: 'Estatistik',                path: '/admin/statistics'          },
  { id: 'services',     icon: MdBuild,              label: 'Jestyon Sèvis yo',
    children: [
      { label: 'Lojman',            path: '/admin/services/lojman',   icon: MdBuild          },
      { label: 'Travay',            path: '/admin/services/travay',   icon: MdBuild          },
      { label: 'Vwayaj',            path: '/admin/services/vwayaj',   icon: MdBuild          },
      { label: 'Mache anliy',       path: '/admin/services/mache',    icon: MdBuild          },
      { label: 'Lokasyon',          path: '/admin/services/lokasyon', icon: MdBuild          },
    ]
  },
  { id: 'admins',       icon: MdAdminPanelSettings, label: 'Jestyon Admin yo',          path: '/admin/admins'              },
  { id: 'security',     icon: MdSecurity,           label: 'Sekirite',                  path: '/admin/security'            },
  { id: 'reports',      icon: MdArticle,            label: 'Rapò',                      path: '/admin/reports'             },
  { id: 'settings',     icon: MdSettings,           label: 'Paramèt',                   path: '/admin/settings'            },
];

const AdminLayout: React.FC<Props> = ({ children, title = 'Dashboard Admin' }) => {
  const { user, logout }   = useAuth();
  const location           = useLocation();
  const navigate           = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [darkMode, setDarkMode]       = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef  = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else          document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const getInitials = () =>
    `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();

  const isActive = (item: NavItem) =>
    (item.path && location.pathname === item.path) ||
    item.children?.some(c => location.pathname.startsWith(c.path));

  const handleNav = (item: NavItem) => {
    if (item.children) setExpanded(expanded === item.id ? null : item.id);
    else if (item.path) navigate(item.path);
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-950' : 'bg-[#F0F2F5]'}`}>

      {/* ══════ SIDEBAR ══════ */}
      <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 shadow-2xl
        ${sidebarOpen ? 'w-64' : 'w-16'}
        ${darkMode ? 'bg-gray-900 border-r border-gray-800' : 'bg-[#0A0A2E]'}`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/10 min-h-[64px]">
          {sidebarOpen && (
            <div className="flex items-center gap-2 ml-1">
              <img src="/src/assets/images/TRAPDELOGO.png" alt="TRAPDE"
                className="h-7 w-auto brightness-0 invert" />
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white flex-shrink-0 transition-colors">
            {sidebarOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
          </button>
        </div>

        {/* Admin info */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6600] to-[#cc4400] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg">
                {getInitials()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-[#FF6600] font-semibold flex items-center gap-1">
                  <MdAdminPanelSettings size={11} /> Super Administratè
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_ITEMS.map(item => {
            const active   = isActive(item);
            const isExpand = expanded === item.id;
            const Icon     = item.icon;

            return (
              <div key={item.id}>
                <button onClick={() => handleNav(item)}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-gradient-to-r from-[#FF6600] to-[#cc4400] text-white shadow-lg shadow-orange-500/20'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }`}>
                  <div className="relative flex-shrink-0">
                    <Icon size={18} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.children && (isExpand ? <MdKeyboardArrowUp size={15} /> : <MdKeyboardArrowDown size={15} />)}
                    </>
                  )}
                </button>

                {item.children && isExpand && sidebarOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map(child => {
                      const CIcon   = child.icon;
                      const cActive = location.pathname === child.path || location.pathname.startsWith(child.path + '/');
                      return (
                        <Link key={child.path} to={child.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            cActive ? 'bg-white/20 text-white' : 'text-white/40 hover:bg-white/10 hover:text-white'
                          }`}>
                          <CIcon size={14} className="flex-shrink-0" />
                          <span className="truncate">{child.label}</span>
                          {cActive && <MdChevronRight size={13} className="ml-auto" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-2">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <MdLogout size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Dekonekte</span>}
          </button>
        </div>
      </aside>

      {/* ══════ MAIN ══════ */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>

        {/* Topbar */}
        <header className={`sticky top-0 z-30 h-16 px-6 flex items-center justify-between shadow-sm border-b ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
        }`}>
          <h1 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h1>

          <div className="flex items-center gap-2">

            {/* Rechèch global */}
            <div className="relative" ref={searchRef}>
              <button onClick={() => setSearchOpen(!searchOpen)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                <MdSearch size={18} />
              </button>
              {searchOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border z-50 overflow-hidden ${
                  darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'
                }`}>
                  <div className="p-3 border-b border-slate-100">
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      autoFocus placeholder="Rechèch global — patnè, itilizatè, peman..."
                      className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-[#FF6600] ${
                        darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`} />
                  </div>
                  {searchQuery && (
                    <div className="p-2">
                      <p className="text-xs text-slate-400 px-2 py-1">Rezilta yo ap parèt isit...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {darkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
            </button>

            {/* Notifikasyon */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                <MdNotifications size={18} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF6600] rounded-full border-2 border-white" />
              </button>
              {notifOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border z-50 overflow-hidden ${
                  darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'
                }`}>
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Notifikasyon Admin</p>
                    <button className="text-xs text-[#FF6600] hover:underline font-medium">Efase tout</button>
                  </div>
                  <div className="py-8 text-center">
                    <MdNotifications size={28} className={darkMode ? 'text-gray-600 mx-auto mb-2' : 'text-slate-200 mx-auto mb-2'} />
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Pa gen notifikasyon.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar admin */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6600] to-[#cc4400] flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Kontni */}
        <main className={`flex-1 p-6 overflow-auto ${darkMode ? 'text-white' : ''}`}>
          {children}
        </main>

        {/* Footer */}
        <footer className={`px-6 py-3 border-t text-xs text-center ${
          darkMode ? 'border-gray-800 text-gray-600' : 'border-slate-200 text-slate-400'
        }`}>
          TRAPDE Admin Panel © {new Date().getFullYear()} 
        </footer>
      </div>

      {/* Overlay mobil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;