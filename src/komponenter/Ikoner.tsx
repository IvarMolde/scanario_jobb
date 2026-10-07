import type { AppId } from '../modell/typer'

export function AppIkon({ app }: { app: AppId }) {
  const felles = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (app) {
    case 'hjem':
      return (
        <svg {...felles}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M6 10.5V20h12v-9.5" />
        </svg>
      )
    case 'meldinger':
      return (
        <svg {...felles}>
          <path d="M4 6h16v10H8l-4 3V6z" />
        </svg>
      )
    case 'epost':
      return (
        <svg {...felles}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 7 9-7" />
        </svg>
      )
    case 'kalender':
      return (
        <svg {...felles}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      )
    case 'jobbportal':
      return (
        <svg {...felles}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20 16 16" />
        </svg>
      )
    case 'aktivitetsplan':
      return (
        <svg {...felles}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      )
    case 'cv':
      return (
        <svg {...felles}>
          <path d="M8 4h8l4 4v12H8z" />
          <path d="M16 4v4h4M10 13h6M10 17h4" />
        </svg>
      )
    case 'reise':
      return (
        <svg {...felles}>
          <rect x="3" y="8" width="18" height="9" rx="2" />
          <path d="M7 17v2M17 17v2M3 12h18" />
        </svg>
      )
    case 'jobbmagasin':
      return (
        <svg {...felles}>
          <path d="M4 5h10v14H4zM14 7h6v12H14" />
        </svg>
      )
    case 'skatt':
      return (
        <svg {...felles}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      )
    case 'lonn':
      return (
        <svg {...felles}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 12h10M12 9v6" />
        </svg>
      )
    case 'innstillinger':
      return (
        <svg {...felles}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M3 12h3M18 12h3M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1" />
        </svg>
      )
    default:
      return null
  }
}
