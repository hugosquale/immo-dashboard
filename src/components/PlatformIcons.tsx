type IconProps = { className?: string };

export function InstagramIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4c.4 2.2 2 3.8 4.2 4.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FacebookIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M13.8 8.5h-1.4c-.9 0-1.4.5-1.4 1.4V11h2.6l-.4 2.3h-2.2V19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LeBonCoinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        d="M4 12.5 12.5 4h6.5a1 1 0 0 1 1 1v6.5L11.5 20a1 1 0 0 1-1.4 0L4 13.9a1 1 0 0 1 0-1.4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
