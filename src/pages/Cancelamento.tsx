import React from 'react';
import LegalInfoPage from '../components/LegalInfoPage';

const Cancelamento: React.FC = () => (
  <LegalInfoPage
    namespace="cancellation"
    badgeIcon="credit_card_off"
    badgeLabelKey="footer.cancellation"
    heroIcon="event_available"
    summaryIcons={['workspace_premium', 'payments', 'cancel', 'support_agent']}
    sectionIcons={['schedule', 'credit_card', 'manage_accounts', 'receipt_long', 'help']}
    primaryLink={{ to: '/criar-conta', labelKey: 'global.createAccount' }}
    secondaryLink={{ to: '/termos', labelKey: 'legal.cancellation.viewTerms' }}
  />
);

export default Cancelamento;
