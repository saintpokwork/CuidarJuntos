import React from 'react';

interface HelpTipProps {
  text: string;
}

const HelpTip: React.FC<HelpTipProps> = ({ text }) => (
  <div className="mb-6 p-4 bg-primary-fixed/30 border-l-4 border-primary rounded-r-xl flex items-start gap-3">
    <span className="material-symbols-outlined text-primary shrink-0">lightbulb</span>
    <p className="text-label-md text-on-surface-variant">
      <strong className="text-on-surface">Dica:</strong> {text}
    </p>
  </div>
);

export default HelpTip;
