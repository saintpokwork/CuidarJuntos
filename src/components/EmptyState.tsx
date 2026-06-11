import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  message: string;
  icon?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon = 'inbox', actionLabel, actionTo, onAction }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-on-surface-variant text-3xl">{icon}</span>
    </div>
    <p className="text-body-md text-on-surface-variant max-w-sm">{message}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-label-md font-bold text-on-primary">
        {actionLabel}
      </Link>
    )}
    {actionLabel && onAction && !actionTo && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-label-md font-bold text-on-primary"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
