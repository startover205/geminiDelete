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
        // Force directDelete off so older installs stay on the safer flow.
        const normalizedConfig = {
          ...DEFAULT_CONFIG,
          ...result.geminiQuickDeleteConfig,
          directDelete: false,
        };
        setConfig(normalizedConfig);
        chrome.storage.sync.set({ geminiQuickDeleteConfig: normalizedConfig });
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
    const normalizedConfig = { ...newConfig, directDelete: false };
    setConfig(normalizedConfig);
    chrome.storage.sync.set({ geminiQuickDeleteConfig: normalizedConfig });
  };

  const saveShortcut = (newShortcut: ShortcutConfig) => {
    saveConfig({ ...config, shortcut: newShortcut });
  };

  const toggleTrashIcon = () => {
    saveConfig({ ...config, enableTrashIcon: !config.enableTrashIcon });
  };

  return { config, saveShortcut, toggleTrashIcon, loading };
}
