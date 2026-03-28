import React from 'react';

type IconProps = {
  className?: string;
};

function SvgIcon({
  children,
  className = '',
  viewBox = '0 0 24 24',
}: React.PropsWithChildren<IconProps & { viewBox?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
    >
      {children}
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 3l1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" />
      <path d="M5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z" />
      <path d="M19 13l.9 2.1L22 16l-2.1.9L19 19l-.9-2.1L16 16l2.1-.9L19 13Z" />
    </SvgIcon>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-1 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 1-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .7 1 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-1 .7Z" />
    </SvgIcon>
  );
}

export function KeyboardIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="6.5" width="18" height="11" rx="2.5" />
      <path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 13h.01M10 13h4M16 13h.01" />
    </SvgIcon>
  );
}

export function ShortcutIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M6 8a3 3 0 1 1 5.7 1.3L9.5 12" />
      <path d="M18 16a3 3 0 1 1-5.7-1.3l2.2-2.7" />
      <path d="M9 15l6-6" />
    </SvgIcon>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </SvgIcon>
  );
}

export function DeleteSweepIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4.8A1.8 1.8 0 0 1 9.8 3h4.4A1.8 1.8 0 0 1 16 4.8V6" />
      <path d="M6.5 6l.9 11.1A2 2 0 0 0 9.4 19h5.2a2 2 0 0 0 2-1.9L17.5 6" />
      <path d="M10 10.5v4.5M14 10.5v4.5M18.5 14.5 21 17l-2.5 2.5" />
    </SvgIcon>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </SvgIcon>
  );
}

export function FeedbackIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-5 4v-6.5A2.5 2.5 0 0 1 4 12.5v-7Z" />
      <path d="M8 8h8M8 11h5" />
    </SvgIcon>
  );
}

export function CoffeeIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M6 9h9a0 0 0 0 1 0 0v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V9a0 0 0 0 1 0 0Z" />
      <path d="M15 10h1a2 2 0 1 1 0 4h-1" />
      <path d="M8 3v3M11 3v3" />
      <path d="M5 20h11" />
    </SvgIcon>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="m7 9 3 3-3 3M12.5 15H17" />
    </SvgIcon>
  );
}

export function ResetIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </SvgIcon>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="m9 6 6 6-6 6" />
    </SvgIcon>
  );
}
