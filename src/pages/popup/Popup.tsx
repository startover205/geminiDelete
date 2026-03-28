import React, { useState, useEffect, useCallback } from 'react';
import { useShortcut, ShortcutConfig } from './useShortcut';
import {
  CoffeeIcon,
  DeleteSweepIcon,
  EditIcon,
  FeedbackIcon,
  KeyboardIcon,
  ShortcutIcon,
  SparklesIcon,
  StarIcon,
} from './icons';

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
      <header className="sticky top-0 z-10 flex items-center border-b border-slate-800 bg-background-dark/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
            <SparklesIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">Gemini Quick Delete</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">V1.0.0 Free Edition</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-1 p-3" aria-label="Extension settings">
        {/* Section 1: PREFERENCES */}
        <section className="mb-4" aria-labelledby="preferences-heading">
          <h2 id="preferences-heading" className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preferences</h2>
          <div className="flex flex-col gap-1">
            {/* Toggle 1: Double tap confirm (inverse of directDelete) */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-start gap-3 pr-4">
                <KeyboardIcon className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">Double-tap confirm</p>
                  <p id="direct-delete-description" className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Require a second key press before deleting a conversation to reduce accidental removals.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={!config.directDelete}
                  onChange={toggleDirectDelete}
                  aria-describedby="direct-delete-description"
                  aria-label="Enable double-tap confirmation before delete"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Custom Shortcut */}
            <button
              type="button"
              aria-pressed={isRecording}
              aria-describedby="shortcut-description"
              className={`flex w-full items-center justify-between p-3 rounded-xl glass-panel group text-left cursor-pointer transition-colors ${isRecording ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-slate-800'}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <div className="flex items-start gap-3 pr-4">
                <ShortcutIcon className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">Custom Shortcut</p>
                  <p id="shortcut-description" className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Choose the keyboard shortcut that triggers quick delete while browsing Gemini.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-300 shadow-sm flex items-center gap-2">
                  <span>{isRecording ? 'Listening... ESC to cancel' : formatShortcut(config.shortcut)}</span>
                  <EditIcon className={`size-3 opacity-60 ${isRecording ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                </div>
              </div>
            </button>

            {/* Toggle 2: Show chat list delete icon */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-start gap-3 pr-4">
                <DeleteSweepIcon className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">Display chat list delete icon</p>
                  <p id="trash-icon-description" className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Show a visible delete shortcut in the Gemini conversation list for faster cleanup.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={config.enableTrashIcon}
                  onChange={toggleTrashIcon}
                  aria-describedby="trash-icon-description"
                  aria-label="Show delete icon in Gemini chat list"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Section 2: SUPPORT & COMMUNITY */}
        <section className="mb-2" aria-labelledby="support-heading">
          <h2 id="support-heading" className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support & Community</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled
              aria-label="Rate link coming soon until the extension is published"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-primary/50 text-white/80 transition-colors shadow-sm cursor-not-allowed opacity-70"
            >
              <StarIcon className="size-[18px]" />
              <span className="text-[10px] font-bold uppercase">Rate</span>
              <span className="text-[9px] font-medium normal-case opacity-80">Coming soon</span>
            </button>
            <a
              href="https://github.com/startover205/geminiDelete/issues"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl glass-panel hover:bg-slate-800 transition-colors"
              aria-label="Open GitHub issues to leave feedback"
            >
              <FeedbackIcon className="size-[18px]" />
              <span className="text-[10px] font-bold uppercase">Feedback</span>
            </a>
            <a
              href="https://startover205.github.io/coffeePage/?app=gemini_delete"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-500 transition-colors"
              aria-label="Open support page to buy coffee"
            >
              <CoffeeIcon className="size-[18px]" />
              <span className="text-[10px] font-bold uppercase">Coffee</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
            <a href="#" className="hover:text-primary transition-colors cursor-default">Privacy Policy</a>
            <span className="text-slate-700">•</span>
            <a href="https://github.com/startover205/geminiDelete" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
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
