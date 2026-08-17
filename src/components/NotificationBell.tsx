// =============================================================
// EthiMarket — Cloche de notifications (header du dashboard)
// Badge de non-lus + panneau déroulant + Realtime.
// Libellés rendus dans la langue de l'utilisateur (kind+payload).
// =============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
  subscribeToNotifications, countUnread, splitByRecency,
  notificationLabelKey, notificationVars,
  NOTIFICATION_EMOJI, UserNotification,
} from '../lib/notificationService';

export default function NotificationBell() {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [items, setItems] = useState<UserNotification[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setItems(await getNotifications(user.id));
  }, [user]);

  // Chargement initial + Realtime
  useEffect(() => {
    if (!user) return;
    void reload();
    const unsubscribe = subscribeToNotifications(user.id, n => {
      setItems(prev => [n, ...prev].slice(0, 30));
    });
    return unsubscribe;
  }, [user, reload]);

  // Fermeture au clic extérieur / Échap
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const unread = countUnread(items);
  const { today, earlier } = splitByRecency(items);

  const openNotification = async (n: UserNotification) => {
    setOpen(false);
    if (!n.read_at) {
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x));
      void markNotificationRead(n.id);
    }
    if (n.link) navigate(n.link);
  };

  const markAll = async () => {
    setItems(prev => prev.map(x => x.read_at ? x : { ...x, read_at: new Date().toISOString() }));
    if (user) void markAllNotificationsRead(user.id);
  };

  const timeLabel = (iso: string) => {
    const d = new Date(iso);
    const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diffMin < 1) return t('notif.justNow');
    if (diffMin < 60) return `${diffMin} min`;
    if (diffMin < 24 * 60) return `${Math.floor(diffMin / 60)} h`;
    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale);
  };

  const renderGroup = (label: string, list: UserNotification[]) => list.length === 0 ? null : (
    <div key={label}>
      <p className="px-4 pt-3 pb-1 text-[10px] font-black text-gray-400 uppercase tracking-wide">{label}</p>
      {list.map(n => (
        <button
          key={n.id}
          onClick={() => void openNotification(n)}
          className={`w-full text-start px-4 py-3 flex gap-3 items-start hover:bg-gray-50 transition-colors cursor-pointer ${n.read_at ? 'opacity-60' : ''}`}
        >
          <span className="text-lg shrink-0">{NOTIFICATION_EMOJI[n.kind] ?? '🔔'}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-gray-800 leading-snug">
              {t(notificationLabelKey(n.kind), notificationVars(n))}
            </span>
            <span className="block text-[10px] text-gray-400 mt-0.5">{timeLabel(n.created_at)}</span>
          </span>
          {!n.read_at && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
        aria-label={t('notif.title')}
        aria-expanded={open}
      >
        <Bell className="w-5 h-5 text-gray-500" />
        {unread > 0 && (
          <span className="absolute top-1 end-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">{t('notif.title')}</p>
            {unread > 0 && (
              <button onClick={() => void markAll()} className="text-[11px] font-bold text-brand-700 hover:underline inline-flex items-center gap-1 cursor-pointer">
                <CheckCheck className="w-3.5 h-3.5" /> {t('notif.markAllRead')}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <Inbox className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">{t('notif.empty')}</p>
              </div>
            ) : (
              <>
                {renderGroup(t('notif.today'), today)}
                {renderGroup(t('notif.earlier'), earlier)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
