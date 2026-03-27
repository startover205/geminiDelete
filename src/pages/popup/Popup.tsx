import React, { useState, useEffect, useCallback } from 'react';
import { useShortcut, ShortcutConfig } from './useShortcut';

export default function Popup() {
  const { config, saveShortcut, toggleTrashIcon, toggleDirectDelete, loading } = useShortcut();
  const [isRecording, setIsRecording] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isRecording) return;
      e.preventDefault();
      e.stopPropagation();

      // Ignore if only a modifier is pressed
      if (['Meta', 'Control', 'Alt', 'Shift', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
        if (e.key === 'Escape') setIsRecording(false);
        return;
      }

      const newShortcut: ShortcutConfig = {
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
      };

      saveShortcut(newShortcut);
      setIsRecording(false);
    },
    [isRecording, saveShortcut]
  );

  useEffect(() => {
    if (isRecording) {
      window.addEventListener('keydown', handleKeyDown, true);
    } else {
      window.removeEventListener('keydown', handleKeyDown, true);
    }
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isRecording, handleKeyDown]);

  const formatShortcut = (s: ShortcutConfig) => {
    const parts = [];
    if (s.ctrlKey) parts.push('Ctrl');
    if (s.metaKey) parts.push('Cmd');
    if (s.altKey) parts.push('Alt');
    if (s.shiftKey) parts.push('Shift');
    
    let keyName = s.key;
    if (keyName === ' ') keyName = 'Space';
    parts.push(keyName.charAt(0).toUpperCase() + keyName.slice(1));
    return parts.join(' + ');
  };

  if (loading) return null;

  return (
    <div className="relative flex flex-col w-[400px] h-auto max-h-[600px] mx-auto overflow-y-auto custom-scrollbar bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-background-dark/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">Gemini Quick Delete</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">V1.0.0 Free Edition</p>
          </div>
        </div>
        <button className="flex items-center justify-center size-8 rounded-lg hover:bg-slate-800 transition-colors text-slate-500 cursor-default">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </header>

      <main className="flex flex-col gap-1 p-3">
        {/* Section 1: PREFERENCES */}
        <div className="mb-4">
          <h3 className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preferences</h3>
          <div className="flex flex-col gap-1">
            {/* Toggle 1: Double tap confirm (inverse of directDelete) */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">keyboard</span>
                <span className="text-xs font-medium">Double-tap confirm</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!config.directDelete}
                  onChange={toggleDirectDelete}
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Custom Shortcut */}
            <div 
              className={`flex items-center justify-between p-3 rounded-xl glass-panel group cursor-pointer transition-colors ${isRecording ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-slate-800'}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">settings_input_antenna</span>
                <span className="text-xs font-medium">Custom Shortcut</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-300 shadow-sm flex items-center gap-2">
                  <span>{isRecording ? 'Listening... ESC to cancel' : formatShortcut(config.shortcut)}</span>
                  <span className={`material-symbols-outlined text-[12px] opacity-60 ${isRecording ? 'opacity-100' : 'group-hover:opacity-100'}`}>edit</span>
                </div>
              </div>
            </div>

            {/* Toggle 2: Show chat list delete icon */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">delete_sweep</span>
                <span className="text-xs font-medium">Display chat list delete icon</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={config.enableTrashIcon}
                  onChange={toggleTrashIcon}
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: SUPPORT & COMMUNITY */}
        <div className="mb-4">
          <h3 className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support & Community</h3>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm cursor-default">
              <span className="material-symbols-outlined text-[18px]">grade</span>
              <span className="text-[10px] font-bold uppercase">Rate</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl glass-panel hover:bg-slate-800 transition-colors cursor-default">
              <span className="material-symbols-outlined text-[18px]">feedback</span>
              <span className="text-[10px] font-bold uppercase">Feedback</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-500 transition-colors cursor-default">
              <span className="material-symbols-outlined text-[18px]">coffee</span>
              <span className="text-[10px] font-bold uppercase">Coffee</span>
            </button>
          </div>
        </div>

        {/* Section 3: ADVANCED */}
        <div>
          <h3 className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Advanced</h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel opacity-50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">terminal</span>
                <span className="text-xs font-medium">Debug Console</span>
              </div>
              <label className="relative inline-flex items-center cursor-default">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <button 
              className="flex items-center justify-between p-3 rounded-xl glass-panel hover:bg-red-500/10 transition-colors group cursor-default opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-[20px]">restart_alt</span>
                <span className="text-xs font-medium group-hover:text-red-500">Reset All Data</span>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <a href="#" className="hover:text-primary transition-colors cursor-default">Privacy Policy</a>
            <span className="text-slate-700">•</span>
            <a href="https://github.com/JohnBra/vite-web-extension" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
              <span className="text-[14px] leading-none">★</span> GitHub
            </a>
          </div>
          <div className="text-[10px] text-slate-600 flex items-center gap-1">
            Made with <span className="text-red-500">♥</span> for productivity
          </div>
        </div>
      </footer>
    </div>
  );
}
