import React from 'react';
import { useTranslation } from 'react-i18next';
import PartnerLayout from './PartnerLayout';
import ProfileScreen from '../Profile/ProfileScreen';

const PartnerProfile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PartnerLayout title={t('profile.title')}>
      <ProfileScreen />
    </PartnerLayout>
  );
};

export default PartnerProfile;
