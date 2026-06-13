import React from 'react';
import LegalInfoPage from '../components/LegalInfoPage';

const Seguranca: React.FC = () => (
  <LegalInfoPage
    namespace="security"
    badgeIcon="shield"
    badgeLabelKey="footer.dataSecurity"
    heroIcon="health_and_safety"
    summaryIcons={['lock', 'group', 'folder', 'payments']}
    sectionIcons={['cloud_done', 'admin_panel_settings', 'description', 'paid', 'medical_services']}
    primaryLink={{ to: '/criar-conta', labelKey: 'global.createAccount' }}
    secondaryLink={{ to: '/privacidade', labelKey: 'legal.security.viewPrivacy' }}
  />
);

export default Seguranca;
