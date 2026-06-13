import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCareData } from '../context/CareDataContext';
import { useLanguage } from '../i18n/LanguageContext';

const PANEL_WIDTH = 360;
const PANEL_HEIGHT = 420;
const VIEWPORT_MARGIN = 16;
const SIDEBAR_WIDTH = 240;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const NotificationBell: React.FC = () => {
  const { notifications } = useCareData();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: VIEWPORT_MARGIN, left: VIEWPORT_MARGIN });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const count = notifications.length;

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const panelWidth = Math.min(PANEL_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2);
      const panelHeight = Math.min(PANEL_HEIGHT, window.innerHeight - VIEWPORT_MARGIN * 2);
      const isDesktopSidebar = rect.left < 260 && window.innerWidth >= 1024;

      const preferredLeft = isDesktopSidebar ? SIDEBAR_WIDTH + 16 : rect.right - panelWidth;
      const preferredTop = isDesktopSidebar ? rect.top : rect.bottom + 8;

      setPosition({
        left: clamp(preferredLeft, VIEWPORT_MARGIN, window.innerWidth - panelWidth - VIEWPORT_MARGIN),
        top: clamp(preferredTop, VIEWPORT_MARGIN, window.innerHeight - panelHeight - VIEWPORT_MARGIN),
      });
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    updatePosition();
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-white/35"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('notifications.title')}
      >
        <span className="material-symbols-outlined">notifications</span>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cj-cobre px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="menu"
            aria-label={t('notifications.title')}
            className="fixed z-[90] w-[min(360px,calc(100vw-2rem))] max-h-[min(420px,calc(100vh-2rem))] overflow-y-auto rounded-2xl border border-cj-border bg-cj-branco p-3 shadow-xl"
            style={{ top: position.top, left: position.left }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-cj-branco px-2 pb-2">
              <p className="text-label-md font-bold text-on-surface">{t('notifications.title')}</p>
              <span className="rounded-full bg-cj-verde-pale px-2 py-1 text-label-sm font-bold text-primary">{count}</span>
            </div>
            {count === 0 ? (
              <p className="px-2 py-4 text-label-sm text-on-surface-variant">{t('notifications.empty')}</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl bg-surface-container-low p-3 text-left hover:bg-cj-verde-pale focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <p className="text-label-md font-bold text-on-surface">{item.title}</p>
                    <p className="mt-1 text-label-sm text-on-surface-variant">{item.body}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default NotificationBell;
