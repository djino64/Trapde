// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
// import ResetPasswordScreen from './screens/Auth/ResetPasswordScreen';
import VerifyEmailScreen from './screens/Auth/VerifyEmailScreen';
import AppPromotion from './screens/Home/AppPromotion';
import PopularDestinations from './screens/Home/PopularDestinations';
import AccommodationScreen from './screens/Accommodation/AccommodationScreen';
// import AccommodationList from './screens/Accommodation/AccommodationList';
// import AccommodationFilters from './screens/Accommodation/AccommodationFilters';
// import AccommodationCard from './screens/Accommodation/AccommodationCard';
// import AccommodationDetails from './screens/Accommodation/AccommodationDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        {/* <Route path="/reset-password/:token" element={<ResetPasswordScreen />} /> */}
        <Route path="/verify-email/:token" element={<VerifyEmailScreen />} />
        <Route path="/app-promotion" element={<AppPromotion />} />
        <Route path="/popular-destinations" element={<PopularDestinations />} />
        <Route path="/accommodation" element={<AccommodationScreen />} />
        {/* <Route path="/accommodation" element={<AccommodationList/>}/> */}
        {/* <Route path="/accommodation" element={<AccommodationFilters/>}/> */}
        {/* <Route path="/accommodation/:id" element={<AccommodationDetails/>}/> */}
        {/* <Route path="/accommodation" element={<AccommodationCard/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;