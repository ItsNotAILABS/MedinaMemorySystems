/** Cursor-grade SVG icons — 16/20px line icons */

type IconProps = { className?: string; size?: number };

const S = ({ size = 16, className, children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
    {children}
  </svg>
);

export function IconFiles({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M2 3h5l1 1h6v9H2V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </S>
  );
}

export function IconGit({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      <circle cx="11" cy="5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="11" r="1.5" fill="currentColor" />
      <path d="M5 6.5v2M11 6.5v2M5 8h6" stroke="currentColor" strokeWidth="1.2" />
    </S>
  );
}

export function IconGithub({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path fill="currentColor" d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.2a5.8 5.8 0 010 11.6A5.8 5.8 0 018 2.2z" opacity="0" />
      <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M8 1.5A6.5 6.5 0 1014.5 8 6.51 6.51 0 008 1.5zM6.3 12.4c0 .2.2.4.4.4h3.6c.2 0 .4-.2.4-.4v-.1c0-.8-.3-1.2-1-1.6-.8-.4-1.3-.6-1.3-1.1 0-.3.2-.5.5-.7.8-.4 1.3-1 1.3-2.1 0-1.1-.8-1.9-2-2.1V3.8c-.4-.1-.8-.2-1.2-.2s-.8.1-1.2.2v.9c-1.2.2-2 1-2 2.1 0 1.1.5 1.7 1.3 2.1.3.2.5.4.5.7 0 .5-.5.7-1.3 1.1-.7.4-1 1-1 1.6v.1z" />
    </S>
  );
}

export function IconRocket({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M8 2l2 4 4 1-3 3 1 5-4-2-4 2 1-5-3-3 4-1 2-4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </S>
  );
}

export function IconTerminal({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 6l2 2-2 2M7 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </S>
  );
}

export function IconAgent({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 3l1-1M12 5h1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </S>
  );
}

export function IconPlay({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M5 3.5l7 4.5-7 4.5V3.5z" fill="currentColor" />
    </S>
  );
}

export function IconGlobe({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </S>
  );
}

export function IconCode({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M5 4L2 8l3 4M11 4l3 4-3 4M9 3l-2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </S>
  );
}

export function IconChevronDown({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </S>
  );
}

export function IconPlus({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </S>
  );
}

export function IconSend({ className, size }: IconProps) {
  return (
    <S size={size} className={className}>
      <path d="M14 2L7 9M14 2l-4 12-3-5-5-3 12-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </S>
  );
}

export function IconMedina({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect width="24" height="24" rx="6" fill="url(#medina-grad)" />
      <path d="M7 16V8l5 4 5-4v8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="medina-grad" x1="0" y1="0" x2="24" y2="24">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
