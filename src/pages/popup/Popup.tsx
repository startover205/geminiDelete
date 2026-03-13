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
    <div className="p-5 text-gray-800 bg-white flex flex-col justify-center h-full">
      <h2 className="text-xl font-bold mb-4 text-center">Gemini Quick Delete</h2>
      <p className="text-sm text-gray-600 mb-2">Current Shortcut:</p>
      
      <div 
        className={`p-3 rounded-md text-center cursor-pointer transition-colors ${
          isRecording 
            ? 'bg-blue-100 border-2 border-blue-500 animate-pulse' 
            : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
        }`}
        onClick={() => setIsRecording(!isRecording)}
      >
        <span className="font-mono text-lg font-semibold">
          {isRecording ? 'Press any combo...' : formatShortcut(config.shortcut)}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 text-center mb-4">
        {isRecording 
          ? 'Press the key combination you want to use. Press Esc to cancel.' 
          : 'Click the box above to record a new shortcut.'}
      </p>

      <div className="border-t pt-4 flex flex-col gap-3">
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={config.enableTrashIcon} 
            onChange={toggleTrashIcon}
            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Hover Trash Icon</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={config.directDelete} 
            onChange={toggleDirectDelete}
            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Direct Delete (No Warning)</span>
        </label>
      </div>
    </div>
  );
}
