type ShortcutConfig = {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
};

type AppConfig = {
  shortcut: ShortcutConfig;
  enableTrashIcon: boolean;
  directDelete: boolean;
};

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

let currentConfig: AppConfig = DEFAULT_CONFIG;
let activeDeletePopover: HTMLElement | null = null;
let activeDeletePopoverCleanup: (() => void) | null = null;

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
 * Finds and clicks the confirm button in the deletion dialog
 */
function confirmDeletion() {
  const dialogConfirmBtn = Array.from(document.querySelectorAll('mat-dialog-container button'))
      .find(btn => (btn.textContent?.includes('刪除') || btn.textContent?.includes('Delete')) && 
                   !btn.textContent?.includes('取消') && !btn.textContent?.includes('Cancel') &&
                   (btn as HTMLElement).offsetParent !== null) as HTMLElement;
  
  if (dialogConfirmBtn) {
      console.log("Gemini Shortcut: Confirmation dialog detected. Performing final deletion.");
      dialogConfirmBtn.click();
      return true;
  }
  return false;
}

/**
 * Automates the deletion of a specific conversation (from a given menu button)
 */
function performDeleteSequence(menuBtn: HTMLElement, isDirectDelete: boolean) {
  menuBtn.click();
  console.log("Gemini Shortcut: Opened menu.");

  setTimeout(() => {
      const menuItems = Array.from(document.querySelectorAll('button[role="menuitem"], .mat-menu-item, .mat-mdc-menu-item'));
      const deleteBtn = menuItems.find(item => 
          item.textContent?.includes('刪除') || 
          item.textContent?.includes('Delete')
      ) as HTMLElement;

      if (deleteBtn) {
          deleteBtn.click();
          console.log("Gemini Shortcut: Delete dialog requested.");
          
          if (isDirectDelete) {
              console.log("Gemini Shortcut: Direct Delete enabled. Auto-confirming in 300ms...");
              setTimeout(() => confirmDeletion(), 300);
          } else {
              console.log("Gemini Shortcut: Waiting for user's second press to confirm.");
          }
      } else {
          console.log("Gemini Shortcut: Could not find 'Delete' menu item.");
          // Close menu if delete not found
          document.body.click(); 
      }
  }, 300);
}

function closeDeletePopover() {
  if (activeDeletePopoverCleanup) {
    activeDeletePopoverCleanup();
  }
}

