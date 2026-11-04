const P: Record<string, React.ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  cart: <><path d="M3 4h2.2l2 11h10.4l2-8H6.4" /><circle cx="9" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  whatsapp: <><path d="M4 20l1.2-4.2A8 8 0 1 1 8.3 18.9z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .7a4 4 0 0 1-1.9-1.9l.7-1-1-2z" /></>,
  upload: <><path d="M12 16V5" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
  home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
  pin: <><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  star: <path d="m12 3.5 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.9l6.1-.8z" />,
  box: <><path d="M4 8 12 4l8 4v8l-8 4-8-4z" /><path d="m4 8 8 4 8-4M12 12v8" /></>,
  rx: <><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M9 8h4a2 2 0 0 1 0 4H9v5M12.5 12 16 17" /></>,
  pill: <g transform="rotate(-40 12 12)"><rect x="3" y="8" width="18" height="8" rx="4" /><path d="M12 8v8" /></g>,
  text: <><path d="M4 18 9 6l5 12" /><path d="M5.8 14h6.4" /><path d="M16 10h4M18 8v4" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  card: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18" /></>,
  help: <><circle cx="12" cy="12" r="8.5" /><path d="M9.7 9.5a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.8-1.1 1.6" /><path d="M12 16.5v.1" /></>,
  locate: <><circle cx="12" cy="12" r="3.5" /><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
};

export default function Icon({
  name,
  size = 22,
  className = "",
  fill = false,
}: {
  name: keyof typeof P | string;
  size?: number;
  className?: string;
  fill?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {P[name]}
    </svg>
  );
}
