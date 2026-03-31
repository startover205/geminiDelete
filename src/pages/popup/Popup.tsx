import React, { useState, useEffect, useCallback } from 'react';
import { useShortcut, ShortcutConfig } from './useShortcut';
import {
  CoffeeIcon,
  DeleteSweepIcon,
  EditIcon,
  FeedbackIcon,
  ShortcutIcon,
  SparklesIcon,
  StarIcon,
} from './icons';

export default function Popup() {
  const { config, saveShortcut, toggleTrashIcon, toggleDirectDelete, loading } = useShortcut();
  const [isRecording, setIsRecording] = useState(false);
  const shortcutValue = formatShortcut(config.shortcut);

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

  function formatShortcut(s: ShortcutConfig) {
    const parts = [];
    if (s.ctrlKey) parts.push('Ctrl');
    if (s.metaKey) parts.push('Cmd');
    if (s.altKey) parts.push('Alt');
    if (s.shiftKey) parts.push('Shift');
    
    let keyName = s.key;
    if (keyName === ' ') keyName = 'Space';
    parts.push(keyName.charAt(0).toUpperCase() + keyName.slice(1));
    return parts.join(' + ');
  }

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
            <h1 className="text-sm font-bold leading-none tracking-tight">Delete Shortcut for Gemini™</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Fast cleanup for Gemini chats</p>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-1 p-3" aria-label="Extension settings">
        <p className="sr-only" aria-live="polite">
          {isRecording
            ? 'Shortcut recording started. Press the new shortcut now, or press Escape to cancel.'
            : `Current shortcut is ${shortcutValue}.`}
        </p>
        {/* Section 1: PREFERENCES */}
        <section className="mb-4" aria-labelledby="preferences-heading">
          <h2 id="preferences-heading" className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preferences</h2>
          <div className="flex flex-col gap-1">
            {/* Custom Shortcut */}
            <button
              type="button"
              aria-pressed={isRecording}
              aria-describedby="shortcut-description shortcut-hint"
              aria-label={isRecording ? 'Stop recording shortcut' : 'Record a new custom shortcut'}
              className={`interactive-card flex w-full items-center justify-between p-3 rounded-xl glass-panel group text-left cursor-pointer transition-colors ${isRecording ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-slate-800'}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <div className="flex items-start gap-3 pr-4">
                <ShortcutIcon className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">Custom Shortcut</p>
                  <p id="shortcut-description" className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Pick the shortcut you want to use when deleting conversations inside Gemini.
                  </p>
                  <p id="shortcut-hint" className="mt-1 text-[10px] text-slate-500">
                    {isRecording ? 'Recording now. Press Escape to cancel.' : 'Press Enter to record a new shortcut.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-300 shadow-sm flex items-center gap-2">
                  <span>{isRecording ? 'Listening... ESC to cancel' : shortcutValue}</span>
                  <EditIcon className={`size-3 opacity-60 ${isRecording ? 'opacity-100' : 'group-hover:opacity-100'}`} />
                </div>
              </div>
            </button>

            {/* Toggle 2: Show chat list delete icon */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel">
              <div className="flex items-start gap-3 pr-4">
                <DeleteSweepIcon className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium">Show delete button in chat list</p>
                  <p id="trash-icon-description" className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Add a visible delete button to each Gemini conversation for faster one-click cleanup.
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
                <div className="w-9 h-5 bg-slate-700 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background-dark"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Section 2: SUPPORT & COMMUNITY */}
        <section className="mb-2" aria-labelledby="support-heading">
          <h2 id="support-heading" className="px-2 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Support & Links</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled
              aria-label="Rate link coming soon until the extension is published"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-primary/50 text-white/80 transition-colors shadow-sm cursor-not-allowed opacity-70"
            >
              <StarIcon className="size-[18px]" />
              <span className="text-[10px] font-bold uppercase">Rate</span>
              <span className="text-[9px] font-medium normal-case opacity-80">After launch</span>
            </button>
            <a
              href="https://tally.so/r/q4W4r9"
              target="_blank"
              rel="noreferrer"
              className="interactive-card flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl glass-panel hover:bg-slate-800 transition-colors"
              aria-label="Open feedback form"
            >
              <FeedbackIcon className="size-[18px]" />
              <span className="text-[10px] font-bold uppercase">Feedback</span>
            </a>
            <a
              href="https://startover205.github.io/coffeePage/?app=gemini_delete"
              target="_blank"
              rel="noreferrer"
              className="interactive-card flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-500 transition-colors"
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
            <a href="/privacy.html" target="_blank" rel="noreferrer" className="interactive-card hover:text-primary transition-colors rounded px-1 py-0.5">
              Privacy Policy
            </a>
            <span className="text-slate-700">•</span>
            <a href="https://github.com/startover205/geminiDelete" target="_blank" rel="noreferrer" className="interactive-card flex items-center gap-1 hover:text-primary transition-colors rounded px-1 py-0.5">
              <span className="text-[14px] leading-none">★</span> GitHub
            </a>
          </div>
          <div className="text-[10px] text-slate-600 flex items-center gap-1">
            Built for a cleaner Gemini inbox
          </div>
        </div>
      </footer>
    </div>
  );
}
