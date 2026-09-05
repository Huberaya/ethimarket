// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock supabase avant l'import du module testé.
const rpcMock = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock('../lib/supabase', () => ({ supabase: { rpc: (...args: unknown[]) => rpcMock(...args) } }));

import { installErrorMonitor } from '../lib/errorMonitor';

type Listener = (event: Record<string, unknown>) => void;

function makeWindow() {
  const listeners: Record<string, Listener[]> = {};
  const win = {
    location: { pathname: '/catalogue' },
    addEventListener: (type: string, fn: Listener) => {
      (listeners[type] ??= []).push(fn);
    },
    emit: (type: string, event: Record<string, unknown>) => {
      for (const fn of listeners[type] ?? []) fn(event);
    },
  };
  return win;
}

describe('errorMonitor', () => {
  let win: ReturnType<typeof makeWindow>;

  beforeEach(() => {
    rpcMock.mockClear();
    win = makeWindow();
    vi.stubGlobal('window', win);
    vi.stubGlobal('navigator', { userAgent: 'test-agent' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('capte window.onerror et appelle log_client_error avec les bons champs', () => {
    installErrorMonitor();
    win.emit('error', { message: 'TypeError: x is undefined', error: new Error('x'), filename: 'app.js', lineno: 10, colno: 5 });
    expect(rpcMock).toHaveBeenCalledWith('log_client_error', expect.objectContaining({
      p_message: 'TypeError: x is undefined',
      p_source: 'app.js:10:5',
      p_page: '/catalogue',
      p_user_agent: 'test-agent',
    }));
  });

  it('capte unhandledrejection avec le nom et le message de l\u2019erreur', () => {
    installErrorMonitor();
    win.emit('unhandledrejection', { reason: new RangeError('out of range') });
    expect(rpcMock).toHaveBeenCalledWith('log_client_error', expect.objectContaining({
      p_message: 'RangeError: out of range',
      p_source: 'unhandledrejection',
    }));
  });

  it('déduplique la même erreur dans la session', () => {
    installErrorMonitor();
    for (let i = 0; i < 5; i++) {
      win.emit('error', { message: 'same error', error: new Error('same'), filename: 'a.js', lineno: 1, colno: 1 });
    }
    expect(rpcMock).toHaveBeenCalledTimes(1);
  });

  it('plafonne à 10 envois par session', () => {
    installErrorMonitor();
    for (let i = 0; i < 25; i++) {
      win.emit('error', { message: `error ${i}`, error: new Error(String(i)), filename: 'a.js', lineno: i, colno: 0 });
    }
    expect(rpcMock.mock.calls.length).toBeLessThanOrEqual(10);
  });

  it('ignore les événements sans message (bruit des ressources)', () => {
    installErrorMonitor();
    win.emit('error', { message: '', error: null });
    expect(rpcMock).not.toHaveBeenCalled();
  });
});
