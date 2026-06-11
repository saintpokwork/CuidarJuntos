import React from 'react';

interface FeedbackMessageProps {
  message: string | null;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 md:bottom-auto md:top-4 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-on-secondary px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
      <span className="material-symbols-outlined text-sm">check_circle</span>
      <span className="text-label-md font-bold">{message}</span>
    </div>
  );
};

export default FeedbackMessage;
