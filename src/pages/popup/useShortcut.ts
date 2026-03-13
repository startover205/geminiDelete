import { useState, useEffect } from 'react';

export type ShortcutConfig = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

export type AppConfig = {
  shortcut: ShortcutConfig;
  enableTrashIcon: boolean;
  directDelete: boolean;
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

const DEFAULT_CONFIG: AppConfig = {
  shortcut: DEFAULT_SHORTCUT,
  enableTrashIcon: true,
  directDelete: false,
};

export function useShortcut() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(['geminiQuickDeleteConfig', 'geminiQuickDeleteShortcut'], (result) => {
      if (result.geminiQuickDeleteConfig) {
        // Merge with DEFAULT_CONFIG in case new keys were added
        setConfig({ ...DEFAULT_CONFIG, ...result.geminiQuickDeleteConfig });
      } else if (result.geminiQuickDeleteShortcut) {
        // Migrate old format
        const migratedConfig = { ...DEFAULT_CONFIG, shortcut: result.geminiQuickDeleteShortcut };
        setConfig(migratedConfig);
        chrome.storage.sync.set({ geminiQuickDeleteConfig: migratedConfig });
      }
      setLoading(false);
    });
  }, []);

  const saveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    chrome.storage.sync.set({ geminiQuickDeleteConfig: newConfig });
  };

  const saveShortcut = (newShortcut: ShortcutConfig) => {
    saveConfig({ ...config, shortcut: newShortcut });
  };

  const toggleTrashIcon = () => {
    saveConfig({ ...config, enableTrashIcon: !config.enableTrashIcon });
  };

  const toggleDirectDelete = () => {
    saveConfig({ ...config, directDelete: !config.directDelete });
  };

  return { config, saveShortcut, toggleTrashIcon, toggleDirectDelete, loading };
}
