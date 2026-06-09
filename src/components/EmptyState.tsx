import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon = 'inbox' }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-on-surface-variant text-3xl">{icon}</span>
    </div>
    <p className="text-body-md text-on-surface-variant">{message}</p>
  </div>
);

export default EmptyState;
