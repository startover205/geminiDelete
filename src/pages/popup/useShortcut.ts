import { useState, useEffect } from 'react';

export type ShortcutConfig = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

// Use platform detection for the default (Meta for Mac, Ctrl for others)
const isMac = navigator.userAgent.includes('Mac');
const DEFAULT_SHORTCUT: ShortcutConfig = {
  key: 'Backspace',
  ctrlKey: !isMac,
  metaKey: isMac,
  altKey: false,
  shiftKey: false,
};

export function useShortcut() {
  const [shortcut, setShortcut] = useState<ShortcutConfig>(DEFAULT_SHORTCUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(['geminiQuickDeleteShortcut'], (result) => {
      if (result.geminiQuickDeleteShortcut) {
        setShortcut(result.geminiQuickDeleteShortcut);
      }
      setLoading(false);
    });
  }, []);

  const saveShortcut = (newShortcut: ShortcutConfig) => {
    setShortcut(newShortcut);
    chrome.storage.sync.set({ geminiQuickDeleteShortcut: newShortcut });
  };

  return { shortcut, saveShortcut, loading };
}
