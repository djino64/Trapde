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

// ── Bookings ─────────────────────────────────────────────────────────────────
import BookingDetailsScreen from './screens/Bookings/BookingDetailsScreen';

// ── Profile ───────────────────────────────────────────────────────────────────
import ProfileScreen        from './screens/Profile/ProfileScreen';
import FavoritesScreen      from './screens/Accommodation/FavoritesScreen';
import FooterInfoScreen     from './screens/FooterInfoScreen';

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
import BookingConfirmation from './screens/Bookings/BookingConfirmation';

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
        <Route path="/jobs"                     element={<FooterInfoScreen />} />
        <Route path="/marketplace"              element={<FooterInfoScreen />} />
        <Route path="/travel"                   element={<FooterInfoScreen />} />
        <Route path="/rentals"                  element={<FooterInfoScreen />} />
        <Route path="/offers"                   element={<FooterInfoScreen />} />
        <Route path="/about"                    element={<FooterInfoScreen />} />
        <Route path="/careers"                  element={<FooterInfoScreen />} />
        <Route path="/press"                    element={<FooterInfoScreen />} />
        <Route path="/partners"                 element={<FooterInfoScreen />} />
        <Route path="/help"                     element={<FooterInfoScreen />} />
        <Route path="/terms"                    element={<FooterInfoScreen />} />
        <Route path="/privacy"                  element={<FooterInfoScreen />} />
        <Route path="/cookies"                  element={<FooterInfoScreen />} />
        <Route path="/sitemap"                  element={<FooterInfoScreen />} />

        {/* Accommodation public */}
        <Route path="/accommodation"            element={<AccommodationList />} />
        <Route path="/accommodation/:id"        element={<AccommodationDetails />} />
        

        {/* Bookings */}
        <Route path="/bookings"                 element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
        <Route path="/bookings/:id"             element={<PrivateRoute><BookingDetailsScreen /></PrivateRoute>} />

        {/* Profile */}
        <Route path="/profile"                  element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
        <Route path="/favorites"                element={<PrivateRoute><FavoritesScreen /></PrivateRoute>} />
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
        <Route
  path="/bookings/confirmation"
  element={
    <BookingConfirmation />
  }
/>

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
        <Route path="/admin/AdmiLayout" element={<AdminLayout children={undefined} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;