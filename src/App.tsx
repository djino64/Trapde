// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import HomeScreen from './screens/Home/HomeScreen';
// import LoginScreen from './screens/Auth/LoginScreen';
// import RegisterScreen from './screens/Auth/RegisterScreen';
// import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
// import VerifyEmailScreen from './screens/Auth/VerifyEmailScreen';
// import AppPromotion from './screens/Home/AppPromotion';
// import PopularDestinations from './screens/Home/PopularDestinations';
// import AccommodationScreen from './screens/partner/lojman/AccommodationScreen';
// import AccommodationListScreen from './screens/partner/lojman/AccommodationListScreen';
// import AccommodationDetails from './screens/Accommodation/AccommodationDetail';
// import AccommodationList from './screens/Accommodation/AccommodationList';
// import BookingPage from './screens/Bookings/BookingPage';
// import BookingDetails from './screens/Bookings/BookingDetail';
// import ProfileScreen from './screens/Profile/ProfileScreen';
// import PartnerDashboard from './screens/partner/PartnerDashboard';
// import PartnerBookings from './screens/partner/PartnerBookings';
// import PartnerServiceHub from './screens/partner/PartnerServiceHub';
// import PartnerProfile from './screens/partner/PartnerProfile';
// import PartnerSettings from './screens/partner/PartnerSettings';
// import PrivateRoute from './components/PrivateRoute';
// import AdminDashboard from './screens/admin/AdminDashboard';
// import AdminPartners from './screens/admin/AdminPartners';
// import AdminUsers from './screens/admin/AdminUsers';
// import AdminListings from './screens/admin/AdminListings';
// import AdminValidation from './screens/admin/AdminValidation';
// import AdminPlaceholder from './screens/admin/AdminPlaceholder';
// import AdminServices from './screens/admin/AdminServices';
// import AdminBookings from './screens/admin/AdminBookings';
// import AdminPayments from './screens/admin/AdminPayments';
// import AdminReports from './screens/admin/AdminReports';
// import AdminStatistics from './screens/admin/AdminStatistics';
// import AdminReviews from './screens/admin/AdminReviews';
// import AdminSettings from './screens/admin/AdminSettings';
// import AdminSecurity from './screens/admin/AdminSecurity';


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/login" element={<LoginScreen />} />
//         <Route path="/register" element={<RegisterScreen />} />
//         <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
//         <Route path="/verify-email/:token" element={<VerifyEmailScreen />} />
//         <Route path="/app-promotion" element={<AppPromotion />} />
//         <Route path="/popular-destinations" element={<PopularDestinations />} />
//         <Route path="/Profile" element={<ProfileScreen />} />
//         <Route path="/profile" element={<ProfileScreen />} />
//         <Route path="/partner/profile" element={<PartnerProfile />} />
//         <Route path="/partner/settings" element={<PartnerSettings />} />
//         <Route path="/partner/dashboard" element={<PartnerDashboard />} />
//         <Route path="/partner/bookings" element={<PartnerBookings />} />
//         <Route path="/partner/services" element={<PartnerServiceHub />} />
//         <Route path="/partner/lojman" element={<AccommodationListScreen />} />
//         <Route path="/partner/lojman/create" element={<AccommodationScreen />} />
//         <Route path="/partner/lojman/edit/:id" element={<AccommodationScreen />} />
//         <Route path="/dashboard" element={<PartnerDashboard />} />
//         <Route path="/accommodation" element={<AccommodationList />} />
//         <Route path="/accommodation/:id" element={<AccommodationDetails />} />
//         <Route path="/bookings" element={<BookingPage />} />
//         <Route path="/bookings/:id" element={<BookingDetails />} />