function showDeletePopover(anchorEl: HTMLElement, menuBtn: HTMLElement) {
  closeDeletePopover();

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rowEl = anchorEl.closest('.gqd-convo-container') as HTMLElement | null;
  const popover = document.createElement('button');
  popover.className = 'gqd-delete-popover';
  popover.type = 'button';
  popover.textContent = '確認刪除';
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'false');
  popover.setAttribute('aria-label', 'Delete conversation confirmation');
  popover.style.position = 'fixed';
  popover.style.zIndex = '2147483647';
  popover.style.display = 'flex';
  popover.style.alignItems = 'center';
  popover.style.justifyContent = 'center';
  popover.style.minWidth = '112px';
  popover.style.minHeight = '36px';
  popover.style.padding = '0 18px';
  popover.style.borderRadius = '999px';
  popover.style.border = isDark ? '1px solid #dc362e' : '1px solid #b3261e';
  popover.style.background = isDark ? '#dc362e' : '#c5221f';
  popover.style.color = '#ffffff';
  popover.style.fontFamily = 'inherit';
  popover.style.fontSize = '14px';
  popover.style.fontWeight = '600';
  popover.style.cursor = 'pointer';
  popover.style.whiteSpace = 'nowrap';
  popover.style.boxShadow = isDark
    ? '0 10px 24px rgba(0, 0, 0, 0.34)'
    : '0 10px 24px rgba(60, 64, 67, 0.18)';
  popover.style.transformOrigin = 'left center';
  if (!prefersReducedMotion) {
    popover.style.transition = 'opacity 160ms ease, transform 160ms ease';
    popover.style.opacity = '0';
    popover.style.transform = 'translateX(-4px) scale(0.98)';
  }
  popover.style.outline = 'none';
  popover.addEventListener('mouseenter', () => {
    popover.style.background = isDark ? '#f04f46' : '#dc362e';
    popover.style.borderColor = isDark ? '#f04f46' : '#dc362e';
  });
  popover.addEventListener('mouseleave', () => {
    popover.style.background = isDark ? '#dc362e' : '#c5221f';
    popover.style.borderColor = isDark ? '#dc362e' : '#b3261e';
  });
  popover.addEventListener('focus', () => {
    popover.style.boxShadow = isDark
      ? '0 0 0 3px rgba(138, 180, 248, 0.55), 0 10px 24px rgba(0, 0, 0, 0.34)'
      : '0 0 0 3px rgba(26, 115, 232, 0.28), 0 10px 24px rgba(60, 64, 67, 0.18)';
  });
  popover.addEventListener('blur', () => {
    popover.style.boxShadow = isDark
      ? '0 10px 24px rgba(0, 0, 0, 0.34)'
      : '0 10px 24px rgba(60, 64, 67, 0.18)';
  });

  popover.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeDeletePopover();
    performDeleteSequence(menuBtn, true);
  });
  document.body.appendChild(popover);

  const referenceRect = (rowEl ?? anchorEl).getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const spacing = 12;
  let left = referenceRect.right + spacing;
  if (left + popoverRect.width > window.innerWidth - 8) {
    left = referenceRect.left - popoverRect.width - spacing;
  }
  left = Math.max(8, left);
  const top = Math.min(
    Math.max(8, referenceRect.top + (referenceRect.height - popoverRect.height) / 2),
    window.innerHeight - popoverRect.height - 8,
  );

  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
  if (!prefersReducedMotion) {
    requestAnimationFrame(() => {
      popover.style.opacity = '1';
      popover.style.transform = 'translateX(0) scale(1)';
    });
  }
  requestAnimationFrame(() => popover.focus());

  const handlePointerDown = (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (!target) return;
    if (popover.contains(target) || anchorEl.contains(target)) return;
    closeDeletePopover();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeDeletePopover();
    }
  };

  activeDeletePopover = popover;
  activeDeletePopoverCleanup = () => {
    document.removeEventListener('mousedown', handlePointerDown, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    popover.remove();
    activeDeletePopover = null;
    activeDeletePopoverCleanup = null;
  };

  document.addEventListener('mousedown', handlePointerDown, true);
  document.addEventListener('keydown', handleKeyDown, true);
}

/**
 * Triggers the deletion flow for the active conversation
 */
