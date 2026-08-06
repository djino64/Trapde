import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
import VerifyEmailScreen from './screens/Auth/VerifyEmailScreen';
import AppPromotion from './screens/Home/AppPromotion';
import PopularDestinations from './screens/Home/PopularDestinations';
import AccommodationScreen from './screens/partner/lojman/AccommodationScreen';
import AccommodationListScreen from './screens/partner/lojman/AccommodationListScreen';
import AccommodationDetails from './screens/Accommodation/AccommodationDetail';
import AccommodationList from './screens/Accommodation/AccommodationList';
import BookingPage from './screens/Bookings/BookingPage';
import BookingDetails from './screens/Bookings/BookingDetail';
import ProfileScreen from './screens/Profile/ProfileScreen';
import PartnerDashboard from './screens/partner/PartnerDashboard';
import PartnerBookings from './screens/partner/PartnerBookings';
import PartnerServiceHub from './screens/partner/PartnerServiceHub';
import PartnerProfile from './screens/partner/PartnerProfile';
import PartnerSettings from './screens/partner/PartnerSettings';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminPartners from './screens/admin/AdminPartners';
import AdminUsers from './screens/admin/AdminUsers';
import AdminListings from './screens/admin/AdminListings';
import AdminValidation from './screens/admin/AdminValidation';
import AdminPlaceholder from './screens/admin/AdminPlaceholder';
import AdminServices from './screens/admin/AdminServices';
import AdminBookings from './screens/admin/AdminBookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/verify-email/:token" element={<VerifyEmailScreen />} />
        <Route path="/app-promotion" element={<AppPromotion />} />
        <Route path="/popular-destinations" element={<PopularDestinations />} />
        <Route path="/Profile" element={<ProfileScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/partner/profile" element={<PartnerProfile />} />
        <Route path="/partner/settings" element={<PartnerSettings />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/bookings" element={<PartnerBookings />} />
        <Route path="/partner/services" element={<PartnerServiceHub />} />
        <Route path="/partner/lojman" element={<AccommodationListScreen />} />
        <Route path="/partner/lojman/create" element={<AccommodationScreen />} />
        <Route path="/partner/lojman/edit/:id" element={<AccommodationScreen />} />
        <Route path="/dashboard" element={<PartnerDashboard />} />
        <Route path="/accommodation" element={<AccommodationList />} />
        <Route path="/accommodation/:id" element={<AccommodationDetails />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/partners" element={<PrivateRoute requiredRole="admin"><AdminPartners /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute requiredRole="admin"><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/listings" element={<PrivateRoute requiredRole="admin"><AdminListings /></PrivateRoute>} />
        <Route path="/admin/validation" element={<PrivateRoute requiredRole="admin"><AdminValidation /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute requiredRole="admin"><AdminBookings /></PrivateRoute>} />
        <Route path="/admin/payments" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Paiements" description="Suivi des transactions, commissions et remboursements." /></PrivateRoute>} />
        <Route path="/admin/revenue" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Revenus & Commissions" description="Analyse des revenus, commissions et prévisions." /></PrivateRoute>} />
        <Route path="/admin/messages" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Messages" description="Messagerie interne, archives et pièces jointes." /></PrivateRoute>} />
        <Route path="/admin/notifications" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Notifications" description="Centre de notification multi-canal et historique." /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Avis & Signalements" description="Modération des avis, signalements et sanctions." /></PrivateRoute>} />
        <Route path="/admin/stats" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Statistiques" description="Analyse avancée des inscriptions, annonces et paiements." /></PrivateRoute>} />
        <Route path="/admin/services" element={<PrivateRoute requiredRole="admin"><AdminServices /></PrivateRoute>} />
        <Route path="/admin/admins" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Gestion des administrateurs" description="Gestion des rôles, permissions et journal d’actions." /></PrivateRoute>} />
        <Route path="/admin/security" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Sécurité" description="Historique des connexions, blocage IP et sessions actives." /></PrivateRoute>} />
        <Route path="/admin/reports-module" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Rapports" description="Export PDF, Excel et CSV des données plateforme." /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute requiredRole="admin"><AdminPlaceholder title="Paramètres" description="Configuration du logo, commissions, langues et maintenance." /></PrivateRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;