//         <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
//         <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
//         <Route path="/admin/partners" element={<PrivateRoute requiredRole="admin"><AdminPartners /></PrivateRoute>} />
//         <Route path="/admin/users" element={<PrivateRoute requiredRole="admin"><AdminUsers /></PrivateRoute>} />
//         <Route path="/admin/listings" element={<PrivateRoute requiredRole="admin"><AdminListings /></PrivateRoute>} />
//         <Route path="/admin/validation" element={<PrivateRoute requiredRole="admin"><AdminValidation /></PrivateRoute>} />
//         <Route path="/admin/bookings" element={<PrivateRoute requiredRole="admin"><AdminBookings /></PrivateRoute>} />
//         <Route path="/admin/payments" element={<PrivateRoute requiredRole="admin"><AdminPayments /></PrivateRoute>} />
//         <Route path="/admin/revenue" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Revenus & Commissions" description="Analyse des revenus, commissions et prévisions." /></PrivateRoute>} />
//         <Route path="/admin/messages" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Messages" description="Messagerie interne, archives et pièces jointes." /></PrivateRoute>} />
//         <Route path="/admin/notifications" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Notifications" description="Centre de notification multi-canal et historique." /></PrivateRoute>} />
//         <Route path="/admin/reports" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Avis & Signalements" description="Modération des avis, signalements et sanctions." /></PrivateRoute>} />
//         <Route path="/admin/stats" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Statistiques" description="Analyse avancée des inscriptions, annonces et paiements." /></PrivateRoute>} />
//         <Route path="/admin/services" element={<PrivateRoute requiredRole="admin"><AdminServices /></PrivateRoute>} />
//         <Route path="/admin/admins" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Gestion des administrateurs" description="Gestion des rôles, permissions et journal d’actions." /></PrivateRoute>} />
//         <Route path="/admin/security" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Sécurité" description="Historique des connexions, blocage IP et sessions actives." /></PrivateRoute>} />
//         <Route path="/admin/reports-module" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Rapports" description="Export PDF, Excel et CSV des données plateforme." /></PrivateRoute>} />
//         <Route path="/admin/settings" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Paramètres" description="Configuration du logo, commissions, langues et maintenance." /></PrivateRoute>} />
//         <Route path="/admin/reviews" element={<PrivateRoute requiredRole="admin"><AdminReviews /></PrivateRoute>} />
//         <Route path="/admin/revnue" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Revenus & Commissions" description="Analyse des revenus, commissions et prévisions." /></PrivateRoute>} />
//         <Route path="/admin/analytics" element={<PrivateRoute requiredRole="admin"><AdminStatistics /></PrivateRoute>} />
//         <Route path="/admin/feedback" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Feedback" description="Collecte et analyse des retours utilisateurs." /></PrivateRoute>} />
//         <Route path="/admin/reports-analytics" element={<PrivateRoute requiredRole="admin"><AdminReports /></PrivateRoute>} />
//         <Route path="/admin/security" element={<PrivateRoute requiredRole="admin"><AdminSecurity /></PrivateRoute>} />
//         <Route path="/admin/settings-advanced" element={<PrivateRoute requiredRole="admin"><AdminSettings /></PrivateRoute>} />
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// ── Auth ──────────────────────────────────────────────────────────────────────
import LoginScreen          from './screens/Auth/LoginScreen';
import RegisterScreen       from './screens/Auth/RegisterScreen';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
import VerifyEmailScreen    from './screens/Auth/VerifyEmailScreen';

// ── Home / Public ─────────────────────────────────────────────────────────────
import HomeScreen           from './screens/Home/HomeScreen';
import AppPromotion         from './screens/Home/AppPromotion';
import PopularDestinations  from './screens/Home/PopularDestinations';

// ── Accommodation (public) ───────────────────────────────────────────────────
import AccommodationList    from './screens/Accommodation/AccommodationList';
import AccommodationDetails from './screens/Accommodation/AccommodationDetail';

// ── Bookings (public) ────────────────────────────────────────────────────────
import BookingPage          from './screens/Bookings/BookingPage';
import BookingDetails       from './screens/Bookings/BookingDetail';

// ── Profile ───────────────────────────────────────────────────────────────────
import ProfileScreen        from './screens/Profile/ProfileScreen';

// ── Partner ───────────────────────────────────────────────────────────────────
import PartnerDashboard         from './screens/partner/PartnerDashboard';
import PartnerBookings          from './screens/partner/PartnerBookings';
import PartnerServiceHub        from './screens/partner/PartnerServiceHub';
import PartnerProfile           from './screens/partner/PartnerProfile';
import PartnerSettings          from './screens/partner/PartnerSettings';
import AccommodationListScreen  from './screens/partner/lojman/AccommodationListScreen';
import AccommodationScreen      from './screens/partner/lojman/AccommodationScreen';

