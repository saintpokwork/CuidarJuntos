import React from 'react';
import LegalInfoPage from '../components/LegalInfoPage';

const Cookies: React.FC = () => (
  <LegalInfoPage
    namespace="cookies"
    badgeIcon="cookie"
    badgeLabelKey="footer.cookies"
    heroIcon="tune"
    summaryIcons={['lock', 'login', 'analytics', 'block']}
    sectionIcons={['storage', 'verified_user', 'bar_chart', 'settings']}
    primaryLink={{ to: '/privacidade', labelKey: 'legal.cookies.viewPrivacy' }}
    secondaryLink={{ to: '/', labelKey: 'legal.shared.backToHome' }}
  />
);

export default Cookies;
