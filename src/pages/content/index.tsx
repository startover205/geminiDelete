import './style.css';

type ShortcutConfig = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

const isMac = navigator.userAgent.includes('Mac');
const DEFAULT_SHORTCUT: ShortcutConfig = {
  key: 'Backspace',
  ctrlKey: !isMac,
  metaKey: isMac,
  altKey: false,
  shiftKey: false,
};

let currentShortcut: ShortcutConfig = DEFAULT_SHORTCUT;

function matchesShortcut(e: KeyboardEvent, config: ShortcutConfig): boolean {
  return (
    e.key.toLowerCase() === config.key.toLowerCase() &&
    e.ctrlKey === config.ctrlKey &&
    e.metaKey === config.metaKey &&
    e.altKey === config.altKey &&
    e.shiftKey === config.shiftKey
  );
}

/**
 * Automates the multi-step deletion flow of Google Gemini
 * Double confirmation: 
 * - If dialog is NOT open: opens it.
 * - If dialog IS open: confirms deletion.
 */
async function triggerDeletionFlow() {
  // 1. First, check if the final confirmation dialog is ALREADY visible
  const dialogConfirmBtn = Array.from(document.querySelectorAll('mat-dialog-container button'))
      .find(btn => (btn.textContent?.includes('刪除') || btn.textContent?.includes('Delete')) && 
                   !btn.textContent?.includes('取消') && !btn.textContent?.includes('Cancel') &&
                   (btn as HTMLElement).offsetParent !== null) as HTMLElement; // Ensure it's visible
  
  if (dialogConfirmBtn) {
      console.log("Gemini Shortcut: Confirmation dialog detected. Performing final deletion.");
      dialogConfirmBtn.click();
      return;
  }

  console.log("Gemini Shortcut: Dialog not detected. Opening deletion menu...");

  // 2. Find the menu button for the active conversation
  let activeChatMenuBtn = document.querySelector('nav [aria-selected="true"] + button') ||
                          document.querySelector('a.conversation.selected + button.conversation-actions-menu-button') || 
                          document.querySelector('.conversation-container[aria-selected="true"] button[aria-haspopup="menu"]');
  
  if (!activeChatMenuBtn) {
      // Fallback: try to find any button next to a selected link in nav
      const selectedLink = document.querySelector('nav [aria-selected="true"]') || document.querySelector('a.conversation.selected');
      if (selectedLink && selectedLink.parentElement) {
          activeChatMenuBtn = selectedLink.parentElement.querySelector('button[aria-haspopup="menu"]');
      }
  }

  if (activeChatMenuBtn) {
      (activeChatMenuBtn as HTMLElement).click();
  } else {
      console.log("Gemini Shortcut: Could not find active conversation (likely a new chat).");
      return;
  }

  // 3. Wait for menu and click "Delete" to bring up the dialog
  setTimeout(() => {
      const menuItems = Array.from(document.querySelectorAll('button[role="menuitem"], .mat-menu-item, .mat-mdc-menu-item'));
      const deleteBtn = menuItems.find(item => 
          item.textContent?.includes('刪除') || 
          item.textContent?.includes('Delete')
      ) as HTMLElement;

      if (deleteBtn) {
          deleteBtn.click();
          console.log("Gemini Shortcut: Delete dialog requested. Waiting for user's second press to confirm.");
      } else {
          console.log("Gemini Shortcut: Could not find 'Delete' menu item.");
      }
  }, 300);
}

function handleKeyDown(e: KeyboardEvent) {
  if (matchesShortcut(e, currentShortcut)) {
    // Check if we are focusing on an input, textarea or a prompt area
    const target = e.target as HTMLElement;
    const activeNodeName = target.nodeName;
    const isEditable = target.isContentEditable;
    
    // We sometimes WANT to delete the chat even if the prompt input is focused but EMPTY
    // Because Gemini auto-focuses the chat box when page loads.
    if (activeNodeName === 'INPUT' || activeNodeName === 'TEXTAREA' || isEditable) {
        // Check if the input is actually empty. If it has text, then user is typing, we shouldn't delete.
        const textContent = (target as HTMLInputElement).value || target.textContent;
        
        // If user has typed something, let them use the shortcut for text manipulation instead
        if (textContent && textContent.trim().length > 0) {
            return; 
        }
    }
    
    // If we are in an empty editor or not in editor at all, trigger deletion.
    e.preventDefault();
    e.stopPropagation();
    
    triggerDeletionFlow();
  }
}

// Load current shortcut
chrome.storage.sync.get(['geminiQuickDeleteShortcut'], (result) => {
  if (result.geminiQuickDeleteShortcut) {
    currentShortcut = result.geminiQuickDeleteShortcut;
  }
  window.addEventListener('keydown', handleKeyDown, true);
  console.log('Gemini Quick Delete initialized with shortcut:', currentShortcut);
});

// Listen for updates from popup
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.geminiQuickDeleteShortcut) {
    currentShortcut = changes.geminiQuickDeleteShortcut.newValue;
    console.log('Gemini Quick Delete shortcut updated to:', currentShortcut);
  }
});
