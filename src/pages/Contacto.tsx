import React from 'react';
import LegalInfoPage from '../components/LegalInfoPage';

const Contacto: React.FC = () => (
  <LegalInfoPage
    namespace="contact"
    badgeIcon="support_agent"
    badgeLabelKey="footer.contact"
    heroIcon="mark_email_read"
    summaryIcons={['account_circle', 'payments', 'privacy_tip', 'bug_report']}
    sectionIcons={['alternate_email', 'schedule', 'category', 'security', 'family_restroom']}
    primaryLink={{ to: 'mailto:contato@cuidarjuntos.pt', labelKey: 'legal.contact.emailCta' }}
    secondaryLink={{ to: '/', labelKey: 'legal.shared.backToHome' }}
  />
);

export default Contacto;