// ── Admin ────────────────────────────────────────────────────────────────────
import AdminLayout        from './screens/admin/AdminLayout';
import AdminDashboard     from './screens/admin/AdminDashboard';
import AdminPartners      from './screens/admin/AdminPartners';
import AdminUsers         from './screens/admin/AdminUsers';
import AdminListings      from './screens/admin/AdminListings';
import AdminValidation    from './screens/admin/AdminValidation';
import AdminBookings      from './screens/admin/AdminBookings';
import AdminPayments      from './screens/admin/AdminPayments';
import AdminRevenue       from './screens/admin/AdminRevenue';
// import AdminMessages      from './screens/admin/AdminMessages';
// import AdminNotifications from './screens/admin/AdminNotifications';
import AdminReviews       from './screens/admin/AdminReviews';
import AdminStatistics    from './screens/admin/AdminStatistics';
import AdminServices      from './screens/admin/AdminServices';
import AdminAdmins        from './screens/admin/AdminAdmins';
import AdminSecurity      from './screens/admin/AdminSecurity';
import AdminReports       from './screens/admin/AdminReports';
import AdminSettings      from './screens/admin/AdminSettings';

// ── Guards ────────────────────────────────────────────────────────────────────
import PrivateRoute from './components/PrivateRoute';

// ─────────────────────────────────────────────────────────────────────────────
// Guard dedye pou admin — pi pwòp ke repete PrivateRoute pou chak rout
// ─────────────────────────────────────────────────────────────────────────────
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PrivateRoute requiredRole="admin">{children}</PrivateRoute>
);

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ══════════════════════════════════════
            PUBLIC
        ══════════════════════════════════════ */}
        <Route path="/"                         element={<HomeScreen />} />
        <Route path="/app-promotion"            element={<AppPromotion />} />
        <Route path="/popular-destinations"     element={<PopularDestinations />} />

        {/* Accommodation public */}
        <Route path="/accommodation"            element={<AccommodationList />} />
        <Route path="/accommodation/:id"        element={<AccommodationDetails />} />
        

        {/* Bookings */}
        <Route path="/bookings"                 element={<BookingPage />} />
        <Route path="/bookings/:id"             element={<BookingDetails />} />

        {/* Profile */}
        <Route path="/profile"                  element={<ProfileScreen />} />
        <Route path="/Profile"                  element={<Navigate to="/profile" replace />} />

        {/* ══════════════════════════════════════
            AUTH
        ══════════════════════════════════════ */}
        <Route path="/login"                    element={<LoginScreen />} />
        <Route path="/register"                 element={<RegisterScreen />} />
        <Route path="/forgot-password"          element={<ForgotPasswordScreen />} />
        <Route path="/verify-email/:token"      element={<VerifyEmailScreen />} />

        {/* ══════════════════════════════════════
            PARTNER
        ══════════════════════════════════════ */}
        <Route path="/dashboard"                element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="/partner/dashboard"        element={<PartnerDashboard />} />
        <Route path="/partner/profile"          element={<PartnerProfile />} />
        <Route path="/partner/settings"         element={<PartnerSettings />} />
        <Route path="/partner/bookings"         element={<PartnerBookings />} />
        <Route path="/partner/services"         element={<PartnerServiceHub />} />

        {/* Lojman (Accommodation) partner */}
        <Route path="/partner/lojman"           element={<AccommodationListScreen />} />
        <Route path="/partner/lojman/create"    element={<AccommodationScreen />} />
        <Route path="/partner/lojman/edit/:id"  element={<AccommodationScreen />} />

        {/* Lòt sèvis patnè — dinamik */}
        <Route path="/partner/:service"         element={<PartnerServiceHub />} />
        <Route path="/partner/:service/create"  element={<PartnerServiceHub />} />
        <Route path="/partner/:service/:id/edit"element={<PartnerServiceHub />} />

        {/* ══════════════════════════════════════
            ADMIN — Tout pwoteje pa AdminGuard
        ══════════════════════════════════════ */}

        {/* Redirect rasin */}
        <Route path="/admin"
          element={<Navigate to="/admin/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="/admin/dashboard"
          element={<AdminGuard><AdminDashboard /></AdminGuard>} />

        {/* Patnè */}
        <Route path="/admin/partners"
          element={<AdminGuard><AdminPartners /></AdminGuard>} />
        <Route path="/admin/partners/pending"
          element={<AdminGuard><AdminPartners /></AdminGuard>} />
        <Route path="/admin/partners/blocked"
          element={<AdminGuard><AdminPartners /></AdminGuard>} />

        {/* Itilizatè */}
        <Route path="/admin/users"
          element={<AdminGuard><AdminUsers /></AdminGuard>} />
        <Route path="/admin/users/blocked"
          element={<AdminGuard><AdminUsers /></AdminGuard>} />
        <Route path="/admin/users/admins"
          element={<AdminGuard><AdminAdmins /></AdminGuard>} />

        {/* Anonskman */}
        <Route path="/admin/listings"
          element={<AdminGuard><AdminListings /></AdminGuard>} />

        {/* Validasyon */}
        <Route path="/admin/validation"
          element={<AdminGuard><AdminValidation /></AdminGuard>} />

        {/* Rezèvasyon */}
        <Route path="/admin/bookings"
          element={<AdminGuard><AdminBookings /></AdminGuard>} />
        <Route path="/admin/bookings/pending"
          element={<AdminGuard><AdminBookings /></AdminGuard>} />
        <Route path="/admin/bookings/confirmed"
          element={<AdminGuard><AdminBookings /></AdminGuard>} />
        <Route path="/admin/bookings/cancelled"
          element={<AdminGuard><AdminBookings /></AdminGuard>} />

        {/* Peman */}
        <Route path="/admin/payments"
          element={<AdminGuard><AdminPayments /></AdminGuard>} />

        {/* Revni & Komisyon */}
        <Route path="/admin/revenue"
          element={<AdminGuard><AdminRevenue /></AdminGuard>} />
        <Route path="/admin/revnue"
          element={<Navigate to="/admin/revenue" replace />} />
        <Route path="/admin/finance/revenue"
          element={<AdminGuard><AdminRevenue /></AdminGuard>} />
        <Route path="/admin/finance/commission"
          element={<AdminGuard><AdminRevenue /></AdminGuard>} />
        <Route path="/admin/finance/payments"
          element={<AdminGuard><AdminPayments /></AdminGuard>} />
        <Route path="/admin/finance/refunds"
          element={<AdminGuard><AdminPayments /></AdminGuard>} />
        

        {/* Mesaj */}
        {/* <Route path="/admin/messages"
          element={<AdminGuard><AdminMessages /></AdminGuard>} />
        <Route path="/admin/support"
          element={<AdminGuard><AdminMessages /></AdminGuard>} />

        {/* Notifikasyon *
        <Route path="/admin/notifications"
          element={<AdminGuard><AdminNotifications /></AdminGuard>} /> */}


        {/* Avi & Signalman */}
        <Route path="/admin/reviews"
          element={<AdminGuard><AdminReviews /></AdminGuard>} />
        <Route path="/admin/reports"
          element={<AdminGuard><AdminReviews /></AdminGuard>} />

        {/* Estatistik */}
        <Route path="/admin/statistics"
          element={<AdminGuard><AdminStatistics /></AdminGuard>} />
        <Route path="/admin/stats"
          element={<Navigate to="/admin/statistics" replace />} />
        <Route path="/admin/analytics"
          element={<Navigate to="/admin/statistics" replace />} />

        {/* Sèvis yo (dinamik — :service = lojman|travay|vwayaj|mache|lokasyon) */}
        <Route path="/admin/services/:service"
          element={<AdminGuard><AdminServices /></AdminGuard>} />
        <Route path="/admin/services"
          element={<Navigate to="/admin/services/lojman" replace />} />

        {/* Admin yo */}
        <Route path="/admin/admins"
          element={<AdminGuard><AdminAdmins /></AdminGuard>} />

        {/* Sekirite */}
        <Route path="/admin/security"
          element={<AdminGuard><AdminSecurity /></AdminGuard>} />

        {/* Rapò */}
        <Route path="/admin/reports-analytics"
          element={<AdminGuard><AdminReports /></AdminGuard>} />
        <Route path="/admin/reports-module"
          element={<AdminGuard><AdminReports /></AdminGuard>} />

        {/* Paramèt */}
        <Route path="/admin/settings"
          element={<AdminGuard><AdminSettings /></AdminGuard>} />
        <Route path="/admin/settings-advanced"
          element={<Navigate to="/admin/settings" replace />} />
        <Route path="/admin/legal"
          element={<AdminGuard><AdminSettings /></AdminGuard>} />

        {/* Feedback */}
        <Route path="/admin/feedback"
          element={<AdminGuard><AdminReviews /></AdminGuard>} />

        {/* ══════════════════════════════════════
            FALLBACK
        ══════════════════════════════════════ */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin/AdmiLayout" element={<AdminLayout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;