async function triggerDeletionFlow() {
  // 1. First, check if the final confirmation dialog is ALREADY visible
  if (confirmDeletion()) return;

  console.log("Gemini Shortcut: Dialog not detected. Identifying active conversation...");

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
      performDeleteSequence(activeChatMenuBtn as HTMLElement, currentConfig.directDelete);
  } else {
      console.log("Gemini Shortcut: Could not find active conversation (likely a new chat).");
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (matchesShortcut(e, currentConfig.shortcut)) {
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

// -----------------------------------------------------
// CONFIGURATION SYNC
// -----------------------------------------------------

function applyConfig(configToApply: AppConfig) {
  currentConfig = { ...DEFAULT_CONFIG, ...configToApply };
  console.log('Gemini Quick Delete config loaded:', currentConfig);
  
  if (currentConfig.enableTrashIcon) {
    document.body.classList.add('gqd-trash-enabled');
  } else {
    document.body.classList.remove('gqd-trash-enabled');
  }
}

chrome.storage.sync.get(['geminiQuickDeleteConfig', 'geminiQuickDeleteShortcut'], (result) => {
  if (result.geminiQuickDeleteConfig) {
    applyConfig(result.geminiQuickDeleteConfig);
  } else if (result.geminiQuickDeleteShortcut) {
    applyConfig({ ...DEFAULT_CONFIG, shortcut: result.geminiQuickDeleteShortcut });
  }
  
  window.addEventListener('keydown', handleKeyDown, true);
  initTrashIconsObserver();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.geminiQuickDeleteConfig) {
    applyConfig(changes.geminiQuickDeleteConfig.newValue);
  }
});

// -----------------------------------------------------
// TRASH ICON INJECTION
// -----------------------------------------------------

function createTrashIcon(menuBtn: HTMLElement) {
  const wrapper = document.createElement('button');
  wrapper.className = 'gqd-trash-btn';
  wrapper.type = 'button';
  wrapper.setAttribute('aria-label', 'Delete conversation');
  
  // Clean inline styles. No absolute positioning.
  wrapper.style.display = 'none';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.width = '32px';
  wrapper.style.height = '32px';
  wrapper.style.minWidth = '32px';
  wrapper.style.minHeight = '32px';
  wrapper.style.borderRadius = '10px';
  wrapper.style.border = 'none';
  wrapper.style.backgroundColor = 'transparent';
  wrapper.style.color = '#444746';
  wrapper.style.cursor = 'pointer';
  wrapper.style.padding = '6px';
  wrapper.style.margin = '0 4px 0 0'; // 4px margin to the right (between trash and 3-dots)
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.flexShrink = '0'; // Don't let flexbox crush it
  wrapper.style.transition = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'none'
    : 'background-color 160ms ease, color 160ms ease, box-shadow 160ms ease';
  
  wrapper.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `;
  
  wrapper.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmDeletion()) return;

    if (activeDeletePopover && activeDeletePopover.contains(e.target as Node)) {
      return;
    }

    showDeletePopover(wrapper, menuBtn);
  });

  // Handle active states independently of global CSS
  wrapper.addEventListener('mouseenter', () => {
    // Dark mode check via simple media query in JS
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    wrapper.style.backgroundColor = isDark ? 'rgba(242, 184, 181, 0.12)' : 'rgba(217, 48, 37, 0.08)';
    wrapper.style.color = isDark ? '#f2b8b5' : '#b3261e';
  });
  
  wrapper.addEventListener('mouseleave', () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    wrapper.style.backgroundColor = 'transparent';
    wrapper.style.color = isDark ? '#c4c7c5' : '#444746';
  });

  wrapper.addEventListener('focus', () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    wrapper.style.boxShadow = isDark
      ? '0 0 0 2px rgba(242, 184, 181, 0.32)'
      : '0 0 0 2px rgba(217, 48, 37, 0.2)';
  });

  wrapper.addEventListener('blur', () => {
    wrapper.style.boxShadow = 'none';
  });

  return wrapper;
}

// Observe DOM for new conversation items
function initTrashIconsObserver() {
  const observer = new MutationObserver(() => {
    if (!currentConfig.enableTrashIcon) return;

    // Find all menu buttons in the chat list. Use strict selectors to avoid global buttons.
    const menuButtons = document.querySelectorAll('nav button[aria-haspopup="menu"]:not(.gqd-processed), .conversation-actions-menu-button:not(.gqd-processed)');
    
    menuButtons.forEach(btn => {
      btn.classList.add('gqd-processed');
      const container = btn.parentElement;
      if (container) {
        container.classList.add('gqd-convo-container');
        // Prevent duplicate icons
        if (!container.querySelector('.gqd-trash-btn')) {
          const trashBtn = createTrashIcon(btn as HTMLElement);
          
          // Insert BEFORE the 3-dots menu button, placing it cleanly in the flex row
          container.insertBefore(trashBtn, btn);
          
          // Manage hover state via JS to absolutely avoid CSS layout side effects
          container.addEventListener('mouseenter', () => {
            if (currentConfig.enableTrashIcon) {
              trashBtn.style.display = 'flex';
              // Keep text color in sync with system theme when showing
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              trashBtn.style.color = isDark ? '#c4c7c5' : '#444746';
            }
          });
          
          container.addEventListener('mouseleave', () => {
            trashBtn.style.display = 'none';
          });
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
